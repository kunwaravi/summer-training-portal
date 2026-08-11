import Redis from 'ioredis';
import { logger } from './logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const useMock = process.env.NODE_ENV !== 'production' && !process.env.REDIS_URL;

/**
 * In-memory Redis stand-in for local development. Mirrors the subset of the
 * Redis interface the app actually uses (get/set/setex/del/on) and honours TTLs
 * so dev behaviour matches production instead of silently caching forever.
 */
class MockRedis {
  private cache = new Map<string, { value: string; expiresAt: number }>();

  async get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, val: string, mode?: string, time?: number) {
    const ttlMs = mode === 'EX' && time ? time * 1000 : 0;
    this.cache.set(key, { value: val, expiresAt: Date.now() + ttlMs });
    return 'OK';
  }

  async setex(key: string, seconds: number, val: string) {
    this.cache.set(key, { value: val, expiresAt: Date.now() + seconds * 1000 });
    return 'OK';
  }

  async del(key: string) {
    this.cache.delete(key);
    return 1;
  }

  on() {}
}

/** Minimal subset of the Redis API used across the app — lets the mock and the
 *  real client share one typed export (no `as any` escape hatch). */
export interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, time?: number): Promise<unknown>;
  setex(key: string, seconds: number, value: string): Promise<unknown>;
  del(key: string): Promise<unknown>;
  on(event: string, cb: (err?: unknown) => void): unknown;
}

// Narrow cast for the real client: ioredis exposes many more overloads than we
// use; `RedisLike` documents the exact subset and keeps the mock honest.
export const redis: RedisLike = useMock ? new MockRedis() : (new Redis(redisUrl, { lazyConnect: true }) as RedisLike);

if (!useMock) {
  redis.on('error', (err: any) => logger.error('Redis client error:', err));
  redis.on('connect', () => logger.info('Connected to Redis successfully.'));
} else {
  logger.info('Running with MOCK Redis (In-Memory) for local development.');
}
