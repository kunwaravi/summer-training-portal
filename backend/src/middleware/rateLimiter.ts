import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Background worker to periodically prune expired rate-limit records every 5 minutes to prevent memory leaks (Issue #9)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref(); // unref() lets the process exit cleanly if idle

export const rateLimiter = (limit: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown') as string;
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > limit) {
      logger.error(`Security Check: Rate limit exceeded for IP: ${ip} on path ${req.path}`);
      return res.status(429).json({
        message: 'Too many requests from this device. Please try again later.'
      });
    }

    next();
  };
};
