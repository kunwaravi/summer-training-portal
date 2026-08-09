import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { runCode } from '../services/sandboxService';

const router = Router();

// POST /api/sandbox/run — compile & execute user code in an isolated process (issue #71)
// Rate-limited (10 runs / min / IP) to prevent sandbox abuse.
router.post('/run', authenticateToken, rateLimiter(10, 60_000), async (req: any, res: any, next: any) => {
  try {
    const { language, code } = req.body;
    if (!language || typeof code !== 'string') {
      return res.status(400).json({ message: 'language and code are required.' });
    }
    const result = await runCode(language, code);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to run code.' });
  }
});

export default router;
