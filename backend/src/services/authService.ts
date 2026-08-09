import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { getRequiredEnv } from '../lib/env';

// SECURITY (#65): fail-fast — no hardcoded fallback secret.
const JWT_SECRET = getRequiredEnv('JWT_SECRET');

const generateReferralCode = (name: string) => {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `REF-${cleanName}-${randomSuffix}`;
};

export const getReferralStats = async (referralCode: string | null) => {
  if (!referralCode) {
    return {
      referralCount: 0,
      referralPaidCount: 0,
      referralSuccess: false
    };
  }

  const referredUsers = await prisma.user.findMany({
    where: {
      referredBy: {
        equals: referralCode,
        mode: 'insensitive'
      }
    },
    include: {
      payments: {
        where: {
          status: 'VERIFIED'
        }
      }
    }
  });

  const referralCount = referredUsers.length;
  const referralPaidCount = referredUsers.filter(u => u.payments.length > 0).length;
  const referralSuccess = referralCount >= 15 && referralPaidCount >= 5;

  return {
    referralCount,
    referralPaidCount,
    referralSuccess
  };
};

export const registerUser = async (userData: any) => {
  const { email, password, name, fatherName, collegeName, branchName, referredBy } = userData;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Validate referredBy if provided
  let validReferredBy: string | null = null;
  if (referredBy) {
    const normalizedReferredBy = referredBy.trim().toUpperCase();
    const referrer = await prisma.user.findUnique({
      where: { referralCode: normalizedReferredBy }
    });
    if (referrer) {
      validReferredBy = normalizedReferredBy;
    } else {
      throw new AppError('The referral code entered does not exist. Please check the code or register without it.', 400);
    }
  }

  const referralCode = generateReferralCode(name);
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      fatherName,
      collegeName,
      branchName,
      referralCode,
      referredBy: validReferredBy
    },
    include: {
      progresses: true,
      results: true
    }
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  
  const stats = await getReferralStats(user.referralCode);
  
  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, ...stats } };
};

export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      progresses: true,
      results: true
    }
  });

  if (!user) {
    throw new AppError('Invalid credentials', 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 400);
  }

  // Backfill referralCode if missing
  if (!user.referralCode) {
    const generatedCode = generateReferralCode(user.name);
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: generatedCode }
    });
    user.referralCode = generatedCode;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  
  const stats = await getReferralStats(user.referralCode);

  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, ...stats } };
};

export const getUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progresses: true,
      results: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Backfill referralCode if missing
  if (!user.referralCode) {
    const generatedCode = generateReferralCode(user.name);
    await prisma.user.update({
      where: { id: user.id },
      data: { referralCode: generatedCode }
    });
    user.referralCode = generatedCode;
  }

  const stats = await getReferralStats(user.referralCode);

  const { password: _, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, ...stats };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      collegeName: true,
      branchName: true,
      referralCode: true,
      referredBy: true,
      progresses: {
        select: {
          courseId: true,
          progress: true
        }
      },
      payments: {
        select: {
          courseId: true,
          status: true
        }
      }
    },
    orderBy: {
      id: 'asc'
    }
  });

  // Calculate referral and paid counts in memory to prevent N+1 queries
  const referralCounts = new Map<string, number>();
  const referralPaidCounts = new Map<string, number>();

  // Helper mapping of userId to whether they have a verified payment
  const userHasVerifiedPayment = new Map<number, boolean>();
  users.forEach(u => {
    const hasVerified = u.payments.some(p => p.status === 'VERIFIED');
    userHasVerifiedPayment.set(u.id, hasVerified);
  });

  users.forEach(u => {
    if (u.referredBy) {
      const code = u.referredBy.trim().toUpperCase();
      referralCounts.set(code, (referralCounts.get(code) || 0) + 1);
      
      const isPaid = userHasVerifiedPayment.get(u.id) || false;
      if (isPaid) {
        referralPaidCounts.set(code, (referralPaidCounts.get(code) || 0) + 1);
      }
    }
  });

  return users.map(u => {
    const code = u.referralCode ? u.referralCode.trim().toUpperCase() : '';
    const referralCount = code ? (referralCounts.get(code) || 0) : 0;
    const referralPaidCount = code ? (referralPaidCounts.get(code) || 0) : 0;
    const referralSuccess = referralCount >= 15 && referralPaidCount >= 5;
    return {
      ...u,
      referralCount,
      referralPaidCount,
      referralSuccess
    };
  });
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return await prisma.user.delete({ where: { id: userId } });
};

export const updateUserByAdmin = async (userId: number, updateData: {
  name?: string;
  email?: string;
  fatherName?: string;
  collegeName?: string;
  branchName?: string;
  courseType?: string;
  role?: string;
  points?: number;
  grade?: string;
  certificateStartDate?: string;
  certificateEndDate?: string;
}) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  if (updateData.email && updateData.email.trim().toLowerCase() !== existingUser.email.toLowerCase()) {
    const emailCheck = await prisma.user.findUnique({
      where: { email: updateData.email.trim().toLowerCase() }
    });
    if (emailCheck) {
      throw new AppError('Email address is already in use by another candidate', 400);
    }
  }

  const dataToUpdate: any = {};
  if (updateData.name !== undefined) dataToUpdate.name = updateData.name.trim();
  if (updateData.email !== undefined) dataToUpdate.email = updateData.email.trim().toLowerCase();
  if (updateData.fatherName !== undefined) dataToUpdate.fatherName = updateData.fatherName.trim();
  if (updateData.collegeName !== undefined) dataToUpdate.collegeName = updateData.collegeName.trim();
  if (updateData.branchName !== undefined) dataToUpdate.branchName = updateData.branchName.trim();
  if (updateData.courseType !== undefined) dataToUpdate.courseType = updateData.courseType.trim();
  if (updateData.role !== undefined) dataToUpdate.role = updateData.role.trim();
  if (updateData.points !== undefined) dataToUpdate.points = Number(updateData.points);
  if (updateData.grade !== undefined) dataToUpdate.grade = updateData.grade.trim();
  if (updateData.certificateStartDate !== undefined) {
    dataToUpdate.certificateStartDate = updateData.certificateStartDate ? new Date(updateData.certificateStartDate) : null;
  }
  if (updateData.certificateEndDate !== undefined) {
    dataToUpdate.certificateEndDate = updateData.certificateEndDate ? new Date(updateData.certificateEndDate) : null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

