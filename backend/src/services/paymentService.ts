import prisma from '../lib/prisma';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'nexus_webhook_signature_secret_key_2026';

export const getAllPayments = async () => {
  return await prisma.payment.findMany({
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
};

// A payment is considered "paid" only when Admin has manually verified it
export const getPaymentStatus = async (userId: number, courseId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      courseId,
      status: 'VERIFIED'
    }
  });
  return payment;
};

export const createOrder = async (userId: number, courseId: string, amount: number) => {
  // Fetch course details to get the actual price
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  const basePrice = course ? course.price : 999;

  // Fetch user's referral code and calculate referral count
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  let discountPct = 0;
  let referralCount = 0;
  if (user && user.referralCode) {
    referralCount = await prisma.user.count({
      where: { referredBy: user.referralCode }
    });
    
    if (referralCount >= 10) discountPct = 100;
    else if (referralCount >= 5) discountPct = 50;
  }

  // Calculate final discount-adjusted price
  const finalAmount = Math.round(basePrice * (1 - discountPct / 100));

  // If finalAmount is 0 (100% discount via 20+ referrals), approve it automatically
  const status = finalAmount === 0 ? 'VERIFIED' : 'PENDING';

  const payment = await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount: finalAmount,
      status
    }
  });

  const rawPayload = `${payment.id}:${payment.amount}:${payment.courseId}`;
  const mockSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawPayload)
    .digest('hex');

  return {
    orderId: payment.id,
    amount: payment.amount,
    courseId: payment.courseId,
    mockSignature,
    discountApplied: discountPct,
    referralCount,
    isFree: finalAmount === 0
  };
};

// Student submits payment proof — sets status to PENDING_VERIFICATION for admin review
export const submitPaymentForVerification = async (
  orderId: string,
  mockSignature: string,
  gatewayReference?: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: orderId }
  });

  if (!payment) return { error: 'Order not found', status: 404 };

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
    return { error: 'Security Check: Cryptographic payment signature spoofing detected!', status: 403 };
  }

  // Mark as pending verification — admin must approve before certificate is unlocked
  const updatedPayment = await prisma.payment.update({
    where: { id: orderId },
    data: {
      status: 'PENDING_VERIFICATION',
      reference: gatewayReference || `UPI_REF_${crypto.randomBytes(6).toString('hex').toUpperCase()}`
    }
  });

  return { success: true, payment: updatedPayment };
};

// Admin manually verifies and approves a payment — unlocks certificate for student
export const adminVerifyPayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found', status: 404 };

  if (payment.status === 'VERIFIED') {
    return { error: 'Payment is already verified', status: 400 };
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'VERIFIED' }
  });

  return { success: true, payment: updatedPayment };
};

// Admin manually deletes a payment record (spam/duplicates/invalid)
export const deletePayment = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found', status: 404 };

  await prisma.payment.delete({
    where: { id: paymentId }
  });

  return { success: true };
};
