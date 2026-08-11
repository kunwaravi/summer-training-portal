/**
 * Express Request type augmentation (issue: pervasive `req: any` casts).
 *
 * `authenticateToken` attaches the authenticated user to `req.user`. Declaring
 * it here (non-optional, matching the pattern of a protected-route codebase)
 * lets handlers use `req.user.id` / `req.user.role` with real type safety
 * instead of `req: any`. The index signature keeps the assignment of the full
 * Prisma user record sound while still typing the fields routes actually use.
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

export {};
