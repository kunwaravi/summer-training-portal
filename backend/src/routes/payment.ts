import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import https from 'https';
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../lib/logger';
import { validateBody } from '../middleware/validate';

const router = Router();
const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET as string;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const ENABLE_REAL_PAYMENTS = process.env.ENABLE_REAL_PAYMENTS === 'true' && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET;

// Middleware to verify admin privileges
const isAdmin = (req: any, res: Response, next: NextFunction): any => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin permissions required' });
  }
};

// GET /api/payments/admin/all - Fetch all transactions for admin audit dashboard (PAGINATED)
router.get('/admin/all', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await prisma.$transaction([
      prisma.payment.findMany({
        skip,
        take: limit,
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
      }),
      prisma.payment.count()
    ]);

    res.json({
      payments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    logger.error('Fetch all payments error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/payments/admin/verify/:paymentId - Admin manual payment verification
router.put('/admin/verify/:paymentId', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<any> => {
  try {
    const paymentId = req.params.paymentId as string;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found.' });
    }

    if (payment.status === 'SUCCESS') {
      return res.status(400).json({ message: 'Payment has already been successfully verified.' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'SUCCESS'
      }
    });

    logger.info(`Admin manual verification successful for payment order ${paymentId}`);

    res.json({
      success: true,
      message: 'Payment successfully verified by Admin.',
      payment: updatedPayment
    });
  } catch (error: any) {
    logger.error('Admin verify payment error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/payments/status/:courseId - Get current payment status for active user
router.get('/status/:courseId', authenticateToken, async (req: any, res: Response): Promise<any> => {
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
  } catch (error: any) {
    logger.error('Fetch payment status error caught in handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper to perform secure, native HTTPS requests
const postHTTPS = (url: string, data: any, headers: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
};

// POST /api/payments/create-order - Initialize checkout order
router.post(
  '/create-order',
  authenticateToken,
  validateBody(['courseId', 'amount']),
  async (req: any, res: Response): Promise<any> => {
    try {
      const userId = req.user.id;
      const { courseId, amount } = req.body;

      const orderAmount = parseInt(amount);

      // Create a new PENDING payment in DB
      const payment = await prisma.payment.create({
        data: {
          userId,
          courseId,
          amount: orderAmount,
          status: 'PENDING'
        }
      });

      if (ENABLE_REAL_PAYMENTS) {
        try {
          const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
          const razorpayOrder = await postHTTPS('https://api.razorpay.com/v1/orders', {
            amount: orderAmount * 100, // in paise
            currency: 'INR',
            receipt: payment.id
          }, {
            Authorization: authHeader
          });

          if (razorpayOrder && razorpayOrder.id) {
            // Update transactionId to the Razorpay Order ID
            await prisma.payment.update({
              where: { id: payment.id },
              data: { transactionId: razorpayOrder.id }
            });

            logger.info(`Razorpay order successfully created for user ${userId} track ${courseId}: ${razorpayOrder.id}`);

            return res.json({
              realPayment: true,
              orderId: payment.id,
              razorpayOrderId: razorpayOrder.id,
              amount: payment.amount,
              courseId: payment.courseId,
              razorpayKeyId: RAZORPAY_KEY_ID
            });
          }
        } catch (err) {
          logger.error('Failed to create Razorpay Order, falling back to secure simulated checkout:', err);
        }
      }

      // Secure Simulated Checkout (Fallback/Sandbox)
      const rawPayload = `${payment.id}:${payment.amount}:${payment.courseId}`;
      const secureToken = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawPayload)
        .digest('hex');

      logger.info(`Sandbox checkout order initialized for user ${userId} track ${courseId}: ${payment.id}`);

      res.json({
        realPayment: false,
        orderId: payment.id,
        amount: payment.amount,
        courseId: payment.courseId,
        mockSignature: secureToken // Secure validation token sent for mock gateway binding
      });
    } catch (error: any) {
      logger.error('Create payment order error caught in handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// POST /api/payments/verify - Cryptographically verify webhook/transaction and update DB
router.post(
  '/verify',
  authenticateToken,
  async (req: any, res: Response): Promise<any> => {
    try {
      const { orderId, mockSignature, gatewayReference, paymentDetails, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      if (!orderId) {
        logger.error('Payment verification failed: Missing Order ID.');
        return res.status(400).json({ message: 'Order ID is required.' });
      }

      // Fetch the pending payment
      const payment = await prisma.payment.findUnique({
        where: { id: orderId }
      });

      if (!payment) {
        logger.error(`Payment verification failed: Order ID ${orderId} not found.`);
        return res.status(404).json({ message: 'Order not found.' });
      }

      // 1. Verify Real Razorpay Payments
      if (razorpay_signature && razorpay_payment_id && razorpay_order_id) {
        if (!RAZORPAY_KEY_SECRET) {
          logger.error('Payment verification failed: Razorpay secret key is not configured.');
          return res.status(500).json({ message: 'Razorpay secret key is not configured.' });
        }

        const generatedSignature = crypto
          .createHmac('sha256', RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        if (generatedSignature !== razorpay_signature) {
          await prisma.payment.update({
            where: { id: orderId },
            data: { status: 'FAILED' }
          });
          logger.error(`Security Check: Razorpay payment signature verification failed for order ${orderId}!`);
          return res.status(403).json({ message: 'Security Check: Razorpay payment signature verification failed!' });
        }

        // Update payment record to SUCCESS
        const updatedPayment = await prisma.payment.update({
          where: { id: orderId },
          data: {
            status: 'SUCCESS',
            transactionId: razorpay_payment_id,
            reference: `PAY_RZP_${razorpay_payment_id}`
          }
        });

        logger.info(`Razorpay transaction successfully verified and captured for order ${orderId}`);

        return res.json({
          success: true,
          message: 'Razorpay payment verified and captured successfully.',
          payment: updatedPayment
        });
      }

      // 2. Verify Secure Sandbox Mock Payments (with credential checks)
      if (!mockSignature) {
        logger.error(`Payment verification failed: Missing signature for sandbox order ${orderId}.`);
        return res.status(400).json({ message: 'Payment authorization signature is missing.' });
      }

      // STRICT CRYPTOGRAPHIC HMAC SIGNATURE VERIFICATION
      const rawPayload = `${payment.id}:${payment.amount}:${payment.courseId}`;
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawPayload)
        .digest('hex');

      if (expectedSignature !== mockSignature) {
        await prisma.payment.update({
          where: { id: orderId },
          data: { status: 'FAILED' }
        });
        logger.error(`Security Check: Cryptographic payment signature spoofing detected for sandbox order ${orderId}!`);
        return res.status(403).json({ message: 'Security Check: Cryptographic payment signature spoofing detected!' });
      }

      // If payment amount is greater than 0, enforce structural validation on mock details
      if (payment.amount > 0 && paymentDetails) {
        const { paymentMethod, cardNumber, cardCvv } = paymentDetails;
        if (paymentMethod === 'card') {
          if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
            logger.error(`Sandbox verification failed: Invalid 16-digit card number for order ${orderId}.`);
            return res.status(400).json({ message: 'Invalid Card: Must be a 16-digit card number.' });
          }
          if (!cardCvv || cardCvv.length !== 3) {
            logger.error(`Sandbox verification failed: Invalid 3-digit CVV for order ${orderId}.`);
            return res.status(400).json({ message: 'Invalid Card: CVV must be exactly 3 digits.' });
          }
        }
      }

      // Update payment record to VERIFICATION_PENDING
      const updatedPayment = await prisma.payment.update({
        where: { id: orderId },
        data: {
          status: 'VERIFICATION_PENDING',
          reference: gatewayReference || `PAY_MOCK_${crypto.randomBytes(6).toString('hex').toUpperCase()}`
        }
      });

      logger.info(`Sandbox transaction submitted and pending verification for order ${orderId}`);

      res.json({
        success: true,
        message: 'Simulated payment submitted and pending verification.',
        payment: updatedPayment
      });
    } catch (error: any) {
      logger.error('Verify payment error caught in handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

export default router;
