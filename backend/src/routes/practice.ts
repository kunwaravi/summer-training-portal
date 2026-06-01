import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { validateBody } from '../middleware/validate';

const router = Router();

// GET /api/practice/questions - Fetch practice questions by category
router.get('/questions', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { category } = req.query;

    if (!category || (category !== 'Programming' && category !== 'Electronics')) {
      return res.status(400).json({ message: 'Valid category (Programming or Electronics) is required.' });
    }

    const questions = await prisma.practiceQuestion.findMany({
      where: { category },
      orderBy: { id: 'asc' },
    });

    // Map questions to omit correct answers and explanations for anti-cheat
    const safeQuestions = questions.map(({ correctAnswer, explanation, ...q }) => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
    }));

    res.json({
      category,
      questions: safeQuestions,
    });
  } catch (error: any) {
    logger.error('Fetch practice questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/practice/submit - Submit practice attempt & award points
router.post(
  '/submit',
  authenticateToken,
  validateBody(['category', 'answers']),
  async (req: any, res: Response): Promise<any> => {
    try {
      const { category, answers } = req.body;
      const userId = req.user.id;

      if (category !== 'Programming' && category !== 'Electronics') {
        return res.status(400).json({ message: 'Invalid category.' });
      }

      // Fetch all correct answers for this category from database
      const dbQuestions = await prisma.practiceQuestion.findMany({
        where: { category },
      });

      if (dbQuestions.length === 0) {
        return res.status(404).json({ message: 'No practice questions found for this category.' });
      }

      let correctCount = 0;
      const totalQuestions = dbQuestions.length;

      const breakdown = dbQuestions.map((q) => {
        const userAnswer = answers[q.id] || '';
        const isCorrect = userAnswer.trim() === q.correctAnswer.trim();
        if (isCorrect) correctCount++;

        return {
          questionId: q.id,
          text: q.text,
          topic: q.topic,
          difficulty: q.difficulty,
          userAnswer,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          isCorrect,
        };
      });

      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      // Find the user's previous best attempt score for this category
      const bestPreviousAttempt = await prisma.practiceAttempt.findFirst({
        where: { userId, category },
        orderBy: { score: 'desc' },
      });

      const previousBestScore = bestPreviousAttempt ? bestPreviousAttempt.score : 0;
      
      // Points are only awarded if the current score is higher than the previous best score
      const newScoreDifference = Math.max(0, correctCount - previousBestScore);
      const pointsEarned = newScoreDifference * 10; // 10 points per new correct answer

      // Save practice attempt and update user points in transaction
      const result = await prisma.$transaction(async (tx) => {
        const attempt = await tx.practiceAttempt.create({
          data: {
            userId,
            score: correctCount,
            totalQuestions,
            category,
          },
        });

        // Award points to the user
        if (pointsEarned > 0) {
          await tx.user.update({
            where: { id: userId },
            data: {
              points: {
                increment: pointsEarned,
              },
            },
          });
        }

        return attempt;
      });

      logger.info(`User ${userId} completed practice test in ${category}. Score: ${correctCount}/${totalQuestions}, Earned: ${pointsEarned} pts.`);

      res.json({
        attemptId: result.id,
        score: correctCount,
        totalQuestions,
        accuracy,
        pointsEarned,
        breakdown,
      });
    } catch (error: any) {
      logger.error('Submit practice attempt error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// GET /api/practice/leaderboard - Get global student ranking
router.get('/leaderboard', authenticateToken, async (req: any, res: Response): Promise<any> => {
  try {
    const { search } = req.query;

    const whereClause: any = {};
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leaderboard = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
        avatarUrl: true,
        collegeName: true,
        role: true,
      },
      orderBy: {
        points: 'desc',
      },
    });

    res.json({
      leaderboard,
    });
  } catch (error: any) {
    logger.error('Fetch leaderboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
