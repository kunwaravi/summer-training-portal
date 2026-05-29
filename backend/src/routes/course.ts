import { Router } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from './auth';

const router = Router();

// Middleware to verify admin privileges
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/courses - List all courses with lightweight module lists (LAZY LOAD: does NOT return topic content text/code)
router.get('/', async (req: any, res: any) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          select: {
            id: true,
            week: true,
            title: true,
            description: true
          },
          orderBy: {
            week: 'asc'
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
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/courses/:courseId/module/:week - Dynamic fetch for ONE module's full topics (Lazy loading detail view)
router.get('/:courseId/module/:week', async (req: any, res: any) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = parseInt(week);

    const moduleRecord = await prisma.module.findFirst({
      where: {
        courseId,
        week: weekNum
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
      return res.status(404).json({ message: `Week ${week} for course ${courseId} not found.` });
    }

    res.json(moduleRecord);
  } catch (error) {
    console.error('Fetch module detail error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/courses (Create new Course)
router.post('/', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { id, title, description } = req.body;
    if (!id || !title) {
      return res.status(400).json({ message: 'Course ID and Title are required.' });
    }

    const course = await prisma.course.create({
      data: { id, title, description: description || '' }
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/courses/:courseId (Update Course)
router.put('/:courseId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { courseId } = req.params;
    const { title, description } = req.body;

    const course = await prisma.course.update({
      where: { id: courseId },
      data: { title, description }
    });
    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/courses/:courseId (Delete Course)
router.delete('/:courseId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { courseId } = req.params;
    await prisma.course.delete({ where: { id: courseId } });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/courses/:courseId/module (Create Week Module)
router.post('/:courseId/module', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const { courseId } = req.params;
    const { week, title, description } = req.body;

    const newModule = await prisma.module.create({
      data: {
        courseId,
        week: parseInt(week),
        title,
        description: description || ''
      }
    });
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/courses/module/:moduleId (Update Module Metadata)
router.put('/module/:moduleId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { week, title, description } = req.body;

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        week: week !== undefined ? parseInt(week) : undefined,
        title,
        description
      }
    });
    res.json(updatedModule);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/courses/module/:moduleId (Delete Module)
router.delete('/module/:moduleId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    await prisma.module.delete({ where: { id: moduleId } });
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/courses/module/:moduleId/topic (Create Topic inside Module)
router.post('/module/:moduleId/topic', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { title, text, code, note, order } = req.body;

    const newTopic = await prisma.topic.create({
      data: {
        moduleId,
        title,
        text,
        code,
        note,
        order: order !== undefined ? parseInt(order) : 0
      }
    });
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/courses/topic/:topicId (Update Topic)
router.put('/topic/:topicId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const { title, text, code, note, order } = req.body;

    const updatedTopic = await prisma.topic.update({
      where: { id: topicId },
      data: {
        title,
        text,
        code,
        note,
        order: order !== undefined ? parseInt(order) : undefined
      }
    });
    res.json(updatedTopic);
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/courses/topic/:topicId (Delete Topic)
router.delete('/topic/:topicId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const topicId = parseInt(req.params.topicId);
    await prisma.topic.delete({ where: { id: topicId } });
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
