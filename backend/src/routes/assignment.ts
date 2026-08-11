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

// GET /api/assignments/status/:courseId - Get all submissions for course
router.get('/status/:courseId', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const userId = req.user.id;

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { userId, courseId },
      orderBy: { weekNumber: 'asc' }
    });

    res.json({ submissions });
  } catch (err: any) {
    logger.error('Fetch assignment status error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/assignments/submit - Submit assignment
router.post(
  '/submit',
  authenticateToken,
  validateBody(['courseId', 'weekNumber', 'fileName']),
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { courseId, weekNumber, fileName, fileUrl } = req.body;
      const userId = req.user.id;
      const weekNum = parseInt(weekNumber);

      // Verify that student has passed modules up to that week
      // Week 1 -> Module 5, Week 2 -> Module 10, Week 3 -> Module 15, Week 4 -> Module 20
      const reqModuleOrder = weekNum * 5;
      const moduleRecord = await prisma.module.findFirst({
        where: { courseId, week: reqModuleOrder }
      });

      if (!moduleRecord && req.user.role !== 'ADMIN') {
        return res.status(400).json({ message: `Invalid week number: Module ${reqModuleOrder} does not exist.` });
      }

      if (moduleRecord && req.user.role !== 'ADMIN') {
        const moduleProgress = await prisma.moduleProgress.findUnique({
          where: { userId_moduleId: { userId, moduleId: moduleRecord.id } }
        });
        if (!moduleProgress || !moduleProgress.quizPassed) {
          return res.status(403).json({ 
            message: `Locked Assignment: You must complete Module ${reqModuleOrder} and pass its quiz before submitting Week ${weekNum} Assignment.` 
          });
        }
      }

      const submission = await prisma.assignmentSubmission.upsert({
        where: {
          userId_courseId_weekNumber: {
            userId,
            courseId,
            weekNumber: weekNum
          }
        },
        update: {
          fileName,
          fileUrl: fileUrl || `/uploads/mock_${fileName}`,
          status: 'PENDING',
          feedback: null
        },
        create: {
          userId,
          courseId,
          weekNumber: weekNum,
          fileName,
          fileUrl: fileUrl || `/uploads/mock_${fileName}`,
          status: 'PENDING'
        }
      });

      logger.info(`Student ${userId} submitted Week ${weekNum} assignment for course ${courseId}`);
      res.json({ success: true, submission });
    } catch (err: any) {
      logger.error('Submit assignment error:', err);
      next(err);
    }
  }
);

// ADMIN - GET /api/assignments/admin/pending - Get all pending assignments
router.get('/admin/pending', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const pending = await prisma.assignmentSubmission.findMany({
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
    logger.error('Fetch pending assignments error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - GET /api/assignments/admin/all - Full submission queue (review stats + history, issue #82)
router.get('/admin/all', authenticateToken, isAdmin, async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const submissions = await prisma.assignmentSubmission.findMany({
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
    res.json({ submissions });
  } catch (err: any) {
    logger.error('Fetch all assignments error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - PUT /api/assignments/admin/evaluate/:id - Approve or reject assignment
router.put(
  '/admin/evaluate/:id',
  authenticateToken,
  isAdmin,
  validateBody(['status']),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params as any;
      const idNum = parseInt(id);
      const { status, feedback } = req.body;

      if (status !== 'APPROVED' && status !== 'REJECTED') {
        return res.status(400).json({ message: 'Status must be APPROVED or REJECTED.' });
      }

      const submission = await prisma.assignmentSubmission.findUnique({
        where: { id: idNum }
      });

      if (!submission) {
        return res.status(404).json({ message: 'Assignment submission not found.' });
      }

      const updated = await prisma.assignmentSubmission.update({
        where: { id: idNum },
        data: {
          status,
          feedback: feedback || null
        }
      });

      // Award 20 XP on approval
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: submission.userId },
          data: { points: { increment: 20 } }
        });
      }

      logger.info(`Admin evaluated assignment ${idNum} as ${status}`);
      res.json({ success: true, submission: updated });
    } catch (err: any) {
      logger.error('Evaluate assignment error:', err);
      next(err);
    }
  }
);

// GET /api/assignments/:courseId/solutions?weekNumber=N - Peer solutions browser (issue #75)
// Only learners with an APPROVED submission for that week can view peers; only APPROVED + shareSolution
// submissions are shown; no PII (email, phone) is ever exposed.
router.get('/:courseId/solutions', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const weekNumber = parseInt(req.query.weekNumber as string);
    const userId = req.user.id;

    if (isNaN(weekNumber)) {
      return res.status(400).json({ message: 'Valid weekNumber query param is required.' });
    }

    // Gate: viewer must have this week approved before browsing peers (freeCodeCamp-style)
    const mySubmission = await prisma.assignmentSubmission.findUnique({
      where: { userId_courseId_weekNumber: { userId, courseId, weekNumber } }
    });
    if (!mySubmission || mySubmission.status !== 'APPROVED') {
      return res.status(403).json({
        message: 'Complete this week and get it approved to view peer solutions.'
      });
    }

    const solutions = await prisma.assignmentSubmission.findMany({
      where: {
        courseId,
        weekNumber,
        status: 'APPROVED',
        shareSolution: true,
        userId: { not: userId }
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        submittedAt: true,
        user: {
          select: { id: true, name: true, avatarUrl: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json({ solutions });
  } catch (err: any) {
    logger.error('Fetch peer solutions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH /api/assignments/:id/privacy - toggle own solution sharing (issue #75)
router.patch(
  '/:id/privacy',
  authenticateToken,
  validateBody(['shareSolution']),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const id = parseInt(req.params.id as string);
      const { shareSolution } = req.body as any;

      const submission = await prisma.assignmentSubmission.findUnique({ where: { id } });
      if (!submission) return res.status(404).json({ message: 'Submission not found.' });

      const isOwner = (req as any).user.id === submission.userId;
      const isAdminUser = (req as any).user.role === 'ADMIN';
      if (!isOwner && !isAdminUser) {
        return res.status(403).json({ message: 'You can only update your own submission.' });
      }

      const updated = await prisma.assignmentSubmission.update({
        where: { id },
        data: { shareSolution: !!shareSolution }
      });

      logger.info(`User ${(req as any).user.id} set assignment ${id} shareSolution=${updated.shareSolution}`);
      res.json({ success: true, shareSolution: updated.shareSolution });
    } catch (err: any) {
      logger.error('Update assignment privacy error:', err);
      next(err);
    }
  }
);

export default router;
