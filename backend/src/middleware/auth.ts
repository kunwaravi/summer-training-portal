import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../services/authService';
import { getRequiredEnv } from '../lib/env';

// SECURITY (#65): fail-fast — no hardcoded fallback secret.
const JWT_SECRET = getRequiredEnv('JWT_SECRET');

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      console.warn(`Auth Failed: No token provided for ${req.method} ${req.path}`);
      return res.status(401).json({ message: 'Access token missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await getUserById(decoded.userId);

    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    if (error.statusCode === 404) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};
