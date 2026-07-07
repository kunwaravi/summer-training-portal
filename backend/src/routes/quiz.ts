import { Router } from 'express';
import * as quizService from '../services/quizService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { validate, quizSubmissionSchema, createQuestionSchema } from '../middleware/validation';

const router = Router();

// GET /api/quiz/questions/:courseId/:week - Fetch questions for a specific week's quiz (omitting correct answers)
router.get('/questions/:courseId/:week', async (req: any, res: any, next: any) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = parseInt(week);

    const quizData = await quizService.getQuizQuestions(courseId, weekNum);

    if (!quizData) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    res.json(quizData);
  } catch (error) {
    next(error);
  }
});

// GET /api/quiz/questions/topic/:topicId - Fetch questions for a specific topic's quiz (omitting correct answers)
router.get('/questions/topic/:topicId', async (req: any, res: any, next: any) => {
  try {
    const topicId = parseInt(req.params.topicId);
    const quizData = await quizService.getTopicQuizQuestions(topicId);

    if (!quizData) {
      return res.status(404).json({ message: 'Quiz for this topic not found' });
    }

    res.json(quizData);
  } catch (error) {
    next(error);
  }
});

// POST /api/quiz/submit - Grade quiz submissions and update course progress
router.post('/submit', validate(quizSubmissionSchema), async (req: any, res: any, next: any) => {
  try {
    const { userId, courseId, week, topicId, answers } = req.body;
    const weekNum = parseInt(week);
    const userIdNum = parseInt(userId);
    const topicIdNum = topicId ? parseInt(topicId) : undefined;

    const submissionResult = await quizService.submitQuiz(userIdNum, courseId, weekNum, answers, topicIdNum);

    if (!submissionResult) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    res.json(submissionResult);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - POST /api/quiz/module/:moduleId/question (Add Quiz Question)
router.post('/module/:moduleId/question', authenticateToken, isAdmin, validate(createQuestionSchema), async (req: any, res: any, next: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { text, options, correctAnswer } = req.body;

    const newQuestion = await quizService.createQuizQuestion(moduleId, { text, options, correctAnswer });
    res.status(201).json(newQuestion);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - PUT /api/quiz/question/:questionId (Update Quiz Question)
router.put('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { text, options, correctAnswer } = req.body;

    const updatedQuestion = await quizService.updateQuizQuestion(questionId, { text, options, correctAnswer });
    res.json(updatedQuestion);
  } catch (error) {
    next(error);
  }
});

// ADMIN CRUD - DELETE /api/quiz/question/:questionId (Delete Quiz Question)
router.delete('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    await quizService.deleteQuizQuestion(questionId);
    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
