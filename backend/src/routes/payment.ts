import { Router } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { authenticateToken } from './auth';

const router = Router();
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'nexus_webhook_signature_secret_key_2026';

// Middleware to verify admin privileges
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/payments/admin/all - Fetch all transactions for admin audit dashboard (Issue #2, #8)
router.get('/admin/all', authenticateToken, isAdmin, async (req: any, res: any) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(payments);
  } catch (error) {
    console.error('Fetch all payments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/payments/status/:courseId - Get current payment status for active user (Issue #7)
router.get('/status/:courseId', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const payment = await prisma.payment.findFirst({
      where: {
        userId,
        courseId,
        status: 'SUCCESS'
      }
    });

    res.json({
      paid: !!payment,
      payment
    });
  } catch (error) {
    console.error('Fetch payment status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/payments/create-order - Initialize checkout order (Issue #3)
router.post('/create-order', authenticateToken, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { courseId, amount } = req.body;

    if (!courseId || !amount) {
      return res.status(400).json({ message: 'Course ID and amount are required.' });
    }

    // Create a new PENDING payment in DB
    const payment = await prisma.payment.create({
      data: {
        userId,
        courseId,
        amount: parseInt(amount),
        status: 'PENDING'
      }
    });

    // Generate strict cryptographic payload signature to simulate third-party gateway providers (Stripe/Razorpay)
    const rawPayload = `${payment.id}:${payment.amount}:${payment.courseId}`;
    const mockSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawPayload)
      .digest('hex');

    res.json({
      orderId: payment.id,
      amount: payment.amount,
      courseId: payment.courseId,
      mockSignature // Sent to client for webhook emulation
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/payments/verify - Cryptographically verify webhook/transaction and update DB (Issue #3, #4)
router.post('/verify', authenticateToken, async (req: any, res: any) => {
  try {
    const { orderId, mockSignature, gatewayReference } = req.body;

    if (!orderId || !mockSignature) {
      return res.status(400).json({ message: 'Order ID and signature are required.' });
    }

    // Fetch the pending payment
    const payment = await prisma.payment.findUnique({
      where: { id: orderId }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // STRICT CRYPTOGRAPHIC HMAC SIGNATURE VERIFICATION
    const rawPayload = `${payment.id}:${payment.amount}:${payment.courseId}`;
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawPayload)
      .digest('hex');

    if (expectedSignature !== mockSignature) {
      // Spoofing attempt detected! Set payment to FAILED
      await prisma.payment.update({
        where: { id: orderId },
        data: { status: 'FAILED' }
      });
      return res.status(403).json({ message: 'Security Check: Cryptographic payment signature spoofing detected!' });
    }

    // Update payment record to SUCCESS and log reference id
    const updatedPayment = await prisma.payment.update({
      where: { id: orderId },
      data: {
        status: 'SUCCESS',
        reference: gatewayReference || `PAY_MOCK_${crypto.randomBytes(6).toString('hex').toUpperCase()}`
      }
    });

    res.json({
      success: true,
      message: 'Payment verified and captured successfully.',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
