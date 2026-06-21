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

export const createOrder = async (userId: number, courseId: string, amount: number, couponCode?: string) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { userId, courseId, status: { in: ['VERIFIED', 'PENDING_VERIFICATION'] } }
  });

  if (existingPayment?.status === 'VERIFIED') {
    return { error: 'Certificate already unlocked for this course.', status: 400 };
  }
  if (existingPayment?.status === 'PENDING_VERIFICATION') {
    return { error: 'Payment proof already submitted and is pending admin verification. Please wait.', status: 400 };
  }

  // Fetch course details to get the actual price
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  const basePrice = course ? course.price : 999;

  // Fetch user's referral code and calculate referral count
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  let referralDiscount = 0;
  let referralCount = 0;
  if (user && user.referralCode) {
    referralCount = await prisma.user.count({
      where: {
        referredBy: {
          equals: user.referralCode,
          mode: 'insensitive'
        }
      }
    });
    
    if (referralCount >= 10) referralDiscount = 1.0;
    else if (referralCount >= 5) referralDiscount = 0.5;
  }

  // Calculate coupon discount
  let couponDiscount = 0;
  if (couponCode) {
    const code = couponCode.toUpperCase().trim();
    if (code === 'SAVI10') couponDiscount = 1.0;
    else if (code === 'AVI050') couponDiscount = 0.5;
    else if (code === 'AVI030') couponDiscount = 0.3;
  }

  // Calculate final discount-adjusted price (using maximum of referral or coupon discount)
  const finalDiscount = Math.max(referralDiscount, couponDiscount);
  const finalAmount = Math.round(basePrice * (1 - finalDiscount));

  // If finalAmount is 0 (100% discount via 10+ referrals or coupon), approve it automatically
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
    discountApplied: finalDiscount * 100,
    referralCount,
    isFree: finalAmount === 0
  };
};

// Student submits payment proof — sets status to PENDING_VERIFICATION for admin review, or VERIFIED if free
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

  // Mark as verified if free checkout (amount is 0), else pending verification
  const newStatus = payment.amount === 0 ? 'VERIFIED' : 'PENDING_VERIFICATION';
  const updatedPayment = await prisma.payment.update({
    where: { id: orderId },
    data: {
      status: newStatus,
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
