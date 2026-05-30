import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { validateBody } from '../middleware/validate';
import { businessRules } from '../lib/businessRules';

const router = Router();

// Middleware to verify admin privileges
const isAdmin = (req: any, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/quiz/questions/:courseId/:week - Fetch questions for a specific week's quiz (omitting correct answers)
router.get('/questions/:courseId/:week', async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId, week } = req.params as any;
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
      logger.error(`Quiz fetch failure: Module for course ${courseId} week ${week} not found.`);
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    // Map questions to omit correct answers for safe transfer
    const safeQuestions = (moduleRecord as any).quizQuestions.map(({ correctAnswer, ...q }: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({
      courseId,
      week: weekNum,
      questions: safeQuestions
    });
  } catch (error: any) {
    logger.error('Fetch quiz questions error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/quiz/submit - Grade quiz submissions and update course progress
router.post(
  '/submit',
  authenticateToken,
  validateBody(['courseId', 'week', 'answers']),
  async (req: any, res: Response): Promise<any> => {
    try {
      const { courseId, week, answers } = req.body;
      const weekNum = parseInt(week);
      const userIdNum = req.user.id;

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
        logger.error(`Quiz submission failed: Module for course ${courseId} week ${week} not found.`);
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
      const passed = score >= businessRules.passingScoreThreshold;

      // Save to QuizResult DB and Update / upsert CourseProgress inside a safe Prisma Transaction (Issue #8)
      const result = await prisma.$transaction(async (tx) => {
        const quizResult = await tx.quizResult.create({
          data: {
            userId: userIdNum,
            courseId,
            week: weekNum,
            score,
            passed
          }
        });

        if (passed) {
          const currentProgress = await tx.courseProgress.findUnique({
            where: {
              userId_courseId: {
                userId: userIdNum,
                courseId
              }
            }
          });

          const currentWeekCompleted = currentProgress?.weekCompleted || 0;
          
          if (weekNum > currentWeekCompleted) {
            await tx.courseProgress.upsert({
              where: {
                userId_courseId: {
                  userId: userIdNum,
                  courseId
                }
              },
              update: {
                weekCompleted: weekNum,
                progress: weekNum * businessRules.weeklyProgressIncrement,
                completed: weekNum >= businessRules.maxWeeks
              },
              create: {
                userId: userIdNum,
                courseId,
                weekCompleted: weekNum,
                progress: weekNum * businessRules.weeklyProgressIncrement,
                completed: weekNum >= businessRules.maxWeeks
              }
            });
          }
        }
        return quizResult;
      });

      // Fetch fresh user profile
      const updatedUser = await prisma.user.findUnique({
        where: { id: userIdNum },
        include: {
          progresses: true,
          results: true
        }
      });

      logger.info(`Quiz submitted by user ${userIdNum} for ${courseId} Week ${weekNum}. Score: ${score}% (Passed: ${passed})`);

      res.json({
        result,
        score,
        passed,
        breakdown,
        updatedUser
      });
    } catch (error: any) {
      logger.error('Quiz grading error caught in handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ADMIN CRUD - POST /api/quiz/module/:moduleId/question (Add Quiz Question)
router.post('/module/:moduleId/question', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { moduleId } = req.params as any;
    const moduleIdNum = parseInt(moduleId);
    const { text, options, correctAnswer } = req.body;

    if (!text || !options || !correctAnswer) {
      logger.error(`Create quiz question failed: Missing required fields for module ${moduleId}.`);
      return res.status(400).json({ message: 'Text, options, and correctAnswer are required.' });
    }

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        moduleId: moduleIdNum,
        text,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer
      }
    });
    
    logger.info(`Admin successfully created quiz question for module ${moduleId}.`);
    
    res.status(201).json({
      ...newQuestion,
      options: typeof newQuestion.options === 'string' ? JSON.parse(newQuestion.options) : newQuestion.options
    });
  } catch (error: any) {
    logger.error('Create quiz question error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - PUT /api/quiz/question/:questionId (Update Quiz Question)
router.put('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { questionId } = req.params as any;
    const questionIdNum = parseInt(questionId);
    const { text, options, correctAnswer } = req.body;

    const updatedQuestion = await prisma.quizQuestion.update({
      where: { id: questionIdNum },
      data: {
        text,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer
      }
    });

    logger.info(`Admin successfully updated quiz question ID ${questionId}.`);

    res.json({
      ...updatedQuestion,
      options: typeof updatedQuestion.options === 'string' ? JSON.parse(updatedQuestion.options) : updatedQuestion.options
    });
  } catch (error: any) {
    logger.error('Update quiz question error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN CRUD - DELETE /api/quiz/question/:questionId (Delete Quiz Question)
router.delete('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { questionId } = req.params as any;
    const questionIdNum = parseInt(questionId);
    await prisma.quizQuestion.delete({ where: { id: questionIdNum } });
    
    logger.info(`Admin successfully deleted quiz question ID ${questionId}.`);
    
    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error: any) {
    logger.error('Delete quiz question error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
