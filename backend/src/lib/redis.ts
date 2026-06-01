import Redis from 'ioredis';
import { logger } from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  lazyConnect: true,
});

redis.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redis.on('connect', () => {
  logger.info('Connected to Redis successfully.');
});
