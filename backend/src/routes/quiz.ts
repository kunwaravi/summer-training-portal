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

// ==========================================
// MODULE QUIZZES ENDPOINTS
// ==========================================

// GET /api/quiz/module/:moduleId - Fetch 10 questions for a specific module's quiz (LAZY LOAD, SAFE options)
router.get('/module/:moduleId', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    const userId = req.user.id;

    const moduleRecord = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!moduleRecord) {
      return res.status(404).json({ message: 'Module not found.' });
    }

    // Check course-specific payment
    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId: moduleRecord.courseId,
        status: 'SUCCESS'
      }
    });

    if (!successPayment && req.user.role !== 'ADMIN') {
      return res.status(402).json({ message: 'Payment required to view syllabus quizzes.' });
    }

    // Check sequential unlock: prior module quiz must be passed
    if (moduleRecord.order > 1 && req.user.role !== 'ADMIN') {
      const prevModule = await prisma.module.findFirst({
        where: {
          courseId: moduleRecord.courseId,
          order: moduleRecord.order - 1
        }
      });
      if (prevModule) {
        const prevProgress = await prisma.moduleProgress.findUnique({
          where: {
            userId_moduleId: {
              userId,
              moduleId: prevModule.id
            }
          }
        });
        if (!prevProgress || !prevProgress.quizPassed) {
          return res.status(403).json({ message: `Locked: You must pass the quiz for Module ${moduleRecord.order - 1} first.` });
        }
      }
    }

    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId }
    });

    // Strip out correctAnswer for security
    const safeQuestions = questions.map(({ correctAnswer, ...q }: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({
      moduleId,
      questions: safeQuestions
    });
  } catch (err: any) {
    logger.error('Fetch module quiz questions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/quiz/module/:moduleId/submit - Submit and grade module quiz
router.post(
  '/module/:moduleId/submit',
  authenticateToken,
  validateBody(['answers']),
  async (req: any, res: Response): Promise<any> => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const { answers } = req.body;
      const userId = req.user.id;

      const moduleRecord = await prisma.module.findUnique({
        where: { id: moduleId }
      });

      if (!moduleRecord) {
        return res.status(404).json({ message: 'Module not found.' });
      }

      const questions = await prisma.quizQuestion.findMany({
        where: { moduleId }
      });

      if (questions.length === 0) {
        return res.status(400).json({ message: 'No quiz questions defined for this module.' });
      }

      let correctCount = 0;
      const breakdown = questions.map(q => {
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

      const accuracy = Math.round((correctCount / questions.length) * 100);
      const passed = accuracy >= 60; // 60% Passing Score

      // Upsert ModuleProgress
      await prisma.moduleProgress.upsert({
        where: {
          userId_moduleId: {
            userId,
            moduleId
          }
        },
        update: {
          completed: true,
          quizPassed: passed,
          quizScore: correctCount
        },
        create: {
          userId,
          courseId: moduleRecord.courseId,
          moduleId,
          completed: true,
          quizPassed: passed,
          quizScore: correctCount
        }
      });

      // Award XP points on pass (10 XP)
      if (passed) {
        await prisma.user.update({
          where: { id: userId },
          data: { points: { increment: 10 } }
        });
      }

      // Track Learning Streak Gamification
      const user = await prisma.user.findUnique({ where: { id: userId } });
      let streak = user?.streak || 0;
      const now = new Date();

      if (user) {
        const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
        if (!lastActive) {
          streak = 1;
        } else {
          const diffTime = now.getTime() - lastActive.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak += 1;
          } else if (diffDays > 1) {
            streak = 1;
          }
        }
        await prisma.user.update({
          where: { id: userId },
          data: {
            streak,
            lastActiveAt: now
          }
        });
      }

      res.json({
        passed,
        score: correctCount,
        total: questions.length,
        accuracy,
        breakdown,
        streak
      });
    } catch (err: any) {
      logger.error('Submit module quiz grading error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ==========================================
// FINAL EXAM ENDPOINTS
// ==========================================

// GET /api/quiz/questions/:courseId - Fetch 50 questions for a specific course's final exam (Restricted by modules completed)
router.get('/questions/:courseId', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { courseId } = req.params as any;
    const userId = req.user.id;

    // Enforce course payment
    const successPayment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'SUCCESS'
      }
    });

    if (!successPayment && req.user.role !== 'ADMIN') {
      return res.status(402).json({ 
        message: 'Payment required: Please purchase this course track to unlock the final examination.',
        paymentRequired: true 
      });
    }

    // Enforce completion of all 20 modules
    if (req.user.role !== 'ADMIN') {
      const completedCount = await prisma.moduleProgress.count({
        where: {
          userId,
          courseId,
          quizPassed: true
        }
      });
      if (completedCount < 20) {
        return res.status(403).json({ 
          message: `Locked: You must complete all 20 modules and pass their quizzes before taking the Final Exam. Currently completed: ${completedCount}/20.`,
          completedCount 
        });
      }
    }

    const examQuestions = await prisma.finalExamQuestion.findMany({
      where: { courseId }
    });

    if (!examQuestions || examQuestions.length === 0) {
      return res.status(404).json({ message: 'Final exam questions not found' });
    }

    // Randomize question order and select 50
    const randomizedQuestions = examQuestions.sort(() => 0.5 - Math.random());

    // Map questions to omit correct answers
    const safeQuestions = randomizedQuestions.map(({ correctAnswer, ...q }: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({
      courseId,
      questions: safeQuestions
    });
  } catch (error: any) {
    logger.error('Fetch final exam questions error:', error);
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

      const examQuestions = await prisma.finalExamQuestion.findMany({
        where: { courseId }
      });

      if (!examQuestions || examQuestions.length === 0) {
        return res.status(404).json({ message: 'Final exam questions not found' });
      }

      let correctCount = 0;
      const totalQuestions = examQuestions.length;

      const breakdown = examQuestions.map(q => {
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

      const result = await prisma.$transaction(async (tx) => {
        const quizResult = await tx.quizResult.create({
          data: {
            userId: userIdNum,
            courseId,
            score: correctCount,
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

          // Award 100 XP points for passing final exam
          await tx.user.update({
            where: { id: userIdNum },
            data: { points: { increment: 100 } }
          });
        }
        return quizResult;
      });

      const updatedUser = await prisma.user.findUnique({
        where: { id: userIdNum },
        include: {
          progresses: true,
          results: true
        }
      });

      res.json({
        result,
        accuracy,
        grade,
        passed,
        breakdown,
        updatedUser
      });
    } catch (error: any) {
      logger.error('Final exam grading error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// ==========================================
// ADMINISTRATIVE CRUD ENDPOINTS
// ==========================================

// ADMIN - GET /api/quiz/admin/exam-questions/:courseId - Get all final exam questions for edit
router.get('/admin/exam-questions/:courseId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = req.params.courseId as string;
    const questions = await prisma.finalExamQuestion.findMany({
      where: { courseId },
      orderBy: { id: 'asc' }
    });
    res.json(questions.map((q: any) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    })));
  } catch (error: any) {
    logger.error('Admin get exam questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - POST /api/quiz/exam/:courseId/question - Add Final Exam Question
router.post('/exam/:courseId/question', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = req.params.courseId as string;
    const { text, options, correctAnswer } = req.body;

    const newQuestion = await prisma.finalExamQuestion.create({
      data: {
        courseId,
        text,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer
      }
    });

    res.status(201).json({
      ...newQuestion,
      options: typeof newQuestion.options === 'string' ? JSON.parse(newQuestion.options) : newQuestion.options
    });
  } catch (error: any) {
    logger.error('Admin create exam question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - PUT /api/quiz/exam/question/:questionId - Edit Final Exam Question
router.put('/exam/question/:questionId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const questionId = parseInt(req.params.questionId as string);
    const { text, options, correctAnswer } = req.body;

    const updatedQuestion = await prisma.finalExamQuestion.update({
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
  } catch (error: any) {
    logger.error('Admin update exam question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - DELETE /api/quiz/exam/question/:questionId - Delete Final Exam Question
router.delete('/exam/question/:questionId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const questionId = parseInt(req.params.questionId as string);
    await prisma.finalExamQuestion.delete({
      where: { id: questionId }
    });
    res.json({ message: 'Final Exam question deleted successfully.' });
  } catch (error: any) {
    logger.error('Admin delete exam question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - POST /api/quiz/module/:moduleId/question (Legacy Module Quiz Question Add)
router.post('/module/:moduleId/question', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { moduleId } = req.params as any;
    const moduleIdNum = parseInt(moduleId);
    const { text, options, correctAnswer } = req.body;

    const newQuestion = await prisma.quizQuestion.create({
      data: {
        moduleId: moduleIdNum,
        text,
        options: Array.isArray(options) ? JSON.stringify(options) : options,
        correctAnswer
      }
    });
    
    res.status(201).json({
      ...newQuestion,
      options: typeof newQuestion.options === 'string' ? JSON.parse(newQuestion.options) : newQuestion.options
    });
  } catch (error: any) {
    logger.error('Create quiz question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - PUT /api/quiz/question/:questionId (Legacy Module Quiz Question Update)
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

    res.json({
      ...updatedQuestion,
      options: typeof updatedQuestion.options === 'string' ? JSON.parse(updatedQuestion.options) : updatedQuestion.options
    });
  } catch (error: any) {
    logger.error('Update quiz question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - DELETE /api/quiz/question/:questionId (Legacy Module Quiz Question Delete)
router.delete('/question/:questionId', authenticateToken, isAdmin, async (req: any, res: Response): Promise<any> => {
  try {
    const { questionId } = req.params as any;
    const questionIdNum = parseInt(questionId);
    await prisma.quizQuestion.delete({ where: { id: questionIdNum } });
    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error: any) {
    logger.error('Delete quiz question error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADMIN - GET /api/quiz/questions/:courseId/:week (Legacy get module quiz questions for admin)
router.get('/questions/:courseId/:week', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = req.params.courseId as string;
    const week = req.params.week as string;
    const weekNum = parseInt(week);
    const moduleRecord = await prisma.module.findFirst({
      where: { courseId, order: weekNum }
    });
    if (!moduleRecord) {
      return res.status(404).json({ message: 'Module not found' });
    }
    const questions = await prisma.quizQuestion.findMany({
      where: { moduleId: moduleRecord.id }
    });
    res.json({
      questions: questions.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }))
    });
  } catch (err: any) {
    logger.error('Admin fetch module questions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
