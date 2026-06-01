import Redis from 'ioredis';
import { logger } from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const useMock = process.env.NODE_ENV !== 'production' && !process.env.REDIS_URL;

class MockRedis {
  private cache = new Map<string, string>();
  async get(key: string) { return this.cache.get(key) || null; }
  async set(key: string, val: string, ex?: string, time?: number) { this.cache.set(key, val); return 'OK'; }
  async del(key: string) { this.cache.delete(key); return 1; }
  on() {}
}

export const redis = useMock ? (new MockRedis() as any) : new Redis(redisUrl, { lazyConnect: true });

if (!useMock) {
  redis.on('error', (err: any) => logger.error('Redis client error:', err));
  redis.on('connect', () => logger.info('Connected to Redis successfully.'));
} else {
  logger.info('Running with MOCK Redis (In-Memory) for local development.');
}
