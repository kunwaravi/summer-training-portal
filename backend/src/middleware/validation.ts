import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return next(new AppError(message, 400));
      }
      return next(error);
    }
  };
};

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    fatherName: z.string().min(2),
    collegeName: z.string().min(2),
    branchName: z.string().min(2),
    phone: z.string().min(10).max(15).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const courseEnrollSchema = z.object({
  body: z.object({
    courseId: z.string(),
  }),
});

export const quizSubmissionSchema = z.object({
  body: z.object({
    userId: z.number().or(z.string()),
    courseId: z.string(),
    week: z.number().or(z.string()),
    answers: z.record(z.string(), z.string().or(z.number())),
  }),
});

export const createCourseSchema = z.object({
  body: z.object({
    id: z.string(),
    title: z.string().min(2),
    description: z.string(),
    price: z.number().optional(),
  }),
});

export const createModuleSchema = z.object({
  body: z.object({
    week: z.number().or(z.string()),
    title: z.string().min(2),
    description: z.string(),
  }),
});

export const createTopicSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    text: z.string(),
    code: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    order: z.number().or(z.string()).optional(),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  }),
});

export const createOrderSchema = z.object({
  body: z.object({
    courseId: z.string(),
    amount: z.number().or(z.string()),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string(),
    mockSignature: z.string(),
    gatewayReference: z.string().optional(),
  }),
});
