import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { logger } from '../lib/logger';
import { rateLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Middleware to verify admin privileges
const isAdmin = (req: any, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// POST /api/auth/register - Register a new candidate
router.post(
  '/register',
  rateLimiter(5, 60 * 1000), // Max 5 registration requests per minute
  validateBody(['email', 'password', 'name', 'collegeName', 'branchName']),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password, name, collegeName, branchName } = req.body;
      const emailNormalized = email ? email.toLowerCase().trim() : '';

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        logger.error(`Registration failed: Password complexity not met for ${emailNormalized}`);
        return res.status(400).json({ 
          message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' 
        });
      }
      
      const existingUser = await prisma.user.findUnique({ where: { email: emailNormalized } });
      if (existingUser) {
        logger.error(`Registration failed: User ${emailNormalized} already registered.`);
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      const user = await prisma.user.create({
        data: {
          email: emailNormalized,
          password: hashedPassword,
          name,
          collegeName,
          branchName,
          isVerified: true, // Auto-verify for frictionless onboarding
          verificationToken: null
        },
        include: {
          progresses: true,
          results: true,
          moduleProgresses: true,
          assignments: true,
          projects: true
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

      logger.info(`User successfully registered (auto-verified): ${emailNormalized}`);
      
      res.status(201).json({ 
        token,
        user: userWithoutPassword,
        message: 'Registration successful!' 
      });
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
      const emailNormalized = email ? email.toLowerCase().trim() : '';
      const user = await prisma.user.findUnique({
        where: { email: emailNormalized },
        include: {
          progresses: true,
          results: true
        }
      });
      if (!user) {
        logger.error(`Login failed: Invalid email attempt for ${emailNormalized}`);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.error(`Login failed: Invalid password attempt for ${emailNormalized}`);
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

      logger.info(`User successfully logged in: ${emailNormalized}`);
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

// PUT /api/auth/profile - Update currently logged in student profile
router.put('/profile', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { name, collegeName, branchName, password } = req.body;
    const userId = req.user.id;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (collegeName) dataToUpdate.collegeName = collegeName;
    if (branchName) dataToUpdate.branchName = branchName;
    
    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ 
          message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' 
        });
      }
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: {
        progresses: true,
        results: true,
        moduleProgresses: true,
        assignments: true,
        projects: true
      }
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    logger.info(`User profile updated successfully: ${updatedUser.email}`);
    res.json({ success: true, user: userWithoutPassword, message: 'Profile updated successfully!' });
  } catch (error: any) {
    logger.error('Update profile error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/auth/verify - Verify student account via cryptographically secure token (Issue #39 M13)
router.get('/verify', async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Verification token is required.' });
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      logger.error(`Account verification failed: Invalid token ${token}`);
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    logger.info(`[SUCCESS] Account successfully verified: ${user.email}`);
    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (error: any) {
    logger.error('Account verification error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password - Generate password reset token (Issue #39 M14)
router.post('/forgot-password', async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }
    const emailNormalized = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: emailNormalized } });
    
    // To prevent email enumeration, we always return success to the client
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpires
        }
      });

      logger.info(`[SIMULATION] Password reset link for ${emailNormalized}: http://localhost:8080/reset-password?token=${resetToken}`);
    } else {
      logger.info(`Password reset requested for non-existent email: ${emailNormalized}`);
    }

    res.json({ success: true, message: 'If that email address exists in our registry, a password reset link has been dispatched.' });
  } catch (error: any) {
    logger.error('Forgot password error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/reset-password - Verify reset token and apply new password (Issue #39 M14)
router.post('/reset-password', async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).' 
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      logger.error(`Password reset failed: Invalid or expired token ${token}`);
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    logger.info(`[SUCCESS] Password successfully reset for user: ${user.email}`);
    res.json({ success: true, message: 'Password successfully reset! You can now log in.' });
  } catch (error: any) {
    logger.error('Reset password error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/auth/google - Authenticate using Google credentials
router.post(
  '/google',
  rateLimiter(10, 60 * 1000),
  validateBody(['email', 'name']),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, name } = req.body;
      const emailNormalized = email ? email.toLowerCase().trim() : '';

      let user = await prisma.user.findUnique({
        where: { email: emailNormalized },
        include: {
          progresses: true,
          results: true
        }
      });

      if (!user) {
        const tempPassword = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        
        user = await prisma.user.create({
          data: {
            email: emailNormalized,
            password: hashedPassword,
            name,
            collegeName: 'Google Linked Account',
            branchName: 'N/A',
            isVerified: true,
          },
          include: {
            progresses: true,
            results: true
          }
        });
        logger.info(`Google Authentication: Registered new user: ${emailNormalized}`);
      } else {
        if (!user.isVerified) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null },
            include: { progresses: true, results: true }
          });
          logger.info(`Google Authentication: Verified existing user: ${emailNormalized}`);
        }
        logger.info(`Google Authentication: User logged in: ${emailNormalized}`);
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        token,
        user: userWithoutPassword 
      });
    } catch (error: any) {
      logger.error('Google Auth error caught in handler:', error);
      res.status(500).json({ message: 'Internal server error during Google Authentication' });
    }
  }
);

// Admin User Manager Endpoints

// GET /api/auth/admin/users - List all users
router.get('/admin/users', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        collegeName: true,
        branchName: true,
        points: true,
        role: true,
        isVerified: true,
        createdAt: true
      }
    });
    res.json({ users });
  } catch (error: any) {
    logger.error('Fetch all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/auth/admin/user/:userId/role - Update user role
router.put('/admin/user/:userId/role', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const userIdNum = parseInt(userId);

    if (role !== 'USER' && role !== 'ADMIN') {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const updated = await prisma.user.update({
      where: { id: userIdNum },
      data: { role },
      select: { id: true, name: true, role: true }
    });

    logger.info(`Admin successfully updated role of user ${userIdNum} to ${role}`);
    res.json(updated);
  } catch (error: any) {
    logger.error('Update user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/auth/admin/user/:userId/verify - Update user verification
router.put('/admin/user/:userId/verify', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;
    const userIdNum = parseInt(userId);

    const updated = await prisma.user.update({
      where: { id: userIdNum },
      data: { isVerified },
      select: { id: true, name: true, isVerified: true }
    });

    logger.info(`Admin successfully updated verification status of user ${userIdNum} to ${isVerified}`);
    res.json(updated);
  } catch (error: any) {
    logger.error('Update user verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/auth/admin/user/:userId - Delete user
router.delete('/admin/user/:userId', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const userIdNum = parseInt(userId);

    await prisma.user.delete({
      where: { id: userIdNum }
    });

    logger.info(`Admin successfully deleted user account ID ${userIdNum}`);
    res.json({ message: 'User deleted successfully.' });
  } catch (error: any) {
    logger.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

