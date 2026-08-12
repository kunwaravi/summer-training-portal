import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { CertificateService } from '../services/certificateService';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// GET /api/certificate/verify/:credentialId - Public verification registry endpoint
// SECURITY: rate-limited so predictable legacy credential IDs can't be
// enumerated to harvest student PII.
router.get('/verify/:credentialId', rateLimiter(20, 60_000), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credentialId = req.params.credentialId as string;
    const verificationData = await CertificateService.verifyCertificate(credentialId);
    res.json(verificationData);
  } catch (error) {
    next(error);
  }
});

// GET /api/certificate/:courseId - Generate certificate data for the current authenticated user
router.get('/:courseId', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId as string;
    const isAdmin = req.user.role === 'ADMIN';

    const certificateData = await CertificateService.generateCertificate(userId, courseId, isAdmin);
    res.json(certificateData);
  } catch (error: any) {
    if (error.paymentRequired) {
      return res.status(error.statusCode || 402).json({
        message: error.message,
        paymentRequired: true
      });
    }
    next(error);
  }
});

// GET /api/certificate/:userId/:courseId - Generate certificate data for a specific user (restricted to ADMIN or self)
router.get('/:userId/:courseId', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
  try {
    const targetUserId = parseInt(req.params.userId as string);
    const courseId = req.params.courseId as string;
    const currentUserId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    // Access control: only ADMIN or the user themselves can view this certificate
    if (!isAdmin && currentUserId !== targetUserId) {
      return res.status(403).json({ message: 'Access denied: You can only view your own certificates.' });
    }

    const certificateData = await CertificateService.generateCertificate(targetUserId, courseId, isAdmin);
    res.json(certificateData);
  } catch (error: any) {
    if (error.paymentRequired) {
      return res.status(error.statusCode || 402).json({
        message: error.message,
        paymentRequired: true
      });
    }
    next(error);
  }
});

export default router;
