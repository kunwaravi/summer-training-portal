import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const registerUser = async (userData: any) => {
  const { email, password, name, fatherName, collegeName, branchName } = userData;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      fatherName,
      collegeName,
      branchName
    },
    include: {
      progresses: true,
      results: true
    }
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  
  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
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

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
  
  // Omit password from return
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
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

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true
    },
    orderBy: {
      name: 'asc'
    }
  });
};
