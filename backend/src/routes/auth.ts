import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register - Register a new candidate
router.post(
  '/register',
  rateLimiter(5, 60 * 1000), // Max 5 registration requests per minute
  validateBody(['email', 'password', 'name', 'collegeName', 'branchName']),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, name, collegeName, branchName } = req.body;
      
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        logger.error(`Registration failed: User ${email} already registered.`);
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          collegeName,
          branchName
        },
        include: {
          progresses: true,
          results: true
        }
      });

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
      
      // Set secure HTTP-Only cookie (Issue #1)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Omit password from return
      const { password: _, ...userWithoutPassword } = user;

      logger.info(`User successfully registered: ${email}`);
      res.status(201).json({ user: userWithoutPassword });
    } catch (error: any) {
      logger.error('Registration error caught in handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// POST /api/auth/login - Authenticate credentials and initiate session
router.post(
  '/login',
  rateLimiter(5, 60 * 1000), // Max 5 login attempts per minute (Issue #2)
  validateBody(['email', 'password']),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          progresses: true,
          results: true
        }
      });
      if (!user) {
        logger.error(`Login failed: Invalid email attempt for ${email}`);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.error(`Login failed: Invalid password attempt for ${email}`);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
      
      // Set secure HTTP-Only cookie (Issue #1)
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Omit password from return
      const { password: _, ...userWithoutPassword } = user;

      logger.info(`User successfully logged in: ${email}`);
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      logger.error('Login error caught in handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// POST /api/auth/logout - Clear cookie session
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  logger.info('User session cookie cleared successfully.');
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - Fetch currently logged in student profile
router.get('/me', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    logger.error('Fetch profile error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
