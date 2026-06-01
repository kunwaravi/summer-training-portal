import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';

const router = Router();

// Middleware to verify admin privileges
const isAdmin = (req: any, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/courses - List all courses with lightweight module lists (LAZY LOAD)
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          select: {
            id: true,
            order: true,
            title: true,
            description: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // Re-format into key-value map to preserve compatibility with existing frontend expectations
    const curriculumMap: Record<string, any[]> = {};
    for (const c of courses) {
      curriculumMap[c.id] = c.modules;
    }

    res.json(curriculumMap);
  } catch (error: any) {
    logger.error('Fetch courses error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/courses/:courseId/module/:order - Dynamic fetch for ONE module's full topics (Lazy loading detail view)
router.get('/:courseId/module/:order', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { courseId, order } = req.params as any;
    const orderNum = parseInt(order);
    const userId = req.user.id;

    // Check if the user is an Admin OR has made a successful payment for this course
    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'SUCCESS'
      }
    });

    if (!successPayment && req.user.role !== 'ADMIN') {
      logger.error(`Syllabus detail access blocked: User ${userId} has not purchased course ${courseId}`);
      return res.status(402).json({ 
        message: 'Payment required: Please purchase this course track to unlock full syllabus topics.',
        paymentRequired: true 
      });
    }

    const moduleRecord = await prisma.module.findFirst({
      where: {
        courseId,
        order: orderNum
      },
      include: {
        topics: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!moduleRecord) {
      logger.error(`Fetch module details failure: Order ${order} for course ${courseId} not found.`);
      return res.status(404).json({ message: `Module at order ${order} for course ${courseId} not found.` });
    }

    res.json(moduleRecord);
  } catch (error: any) {
    logger.error('Fetch module detail error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/courses (Create new Course)
router.post('/', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, title, description } = req.body;
    if (!id || !title) {
      logger.error('Create course failed: Missing Course ID or Title.');
      return res.status(400).json({ message: 'Course ID and Title are required.' });
    }

    const course = await prisma.course.create({
      data: { id, title, description: description || '' }
    });
    
    logger.info(`Admin successfully created course: ${id}`);
    res.status(201).json(course);
  } catch (error: any) {
    logger.error('Create course error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/courses/:courseId (Update Course)
router.put('/:courseId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const { title, description } = req.body;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { title, description }
    });
    
    logger.info(`Admin successfully updated course: ${courseId}`);
    res.json(course);
  } catch (error: any) {
    logger.error('Update course error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/courses/:courseId (Delete Course)
router.delete('/:courseId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    await prisma.course.delete({ where: { id: courseId } });
    
    logger.info(`Admin successfully deleted course: ${courseId}`);
    res.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    logger.error('Delete course error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/courses/:courseId/module (Create Week Module)
router.post('/:courseId/module', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const { order, title, description } = req.body;

    const newModule = await prisma.module.create({
      data: {
        courseId,
        order: parseInt(order),
        title,
        description: description || ''
      }
    });
    
    logger.info(`Admin successfully created module: ${courseId} Order ${order}`);
    res.status(201).json(newModule);
  } catch (error: any) {
    logger.error('Create module error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/courses/module/:moduleId (Update Module Metadata)
router.put('/module/:moduleId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { moduleId } = req.params as any;
    const moduleIdNum = parseInt(moduleId);
    const { order, title, description } = req.body;

    const updatedModule = await prisma.module.update({
      where: { id: moduleIdNum },
      data: {
        order: order !== undefined ? parseInt(order) : undefined,
        title,
        description
      }
    });
    
    logger.info(`Admin successfully updated module ID: ${moduleId}`);
    res.json(updatedModule);
  } catch (error: any) {
    logger.error('Update module error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/courses/module/:moduleId (Delete Module)
router.delete('/module/:moduleId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { moduleId } = req.params as any;
    const moduleIdNum = parseInt(moduleId);
    await prisma.module.delete({ where: { id: moduleIdNum } });
    
    logger.info(`Admin successfully deleted module ID: ${moduleId}`);
    res.json({ message: 'Module deleted successfully' });
  } catch (error: any) {
    logger.error('Delete module error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/courses/module/:moduleId/topic (Create Topic inside Module)
router.post('/module/:moduleId/topic', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { moduleId } = req.params as any;
    const moduleIdNum = parseInt(moduleId);
    const { title, text, code, note, order } = req.body;

    const newTopic = await prisma.topic.create({
      data: {
        moduleId: moduleIdNum,
        title,
        text,
        code,
        note,
        order: order !== undefined ? parseInt(order) : 0
      }
    });
    
    logger.info(`Admin successfully created topic inside module ID ${moduleId}: ${title}`);
    res.status(201).json(newTopic);
  } catch (error: any) {
    logger.error('Create topic error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/courses/topic/:topicId (Update Topic)
router.put('/topic/:topicId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { topicId } = req.params as any;
    const topicIdNum = parseInt(topicId);
    const { title, text, code, note, order } = req.body;

    const updatedTopic = await prisma.topic.update({
      where: { id: topicIdNum },
      data: {
        title,
        text,
        code,
        note,
        order: order !== undefined ? parseInt(order) : undefined
      }
    });
    
    logger.info(`Admin successfully updated topic ID: ${topicId}`);
    res.json(updatedTopic);
  } catch (error: any) {
    logger.error('Update topic error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/courses/topic/:topicId (Delete Topic)
router.delete('/topic/:topicId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { topicId } = req.params as any;
    const topicIdNum = parseInt(topicId);
    await prisma.topic.delete({ where: { id: topicIdNum } });
    
    logger.info(`Admin successfully deleted topic ID: ${topicId}`);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error: any) {
    logger.error('Delete topic error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/courses/progress - Save student reading progress for a course
router.post('/progress', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { courseId, progress, completed } = req.body;

    if (!courseId || progress === undefined) {
      return res.status(400).json({ message: 'Course ID and progress percentage are required.' });
    }

    const upsertedProgress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      },
      update: {
        progress: parseInt(progress),
        completed: !!completed
      },
      create: {
        userId,
        courseId,
        progress: parseInt(progress),
        completed: !!completed
      }
    });

    logger.info(`Persisted course progress for user ${userId} on course ${courseId}: ${progress}% (Completed: ${completed})`);
    res.json({ success: true, progress: upsertedProgress });
  } catch (error: any) {
    logger.error('Save course progress error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
