import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const generateReferralCode = (name: string) => {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `REF-${cleanName}-${randomSuffix}`;
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
  
  // Newly registered user has 0 referrals
  const referralCount = 0;
  
  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, referralCount } };
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
  
  const referralCount = await prisma.user.count({
    where: {
      referredBy: {
        equals: user.referralCode,
        mode: 'insensitive'
      }
    }
  });

  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: { ...userWithoutPassword, referralCount } };
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

  const referralCount = await prisma.user.count({
    where: {
      referredBy: {
        equals: user.referralCode,
        mode: 'insensitive'
      }
    }
  });

  const { password: _, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, referralCount };
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

  // Calculate referral counts in memory from referredBy frequencies (case-insensitive)
  const referralCounts = new Map<string, number>();
  users.forEach(u => {
    if (u.referredBy) {
      const code = u.referredBy.trim().toUpperCase();
      referralCounts.set(code, (referralCounts.get(code) || 0) + 1);
    }
  });

  return users.map(u => ({
    ...u,
    referralCount: u.referralCode ? (referralCounts.get(u.referralCode.trim().toUpperCase()) || 0) : 0
  }));
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return await prisma.user.delete({ where: { id: userId } });
};
