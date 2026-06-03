import prisma from '../lib/prisma';
import { redis } from '../lib/redis';
import { logger } from '../lib/logger';

export const getCurriculumMap = async () => {
  const cacheKey = 'course:curriculumMap';

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache Hit: ${cacheKey}`);
      return JSON.parse(cachedData);
    }
  } catch (err) {
    logger.error('Redis cache get error:', err);
  }

  logger.info(`Cache Miss: ${cacheKey}`);

  const courses = await prisma.course.findMany({
    include: {
      modules: {
        select: {
          id: true,
          order: true,
          title: true,
          description: true
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  const curriculumMap: Record<string, any[]> = {};
  for (const c of courses) {
    curriculumMap[c.id] = c.modules;
  }

  try {
    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(curriculumMap));
  } catch (err) {
    logger.error('Redis cache set error:', err);
  }

  return curriculumMap;
};

export const getModuleWithTopics = async (courseId: string, orderNum: number, userId: string, userRole: string) => {
  // Check if the user is an Admin OR has made a successful payment for this course
  const successPayment = await prisma.payment.findFirst({
    where: {
      userId: parseInt(userId, 10),
      courseId,
      status: 'SUCCESS'
    }
  });

  if (!successPayment && userRole !== 'ADMIN') {
    logger.error(`Syllabus detail access blocked: User ${userId} has not purchased course ${courseId}`);
    const error: any = new Error('Payment required: Please purchase this course track to unlock full syllabus topics.');
    error.statusCode = 402;
    error.paymentRequired = true;
    throw error;
  }

  // Enforce sequential unlocking
  if (orderNum > 1 && userRole !== 'ADMIN') {
    const prevModule = await prisma.module.findFirst({
      where: {
        courseId,
        order: orderNum - 1
      }
    });

    if (prevModule) {
      const prevProgress = await prisma.moduleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: parseInt(userId, 10),
            moduleId: prevModule.id
          }
        }
      });

      if (!prevProgress || !prevProgress.quizPassed) {
        logger.error(`Module locked: User ${userId} has not completed previous module ${orderNum - 1}`);
        const error: any = new Error(`Locked module: You must pass the quiz for Module ${orderNum - 1} before unlocking Module ${orderNum}.`);
        error.statusCode = 403;
        throw error;
      }
    }
  }

  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      order: orderNum
    },
    include: {
      topics: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!moduleRecord) {
    logger.error(`Fetch module details failure: Order ${orderNum} for course ${courseId} not found.`);
    const error: any = new Error(`Module at order ${orderNum} for course ${courseId} not found.`);
    error.statusCode = 404;
    throw error;
  }

  return moduleRecord;
};
