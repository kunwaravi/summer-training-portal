import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  getCourseChallenges,
  getChallenge,
  getChallengeCounts,
  completeChallenge
} from '../services/challengeService';
import { runChallengeTests } from '../services/challengeRunnerService';

const router = Router();

// GET /api/challenges/course/:courseId - ordered challenges grouped by module, with completion flags
router.get('/course/:courseId', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const data = await getCourseChallenges(req.params.courseId as string, req.user.id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// GET /api/challenges/counts - per-course { total, completed } for the curriculum page
router.get('/counts', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const counts = await getChallengeCounts(req.user.id);
    res.json(counts);
  } catch (error) {
    next(error);
  }
});

// GET /api/challenges/:id - single challenge (solutionCode excluded)
router.get('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = await getChallenge(id);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// POST /api/challenges/:id/run-test - run the challenge's assertion tests against submitted code (issue #72)
// Rate-limited (15 runs / min / IP) to prevent sandbox abuse.
router.post('/:id/run-test', authenticateToken, rateLimiter(15, 60_000), async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { code } = req.body;
    if (typeof code !== 'string' || code.length === 0) {
      return res.status(400).json({ message: 'code is required.' });
    }

    const challenge = await getChallenge(id); // excludes solutionCode
    const outcome = await runChallengeTests(
      { challengeType: challenge.challengeType, seedCode: challenge.seedCode, testCode: challenge.testCode },
      code
    );

    // Auto-record completion only when ALL assertions pass (server-side grading).
    if (outcome.passed) {
      await completeChallenge(req.user.id, id).catch(() => {});
    }

    res.json(outcome);
  } catch (error) {
    next(error);
  }
});

// POST /api/challenges/:id/complete - record completion (client-side grading already passed)
router.post('/:id/complete', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await completeChallenge(req.user.id, id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
