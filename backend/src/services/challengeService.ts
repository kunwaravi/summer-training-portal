import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

// Ordered challenges for a course (grouped by module/week) with per-user completion flags
export const getCourseChallenges = async (courseId: string, userId: number) => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { week: 'asc' },
        include: {
          challenges: {
            where: { isPublished: true },
            orderBy: { order: 'asc' }
          }
        }
      }
    }
  });

  if (!course) {
    throw new AppError('Course not found', 404);
  }

  const completedRows = await prisma.challengeProgress.findMany({
    where: { userId, courseId },
    select: { challengeId: true }
  });
  const completedSet = new Set(completedRows.map(r => r.challengeId));

  const blocks = course.modules
    .filter(module => module.challenges.length > 0)
    .map(module => ({
      moduleId: module.id,
      week: module.week,
      title: module.title,
      challenges: module.challenges.map(c => ({
        id: c.id,
        title: c.title,
        dashedName: c.dashedName,
        order: c.order,
        challengeType: c.challengeType,
        completed: completedSet.has(c.id)
      }))
    }));

  return {
    course: { id: course.id, title: course.title },
    blocks
  };
};

// Single challenge without the solution code (kept secret)
export const getChallenge = async (challengeId: number) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      module: { select: { id: true, week: true, title: true } }
    }
  });

  if (!challenge || !challenge.isPublished) {
    throw new AppError('Challenge not found', 404);
  }

  const { solutionCode: _solutionCode, ...safeChallenge } = challenge;
  return safeChallenge;
};

// Per-course challenge completion counts for the curriculum page
export const getChallengeCounts = async (userId: number) => {
  const all = await prisma.challenge.findMany({
    where: { isPublished: true },
    select: { courseId: true, id: true }
  });

  const doneRows = await prisma.challengeProgress.findMany({
    where: { userId },
    select: { challengeId: true }
  });
  const doneSet = new Set(doneRows.map(r => r.challengeId));

  const result: Record<string, { total: number; completed: number }> = {};
  for (const c of all) {
    if (!result[c.courseId]) result[c.courseId] = { total: 0, completed: 0 };
    result[c.courseId].total += 1;
    if (doneSet.has(c.id)) result[c.courseId].completed += 1;
  }
  return result;
};

// Mark a challenge complete; advance module/course progress when all module challenges are done
export const completeChallenge = async (userId: number, challengeId: number) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { module: true }
  });

  if (!challenge || !challenge.isPublished) {
    throw new AppError('Challenge not found', 404);
  }

  // Light sequential gate: the previous challenge in this module must be completed first
  const prevChallenge = await prisma.challenge.findFirst({
    where: { moduleId: challenge.moduleId, order: { lt: challenge.order }, isPublished: true },
    orderBy: { order: 'desc' }
  });
  if (prevChallenge) {
    const prevDone = await prisma.challengeProgress.findUnique({
      where: { userId_challengeId: { userId, challengeId: prevChallenge.id } }
    });
    if (!prevDone) {
      throw new AppError('Complete the previous challenge first.', 403);
    }
  }

  const existing = await prisma.challengeProgress.findUnique({
    where: { userId_challengeId: { userId, challengeId } }
  });

  if (!existing) {
    await prisma.challengeProgress.create({
      data: {
        userId,
        courseId: challenge.courseId,
        moduleId: challenge.moduleId,
        challengeId
      }
    });

    // Award XP (mirrors quizService's reward pattern)
    const userRecord = await prisma.user.findUnique({ where: { id: userId } });
    if (userRecord) {
      await prisma.user.update({
        where: { id: userId },
        data: { points: userRecord.points + 10 }
      });
    }

    // If every published challenge in this module is now complete, advance
    // module + course progress. Runs only on a genuinely new completion, so a
    // duplicate submission no longer fires these unnecessary DB queries.
    const totalInModule = await prisma.challenge.count({
      where: { moduleId: challenge.moduleId, isPublished: true }
    });
    const doneInModule = await prisma.challengeProgress.count({
      where: { userId, moduleId: challenge.moduleId }
    });

    if (totalInModule > 0 && doneInModule >= totalInModule) {
      await prisma.moduleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: challenge.moduleId } },
        update: { completed: true, quizPassed: true },
        create: {
          userId,
          courseId: challenge.courseId,
          moduleId: challenge.moduleId,
          completed: true,
          quizPassed: true
        }
      });

      // totalModules derived from the DB (not the hardcoded /20 used in quizService)
      const totalModules = await prisma.module.count({
        where: { courseId: challenge.courseId }
      });
      const current = await prisma.courseProgress.findUnique({
        where: { userId_courseId: { userId, courseId: challenge.courseId } }
      });

      const week = challenge.module.week;
      if (week > (current?.weekCompleted || 0)) {
        const progress = totalModules > 0 ? Math.min(Math.round((week / totalModules) * 100), 100) : 100;
        const completed = totalModules > 0 && week >= totalModules;

        await prisma.courseProgress.upsert({
          where: { userId_courseId: { userId, courseId: challenge.courseId } },
          update: { weekCompleted: week, progress, completed },
          create: {
            userId,
            courseId: challenge.courseId,
            weekCompleted: week,
            progress,
            completed
          }
        });
      }
    }
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progresses: true,
      results: true
    }
  });

  return {
    completed: !existing,
    updatedUser
  };
};
