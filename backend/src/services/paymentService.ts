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

export const getPaymentStatus = async (userId: number, courseId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      courseId,
      status: 'SUCCESS'
    }
  });
  return payment;
};

export const createOrder = async (userId: number, courseId: string, amount: number) => {
  const payment = await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount,
      status: 'PENDING'
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
    mockSignature
  };
};

export const verifyPayment = async (orderId: string, mockSignature: string, gatewayReference?: string) => {
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

  const updatedPayment = await prisma.payment.update({
    where: { id: orderId },
    data: {
      status: 'SUCCESS',
      reference: gatewayReference || `PAY_MOCK_${crypto.randomBytes(6).toString('hex').toUpperCase()}`
    }
  });

  return { success: true, payment: updatedPayment };
};
