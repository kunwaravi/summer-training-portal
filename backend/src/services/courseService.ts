import prisma from '../lib/prisma';
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';

export const getCurriculumMap = async () => {
  const cacheKey = 'course:curriculumMap';

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache Hit: ${cacheKey}`);
      return JSON.parse(cachedData);
    }
  } catch (err) {
    logger.warn('Redis cache get error:', err);
  }

  logger.info(`Cache Miss: ${cacheKey}`);

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        select: {
          id: true,
          order: true,
          title: true,
          description: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  const curriculumMap: Record<string, any[]> = {};
  for (const c of courses) {
    curriculumMap[c.id] = c.modules;
  }

  try {
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(curriculumMap));
  } catch (err) {
    logger.warn('Redis cache set error:', err);
  }

  return curriculumMap;
};

export const getModuleWithTopics = async (courseId: string, orderNum: number, userId: string, userRole: string) => {
  // Check if the user is an Admin OR has made a successful payment for this course
  const successPayment = await prisma.payment.findFirst({
    where: {
      userId,
      courseId,
      status: 'SUCCESS'
    }
  });

  if (!successPayment && userRole !== 'ADMIN') {
    logger.error(`Syllabus detail access blocked: User ${userId} has not purchased course ${courseId}`);
    const error: any = new Error('Payment required: Please purchase this course track to unlock full syllabus topics.');
    error.statusCode = 402;
    error.paymentRequired = true;
    throw error;
  }

  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      order: orderNum
    },
    include: {
      topics: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!moduleRecord) {
    logger.error(`Fetch module details failure: Order ${orderNum} for course ${courseId} not found.`);
    const error: any = new Error(`Module at order ${orderNum} for course ${courseId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return moduleRecord;
};
