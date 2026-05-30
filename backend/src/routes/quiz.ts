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

// GET /api/quiz/questions/:courseId/:week - Fetch questions for a specific week's quiz (omitting correct answers)
router.get('/questions/:courseId/:week', async (req: any, res: any) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = parseInt(week);

    const moduleRecord = await prisma.module.findFirst({
      where: {
        courseId,
        week: weekNum
      },
      include: {
        quizQuestions: true
      }
    });

    if (!moduleRecord) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    // Map questions to omit correct answers for safe transfer
    const safeQuestions = moduleRecord.quizQuestions.map(({ correctAnswer, ...q }) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({
      courseId,
      week: weekNum,
      questions: safeQuestions
    });
  } catch (error) {
    console.error('Fetch quiz questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/quiz/submit - Grade quiz submissions and update course progress
router.post('/submit', async (req: any, res: any) => {
  try {
    const { userId, courseId, week, answers } = req.body;
    const weekNum = parseInt(week);
    const userIdNum = parseInt(userId);

    const moduleRecord = await prisma.module.findFirst({
      where: {
        courseId,
        week: weekNum
      },
      include: {
        quizQuestions: true
      }
    });

    if (!moduleRecord || moduleRecord.quizQuestions.length === 0) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    let correctCount = 0;
    const totalQuestions = moduleRecord.quizQuestions.length;
    const breakdown = moduleRecord.quizQuestions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        text: q.text,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 60;

    // Save to QuizResult DB
    const result = await prisma.quizResult.create({
      data: {
        userId: userIdNum,
        courseId,
        week: weekNum,
        score,
        passed
      }
    });

    // Update / upsert CourseProgress if passed
    if (passed) {
      const currentProgress = await prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId: userIdNum,
            courseId
          }
        }
      });

      const currentWeekCompleted = currentProgress?.weekCompleted || 0;
      
      if (weekNum > currentWeekCompleted) {
        await prisma.courseProgress.upsert({
          where: {
            userId_courseId: {
              userId: userIdNum,
              courseId
            }
          },
          update: {
            weekCompleted: weekNum,
            progress: weekNum * 25,
            completed: weekNum >= 4
          },
          create: {
            userId: userIdNum,
            courseId,
            weekCompleted: weekNum,
            progress: weekNum * 25,
            completed: weekNum >= 4
          }
        });
      }
    }

    // Fetch fresh user profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: userIdNum },
      include: {
        progresses: true,
        results: true
      }
    });

    res.json({
      result,
      score,
      passed,
      breakdown,
      updatedUser
    });
  } catch (error) {
    console.error('Quiz grading error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - POST /api/quiz/module/:moduleId/question (Add Quiz Question)
router.post('/module/:moduleId/question', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const { text, options, correctAnswer } = req.body;

    if (!text || !options || !correctAnswer) {
      return res.status(400).json({ message: 'Text, options, and correctAnswer are required.' });
    }

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        moduleId,
        text,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer
      }
    });
    res.status(201).json({
      ...newQuestion,
      options: typeof newQuestion.options === 'string' ? JSON.parse(newQuestion.options) : newQuestion.options
    });
  } catch (error) {
    console.error('Create quiz question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/quiz/question/:questionId (Update Quiz Question)
router.put('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { text, options, correctAnswer } = req.body;

    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        text,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer
      }
    });
    res.json({
      ...updatedQuestion,
      options: typeof updatedQuestion.options === 'string' ? JSON.parse(updatedQuestion.options) : updatedQuestion.options
    });
  } catch (error) {
    console.error('Update quiz question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/quiz/question/:questionId (Delete Quiz Question)
router.delete('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    await prisma.quizQuestion.delete({ where: { id: questionId } });
    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error) {
    console.error('Delete quiz question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
