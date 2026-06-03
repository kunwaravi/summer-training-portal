import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Extract JWT from HTTP-only cookie (Issue #1)
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required: Active session token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        progresses: true,
        results: true,
        moduleProgresses: true,
        assignments: true,
        projects: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    logger.error('Authentication middleware authorization failed:', error);
    return res.status(403).json({ message: 'Session expired or invalid token.' });
  }
};
