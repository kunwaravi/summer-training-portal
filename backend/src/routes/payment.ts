import { Router } from 'express';
import * as paymentService from '../services/paymentService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { validate, createOrderSchema, verifyPaymentSchema } from '../middleware/validation';

const router = Router();

// GET /api/payments/admin/all - Fetch all transactions for admin audit dashboard
router.get('/admin/all', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

// GET /api/payments/status/:courseId - Get current payment status for active user
router.get('/status/:courseId', authenticateToken, async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const payment = await paymentService.getPaymentStatus(userId, courseId);

    res.json({
      paid: !!payment,
      payment
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/create-order - Initialize checkout order
router.post('/create-order', authenticateToken, validate(createOrderSchema), async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.id;
    const { courseId, amount } = req.body;

    const orderData = await paymentService.createOrder(userId, courseId, parseInt(amount));
    res.json(orderData);
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/verify - Cryptographically verify webhook/transaction and update DB
router.post('/verify', authenticateToken, validate(verifyPaymentSchema), async (req: any, res: any, next: any) => {
  try {
    const { orderId, mockSignature, gatewayReference } = req.body;

    const verificationResult = await paymentService.verifyPayment(orderId, mockSignature, gatewayReference);

    if ('error' in verificationResult) {
      return res.status(verificationResult.status || 500).json({ message: verificationResult.error });
    }

    res.json({
      success: true,
      message: 'Payment verified and captured successfully.',
      payment: verificationResult.payment
    });
  } catch (error) {
    next(error);
  }
});

export default router;
