import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { validateBody } from '../middleware/validate';

const router = Router();

// Middleware to verify admin privileges
const isAdmin = (req: any, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/projects/status/:courseId - Get student project status
router.get('/status/:courseId', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const submission = await prisma.projectSubmission.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });

    res.json({ submission });
  } catch (err: any) {
    logger.error('Fetch project status error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/projects/submit - Submit final project
router.post(
  '/submit',
  authenticateToken,
  validateBody(['courseId', 'title', 'description', 'sourceCodeUrl', 'reportUrl']),
  async (req: any, res: Response): Promise<any> => {
    try {
      const { courseId, title, description, sourceCodeUrl, reportUrl, githubUrl } = req.body;
      const userId = req.user.id;

      // Check if student has completed Week 4 (i.e. Module 20)
      if (req.user.role !== 'ADMIN') {
        const completedCount = await prisma.moduleProgress.count({
          where: { userId, courseId, quizPassed: true }
        });
        if (completedCount < 20) {
          return res.status(403).json({ 
            message: `Locked Project: You must pass the quiz for all 20 modules before submitting your Final Project. Currently completed: ${completedCount}/20.`
          });
        }
      }

      const submission = await prisma.projectSubmission.upsert({
        where: {
          userId_courseId: { userId, courseId }
        },
        update: {
          title,
          description,
          sourceCodeUrl,
          reportUrl,
          githubUrl: githubUrl || null,
          status: 'PENDING',
          feedback: null
        },
        create: {
          userId,
          courseId,
          title,
          description,
          sourceCodeUrl,
          reportUrl,
          githubUrl: githubUrl || null,
          status: 'PENDING'
        }
      });

      logger.info(`Student ${userId} submitted final project for course ${courseId}: ${title}`);
      res.json({ success: true, submission });
    } catch (err: any) {
      logger.error('Submit project error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ADMIN - GET /api/projects/admin/pending - Get all pending projects
router.get('/admin/pending', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const pending = await prisma.projectSubmission.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ pending });
  } catch (err: any) {
    logger.error('Fetch pending projects error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - PUT /api/projects/admin/evaluate/:id - Approve or reject project
router.put(
  '/admin/evaluate/:id',
  authenticateToken,
  isAdmin,
  validateBody(['status']),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = parseInt(req.params.id as string);
      const { status, feedback } = req.body;

      if (status !== 'APPROVED' && status !== 'REJECTED') {
        return res.status(400).json({ message: 'Status must be APPROVED or REJECTED.' });
      }

      const submission = await prisma.projectSubmission.findUnique({
        where: { id }
      });

      if (!submission) {
        return res.status(404).json({ message: 'Project submission not found.' });
      }

      const updated = await prisma.projectSubmission.update({
        where: { id },
        data: {
          status,
          feedback: feedback || null
        }
      });

      // Award 100 XP points on project approval
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: submission.userId },
          data: { points: { increment: 100 } }
        });
      }

      logger.info(`Admin evaluated project ${id} as ${status}`);
      res.json({ success: true, submission: updated });
    } catch (err: any) {
      logger.error('Evaluate project error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// GET /api/projects/:courseId/solutions - Peer project solutions browser (issue #75)
// Only learners with an APPROVED project can view peers; only APPROVED + shareSolution
// submissions are shown; no PII (email, phone) is ever exposed.
router.get('/:courseId/solutions', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const userId = req.user.id;

    // Gate: viewer must have their project approved first
    const mySubmission = await prisma.projectSubmission.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });
    if (!mySubmission || mySubmission.status !== 'APPROVED') {
      return res.status(403).json({
        message: 'Get your project approved to view peer solutions.'
      });
    }

    const solutions = await prisma.projectSubmission.findMany({
      where: {
        courseId,
        status: 'APPROVED',
        shareSolution: true,
        userId: { not: userId }
      },
      select: {
        id: true,
        title: true,
        description: true,
        sourceCodeUrl: true,
        reportUrl: true,
        githubUrl: true,
        submittedAt: true,
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ solutions });
  } catch (err: any) {
    logger.error('Fetch project peer solutions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/projects/:id/privacy - toggle own solution sharing (issue #75)
router.patch(
  '/:id/privacy',
  authenticateToken,
  validateBody(['shareSolution']),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = parseInt(req.params.id as string);
      const { shareSolution } = req.body as any;

      const submission = await prisma.projectSubmission.findUnique({ where: { id } });
      if (!submission) return res.status(404).json({ message: 'Submission not found.' });

      const isOwner = (req as any).user.id === submission.userId;
      const isAdminUser = (req as any).user.role === 'ADMIN';
      if (!isOwner && !isAdminUser) {
        return res.status(403).json({ message: 'You can only update your own submission.' });
      }

      const updated = await prisma.projectSubmission.update({
        where: { id },
        data: { shareSolution: !!shareSolution }
      });

      logger.info(`User ${(req as any).user.id} set project ${id} shareSolution=${updated.shareSolution}`);
      res.json({ success: true, shareSolution: updated.shareSolution });
    } catch (err: any) {
      logger.error('Update project privacy error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
