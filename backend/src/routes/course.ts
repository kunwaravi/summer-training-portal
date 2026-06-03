import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { getCurriculumMap, getModuleWithTopics } from '../services/courseService';

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
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const curriculumMap = await getCurriculumMap();
    res.json(curriculumMap);
  } catch (error: any) {
    logger.error('Fetch courses error caught in handler:', error);
    next(error);
  }
});

// GET /api/courses/:courseId/module/:order - Dynamic fetch for ONE module's full topics (Lazy loading detail view)
router.get('/:courseId/module/:order', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { courseId, order } = req.params as any;
    const orderNum = parseInt(order);
    const userId = req.user.id;
    const userRole = req.user.role;

    const moduleRecord = await getModuleWithTopics(courseId, orderNum, userId, userRole);
    res.json(moduleRecord);
  } catch (error: any) {
    logger.error('Fetch module detail error caught in handler:', error);
    if (error.paymentRequired) {
      return res.status(error.statusCode).json({ message: error.message, paymentRequired: true });
    }
    next(error);
  }
});

// GET /api/courses/:courseId/progress - Detailed user progress overview
router.get('/:courseId/progress', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params as any;

    // 1. Fetch module progress details
    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' }
    });

    const moduleProgresses = await prisma.moduleProgress.findMany({
      where: { userId, courseId }
    });

    const detailedModules = modules.map(m => {
      const prog = moduleProgresses.find(p => p.moduleId === m.id);
      return {
        id: m.id,
        order: m.order,
        title: m.title,
        description: m.description,
        completed: prog ? prog.completed : false,
        quizPassed: prog ? prog.quizPassed : false,
        quizScore: prog ? prog.quizScore : null
      };
    });

    const modulesPassedCount = detailedModules.filter(m => m.quizPassed).length;

    // 2. Fetch weekly assignment submissions
    const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
      where: { userId, courseId },
      orderBy: { weekNumber: 'asc' }
    });

    const assignmentsApprovedCount = assignmentSubmissions.filter(a => a.status === 'APPROVED').length;

    // 3. Fetch project submission
    const projectSubmission = await prisma.projectSubmission.findUnique({
      where: { userId_courseId: { userId, courseId } }
    });

    // 4. Fetch final exam results (best passed/any)
    const examResults = await prisma.quizResult.findMany({
      where: { userId, courseId }
    });

    const finalExamPassed = examResults.some(r => r.passed);
    const bestExamResult = examResults.length > 0
      ? examResults.reduce((prev, curr) => (prev.accuracy > curr.accuracy) ? prev : curr)
      : null;

    // 5. Payment status
    const payment = await prisma.payment.findFirst({
      where: { userId, courseId, status: 'SUCCESS' }
    });

    res.json({
      courseId,
      paid: !!payment || req.user.role === 'ADMIN',
      modulesPassed: modulesPassedCount,
      totalModules: modules.length,
      assignmentsApproved: assignmentsApprovedCount,
      projectStatus: projectSubmission ? projectSubmission.status : 'NOT_SUBMITTED',
      projectFeedback: projectSubmission ? projectSubmission.feedback : null,
      projectDetails: projectSubmission ? {
        title: projectSubmission.title,
        description: projectSubmission.description,
        sourceCodeUrl: projectSubmission.sourceCodeUrl,
        reportUrl: projectSubmission.reportUrl,
        githubUrl: projectSubmission.githubUrl,
        submittedAt: projectSubmission.submittedAt
      } : null,
      finalExamPassed,
      finalExamScore: bestExamResult ? bestExamResult.accuracy : null,
      detailedModules,
      assignmentSubmissions: assignmentSubmissions.map(a => ({
        id: a.id,
        weekNumber: a.weekNumber,
        status: a.status,
        feedback: a.feedback,
        fileName: a.fileName,
        fileUrl: a.fileUrl,
        submittedAt: a.submittedAt
      }))
    });
  } catch (error: any) {
    logger.error('Fetch detailed course progress error:', error);
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
