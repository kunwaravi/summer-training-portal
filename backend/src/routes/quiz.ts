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

// Helper for grading logic
const calculateGrade = (accuracy: number): { grade: string, passed: boolean } => {
  if (accuracy >= 90) return { grade: 'Outstanding', passed: true };
  if (accuracy >= 80) return { grade: 'Excellent', passed: true };
  if (accuracy >= 70) return { grade: 'Very Good', passed: true };
  if (accuracy >= 60) return { grade: 'Good', passed: true };
  return { grade: 'Fail', passed: false };
};

// GET /api/quiz/questions/:courseId - Fetch ALL questions for a specific course's final exam
router.get('/questions/:courseId', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const userId = req.user.id;

    // Enforce payment or admin verification before returning final exam questions
    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'SUCCESS'
      }
    });

    if (!successPayment && req.user.role !== 'ADMIN') {
      logger.error(`Final exam access blocked: User ${userId} has not purchased course ${courseId}`);
      return res.status(402).json({ 
        message: 'Payment required: Please purchase this course track to unlock the final examination.',
        paymentRequired: true 
      });
    }

    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        quizQuestions: true
      },
      orderBy: { order: 'asc' }
    });

    if (!modules || modules.length === 0) {
      logger.error(`Quiz fetch failure: No modules found for course ${courseId}.`);
      return res.status(404).json({ message: 'Quizzes for this course not found' });
    }

    // Flatten all questions across all modules
    let allQuestions: any[] = [];
    modules.forEach(m => {
      allQuestions = allQuestions.concat(m.quizQuestions);
    });

    // Map questions to omit correct answers for safe transfer
    const safeQuestions = allQuestions.map(({ correctAnswer, ...q }: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({
      courseId,
      questions: safeQuestions
    });
  } catch (error: any) {
    logger.error('Fetch quiz questions error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/quiz/submit - Grade final exam submissions
router.post(
  '/submit',
  authenticateToken,
  validateBody(['courseId', 'answers']),
  async (req: any, res: Response): Promise<any> => {
    try {
      const { courseId, answers } = req.body;
      const userIdNum = req.user.id;

      const modules = await prisma.module.findMany({
        where: { courseId },
        include: { quizQuestions: true }
      });

      if (!modules || modules.length === 0) {
        logger.error(`Quiz submission failed: No questions found for course ${courseId}.`);
        return res.status(404).json({ message: 'Quiz for this course not found' });
      }

      let allQuestions: any[] = [];
      modules.forEach(m => {
        allQuestions = allQuestions.concat(m.quizQuestions);
      });

      let correctCount = 0;
      const totalQuestions = allQuestions.length;
      
      if (totalQuestions === 0) {
          return res.status(400).json({ message: 'No questions available to grade.' });
      }

      const breakdown = allQuestions.map(q => {
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

      const accuracy = Math.round((correctCount / totalQuestions) * 100);
      const { grade, passed } = calculateGrade(accuracy);

      // Save to QuizResult DB and Update CourseProgress inside a safe Prisma Transaction
      const result = await prisma.$transaction(async (tx) => {
        const quizResult = await tx.quizResult.create({
          data: {
            userId: userIdNum,
            courseId,
            score: correctCount, // Store raw score as well
            accuracy,
            grade,
            passed
          }
        });

        if (passed) {
          await tx.courseProgress.upsert({
            where: {
              userId_courseId: {
                userId: userIdNum,
                courseId
              }
            },
            update: {
              progress: 100,
              completed: true
            },
            create: {
              userId: userIdNum,
              courseId,
              progress: 100,
              completed: true
            }
          });
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

      logger.info(`Final Exam submitted by user ${userIdNum} for ${courseId}. Accuracy: ${accuracy}%, Grade: ${grade} (Passed: ${passed})`);

      res.json({
        result,
        accuracy,
        grade,
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
