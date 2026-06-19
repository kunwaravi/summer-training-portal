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

// POST /api/payments/admin/verify/:paymentId - Admin manually approves a payment
router.post('/admin/verify/:paymentId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const { paymentId } = req.params;
    const result = await paymentService.adminVerifyPayment(paymentId);

    if ('error' in result) {
      return res.status(result.status || 500).json({ message: result.error });
    }

    res.json({
      success: true,
      message: 'Payment verified by admin. Student certificate is now unlocked.',
      payment: result.payment
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/payments/admin/:paymentId - Admin deletes a payment record
router.delete('/admin/:paymentId', authenticateToken, isAdmin, async (req: any, res: any, next: any) => {
  try {
    const { paymentId } = req.params;
    const result = await paymentService.deletePayment(paymentId);

    if ('error' in result) {
      return res.status(result.status || 500).json({ message: result.error });
    }

    res.json({
      success: true,
      message: 'Payment record deleted successfully.'
    });
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
    const { courseId, amount, couponCode } = req.body;

    const orderData = await paymentService.createOrder(userId, courseId, parseInt(amount), couponCode);
    res.json(orderData);
  } catch (error) {
    next(error);
  }
});

// POST /api/payments/verify - Student submits UPI payment proof, sets PENDING_VERIFICATION
router.post('/verify', authenticateToken, validate(verifyPaymentSchema), async (req: any, res: any, next: any) => {
  try {
    const { orderId, mockSignature, gatewayReference } = req.body;

    const verificationResult = await paymentService.submitPaymentForVerification(orderId, mockSignature, gatewayReference);

    if ('error' in verificationResult) {
      return res.status(verificationResult.status || 500).json({ message: verificationResult.error });
    }

    res.json({
      success: true,
      message: 'Payment submitted for admin verification. Your certificate will be unlocked once approved.',
      payment: verificationResult.payment
    });
  } catch (error) {
    next(error);
  }
});

export default router;
