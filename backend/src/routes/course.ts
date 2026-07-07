import { Router } from 'express';
import * as courseService from '../services/courseService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { validate, createCourseSchema, createModuleSchema, createTopicSchema } from '../middleware/validation';

const router = Router();

// GET /api/courses - List all courses with lightweight module lists (LAZY LOAD: does NOT return topic content text/code)
router.get('/', async (req: any, res: any, next: any) => {
  try {
    const curriculumMap = await courseService.getAllCourses();
    res.json(curriculumMap);
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:courseId/public - Public course details for certificate verification (no auth required)
router.get('/:courseId/public', async (req: any, res: any, next: any) => {
  try {
    const { courseId } = req.params;
    const courseDetails = await courseService.getPublicCourseDetails(courseId);

    if (!courseDetails) {
      return res.status(404).json({ message: `Course ${courseId} not found.` });
    }

    res.json(courseDetails);
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:courseId/module/:week - Dynamic fetch for ONE module's full topics (Lazy loading detail view)
router.get('/:courseId/module/:week', authenticateToken, async (req: any, res: any, next: any) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = parseInt(week);
    const userId = req.user.id;

    const moduleRecord = await courseService.getModuleByWeek(courseId, weekNum, userId);

    if (!moduleRecord) {
      return res.status(404).json({ message: `Week ${week} for course ${courseId} not found.` });
    }

    res.json(moduleRecord);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - POST /api/courses (Create new Course)
router.post('/', authenticateToken, isAdmin, validate(createCourseSchema), async (req: any, res: any, next: any) => {
  try {
    const { id, title, description, price } = req.body;
    const course = await courseService.createCourse({ id, title, description, price });
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - PUT /api/courses/:courseId (Update Course)
router.put('/:courseId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    const course = await courseService.updateCourse(courseId, { title, description, price });
    res.json(course);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - DELETE /api/courses/:courseId (Delete Course)
router.delete('/:courseId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const { courseId } = req.params;
    await courseService.deleteCourse(courseId);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - POST /api/courses/:courseId/module (Create Week Module)
router.post('/:courseId/module', authenticateToken, isAdmin, validate(createModuleSchema), async (req: any, res: any, next: any) => {
  try {
    const { courseId } = req.params;
    const { week, title, description } = req.body;

    const newModule = await courseService.createModule(courseId, {
      week: parseInt(week),
      title,
      description
    });
    res.status(201).json(newModule);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - PUT /api/courses/module/:moduleId (Update Module Metadata)
router.put('/module/:moduleId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { week, title, description } = req.body;

    const updatedModule = await courseService.updateModule(moduleId, {
      week: week !== undefined ? parseInt(week) : undefined,
      title,
      description
    });
    res.json(updatedModule);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - DELETE /api/courses/module/:moduleId (Delete Module)
router.delete('/module/:moduleId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    await courseService.deleteModule(moduleId);
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - POST /api/courses/module/:moduleId/topic (Create Topic inside Module)
router.post('/module/:moduleId/topic', authenticateToken, isAdmin, validate(createTopicSchema), async (req: any, res: any, next: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { title, text, code, note, order } = req.body;

    const newTopic = await courseService.createTopic(moduleId, {
      title,
      text,
      code,
      note,
      order: order !== undefined ? parseInt(order) : undefined
    });
    res.status(201).json(newTopic);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - PUT /api/courses/topic/:topicId (Update Topic)
router.put('/topic/:topicId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const { title, text, code, note, order } = req.body;

    const updatedTopic = await courseService.updateTopic(topicId, {
      title,
      text,
      code,
      note,
      order: order !== undefined ? parseInt(order) : undefined
    });
    res.json(updatedTopic);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - DELETE /api/courses/topic/:topicId (Delete Topic)
router.delete('/topic/:topicId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const topicId = parseInt(req.params.topicId);
    await courseService.deleteTopic(topicId);
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
