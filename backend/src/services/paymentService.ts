import prisma from '../lib/prisma';
import crypto from 'crypto';
import { getReferralStats } from './authService';

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

// Latest row still awaiting admin action (PENDING or legacy PENDING_VERIFICATION).
// Used by the /pay page to resume the "awaiting verification" state after a refresh.
export const getPendingPaymentStatus = async (userId: number, courseId: string) => {
  return await prisma.payment.findFirst({
    where: {
      userId,
      courseId,
      status: { in: ['PENDING', 'PENDING_VERIFICATION'] }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const createOrder = async (userId: number, courseId: string, amount: number, couponCode?: string) => {
  const existingPayment = await prisma.payment.findFirst({
    where: { userId, courseId, status: { in: ['VERIFIED', 'PENDING', 'PENDING_VERIFICATION'] } }
  });

  if (existingPayment?.status === 'VERIFIED') {
    return { error: 'Certificate already unlocked for this course.', status: 400 };
  }
  if (existingPayment?.status === 'PENDING' || existingPayment?.status === 'PENDING_VERIFICATION') {
    return { error: 'Payment proof already submitted and is pending admin verification. Please wait.', status: 400 };
  }

  // Fetch course details to get the actual price
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  const basePrice = course ? course.price : 699;

  // Fetch user's referral code and calculate referral count
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  let referralDiscount = 0;
  let referralCount = 0;
  if (user && user.referralCode) {
    const stats = await getReferralStats(user.referralCode);
    referralCount = stats.referralCount;
    if (stats.referralSuccess) {
      // BUSINESS (#68): cap referral discount at 50% — 100% free was a
      // money-loss exploit via fake-referral signups.
      referralDiscount = 0.5;
    }
  }

  // Calculate coupon discount
  let couponDiscount = 0;
  if (couponCode) {
    const code = couponCode.toUpperCase().trim();
    // SECURITY (#100): SAVI10 was a 100%-off → auto-VERIFIED money-loss exploit
    // (same pattern as the referral exploit #68). "Save 10" → 10% off.
    if (code === 'SAVI10') couponDiscount = 0.1;
    else if (code === 'AVI050') couponDiscount = 0.5;
    else if (code === 'AVI030') couponDiscount = 0.3;
    else if (code === 'NEXUS499' || code === 'EDU499' || code === 'SPECIAL499') couponDiscount = basePrice > 0 ? 200 / basePrice : 0;
  }

  // Calculate final discount-adjusted price (using maximum of referral or coupon discount)
  const finalDiscount = Math.max(referralDiscount, couponDiscount);
  const finalAmount = Math.round(basePrice * (1 - finalDiscount));

  // Payment state machine (#100): INITIATED → PENDING → VERIFIED / FAILED.
  // Free checkout (finalAmount 0 via coupon/referral) skips straight to VERIFIED.
  const status = finalAmount === 0 ? 'VERIFIED' : 'INITIATED';

  const payment = await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount: finalAmount,
      status
    }
  });

  return {
    orderId: payment.id,
    amount: payment.amount,
    courseId: payment.courseId,
    discountApplied: finalDiscount * 100,
    referralCount,
    isFree: finalAmount === 0
  };
};

// Student submits payment proof — sets status to PENDING for admin review, or VERIFIED if free.
// SECURITY (#100): the old "cryptographic signature" was mock theater — the client simply echoed an HMAC
// the server had handed it, so it gated nothing. The real gates are (1) ownership: the authenticated
// submitter must own the order (IDOR fix) and (2) manual admin verification.
export const submitPaymentForVerification = async (
  orderId: string,
  userId: number,
  gatewayReference?: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: orderId }
  });

  if (!payment) return { error: 'Order not found', status: 404 };

  if (payment.userId !== userId) {
    return { error: 'This payment order does not belong to your account.', status: 403 };
  }

  // Mark as verified if free checkout (amount is 0), else PENDING admin verification
  const newStatus = payment.amount === 0 ? 'VERIFIED' : 'PENDING';
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

// Admin manually marks a payment as failed (e.g. proof invalid / no UPI received).
// Completes the #100 state machine: INITIATED → PENDING → VERIFIED / FAILED.
export const adminMarkFailed = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) return { error: 'Payment not found', status: 404 };

  if (payment.status === 'VERIFIED' || payment.status === 'SUCCESS') {
    return { error: 'Cannot fail an already verified payment.', status: 400 };
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: 'FAILED' }
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
