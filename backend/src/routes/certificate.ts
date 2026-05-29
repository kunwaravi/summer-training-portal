import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/:userId', async (req: any, res: any) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { results: true }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.weekCompleted < 4) return res.status(403).json({ message: 'Training not completed yet' });

    // Calculate grade based on average score
    const avgScore = user.results.reduce((acc, curr) => acc + curr.score, 0) / user.results.length;
    let grade = "B";
    if (avgScore >= 90) grade = "A+";
    else if (avgScore >= 75) grade = "A";

    res.json({
      name: user.name,
      fatherName: user.fatherName,
      collegeName: user.collegeName,
      branchName: user.branchName,
      grade: grade,
      completionDate: new Date().toLocaleDateString(),
      signatures: {
        chiefAcademicOfficer: "Dr. R.K. Sharma",
        technicalDirector: "Er. Amit Kumar"
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
