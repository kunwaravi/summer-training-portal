import { Router, Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { validate, registerSchema, loginSchema } from '../middleware/validation';

const router = Router();

router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Fetch currently logged in student profile
router.get('/me', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/admin/users - Fetch all users for admin dashboard dropdown
router.get('/admin/users', authenticateToken, isAdmin, async (req: any, res: Response, next: NextFunction) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
