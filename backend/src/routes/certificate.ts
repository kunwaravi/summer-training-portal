import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { CertificateService } from '../services/certificateService';

const router = Router();

// GET /api/certificate/:userId/:courseId - Generate certificate data for a specific user and course track
router.get('/:userId/:courseId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const { courseId } = req.params;

    const certificateData = await CertificateService.generateCertificate(userId, courseId);
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

// GET /api/certificate/verify/:credentialId - Public verification registry endpoint
router.get('/verify/:credentialId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credentialId } = req.params;
    const verificationData = await CertificateService.verifyCertificate(credentialId);
    res.json(verificationData);
  } catch (error) {
    next(error);
  }
});

export default router;
