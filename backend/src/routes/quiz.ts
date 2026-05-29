import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.post('/submit', async (req: any, res: any) => {
  try {
    const { userId, week, score } = req.body;
    const passed = score >= 60;

    const result = await prisma.quizResult.create({
      data: {
        userId,
        week,
        score,
        passed
      }
    });

    if (passed) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          weekCompleted: { increment: 1 },
          progress: week * 25 // 25% per week
        }
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
