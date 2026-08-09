import dotenv from 'dotenv';

// Load .env as early as possible. This module is imported FIRST in index.ts so
// that every other module reading process.env at import time sees the values.
dotenv.config();

/**
 * Read a required environment variable or fail fast.
 *
 * SECURITY (#65): never fall back to a hardcoded secret. If a required secret
 * is missing the process throws with a clear message instead of silently
 * running with a publicly-known value.
 */
export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Set it in backend/.env (see backend/.env.example).`
    );
  }
  return value;
};
