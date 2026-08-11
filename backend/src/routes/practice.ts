import { Router, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { validateBody } from '../middleware/validate';
import { getLeaderboard } from '../services/leaderboardService';
import { getDailyChallenge, submitDailyChallenge } from '../services/practiceService';

const router = Router();

// GET /api/practice/questions - Fetch practice questions by category
router.get('/questions', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
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
    next(error);
  }
});

// POST /api/practice/submit - Submit practice attempt & award points
router.post(
  '/submit',
  authenticateToken,
  validateBody(['category', 'answers']),
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
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

        // Fetch current badges and points
        const userRecord = await tx.user.findUnique({
          where: { id: userId },
          select: { badges: true, points: true }
        });

        const currentBadges = userRecord?.badges || [];
        const newBadges = [...currentBadges];

        if (correctCount > 0 && !newBadges.includes('bug_hunter')) {
          newBadges.push('bug_hunter');
        }

        // Award points and badges to the user
        await tx.user.update({
          where: { id: userId },
          data: {
            points: (userRecord?.points || 0) + pointsEarned,
            badges: newBadges
          },
        });

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
      next(error);
    }
  }
);

// GET /api/practice/daily - today's daily coding challenge + current streak (issue #74)
router.get('/daily', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = await getDailyChallenge(req.user.id);
    if (!data) return res.status(404).json({ message: 'No practice questions available yet.' });
    res.json(data);
  } catch (error: any) {
    logger.error('Fetch daily challenge error:', error);
    next(error);
  }
});

// POST /api/practice/daily/submit - grade today's challenge, update streak + XP (issue #74)
router.post(
  '/daily/submit',
  authenticateToken,
  validateBody(['answer']),
  async (req: any, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { answer } = req.body;
      const result = await submitDailyChallenge(req.user.id, answer);
      if (!result) return res.status(404).json({ message: 'No practice questions available yet.' });
      res.json(result);
    } catch (error: any) {
      logger.error('Submit daily challenge error:', error);
      next(error);
    }
  }
);

// GET /api/practice/leaderboard/public - Get privacy-safe top student rankings for landing page
router.get('/leaderboard/public', async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const leaderboard = await prisma.user.findMany({
      where: {
        points: { gt: 0 }
      },
      select: {
        name: true,
        points: true,
        badges: true,
        avatarUrl: true,
        collegeName: true,
      },
      orderBy: {
        points: 'desc',
      },
      take: 5,
    });
    res.json({ leaderboard });
  } catch (error: any) {
    logger.error('Fetch public leaderboard error:', error);
    next(error);
  }
});

// GET /api/practice/leaderboard - Get global student ranking
router.get('/leaderboard', authenticateToken, async (req: any, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { search, page = '1', limit = '10' } = req.query;

    // Clamp limit to 100 — unbounded `take` from a user-supplied limit is a DoS
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(Math.max(1, parseInt(limit as string)), 100);

    const { leaderboard, total } = await getLeaderboard(search as string, pageNum, limitNum);

    res.json({
      leaderboard,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    logger.error('Fetch leaderboard error:', error);
    next(error);
  }
});

export default router;
