import prisma from '../lib/prisma';
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';

export const getLeaderboard = async (search: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const whereClause: any = {};
  
  if (search && typeof search === 'string') {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const cacheKey = `leaderboard:${search || 'all'}:${page}:${limit}`;
  
  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache Hit: ${cacheKey}`);
      return JSON.parse(cachedData);
    }
  } catch (err) {
    logger.error('Redis cache get error:', err);
  }

  logger.info(`Cache Miss: ${cacheKey}`);

  const [leaderboard, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      // SECURITY (#100): no email/role in the public leaderboard — any
      // authenticated user could previously dump every account's email.
      select: {
        id: true,
        name: true,
        points: true,
        badges: true,
        avatarUrl: true,
        collegeName: true,
      },
      orderBy: {
        points: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: whereClause })
  ]);

  const result = { leaderboard, total };

  try {
    // Cache for 5 minutes (300 seconds)
    await redis.setex(cacheKey, 300, JSON.stringify(result));
  } catch (err) {
    logger.error('Redis cache set error:', err);
  }

  return result;
};
