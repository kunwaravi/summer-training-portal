import prisma from '../lib/prisma';

export const getQuizQuestions = async (courseId: string, week: number) => {
  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      week
    },
    include: {
      quizQuestions: true
    }
  });

  if (!moduleRecord) return null;

  const safeQuestions = moduleRecord.quizQuestions.map(({ correctAnswer, ...q }) => ({
    ...q
  }));

  return {
    courseId,
    week,
    questions: safeQuestions
  };
};

export const submitQuiz = async (userId: number, courseId: string, week: number, answers: Record<number, string>) => {
  const moduleRecord = await prisma.module.findFirst({
    where: {
      courseId,
      week
    },
    include: {
      quizQuestions: true
    }
  });

  if (!moduleRecord || moduleRecord.quizQuestions.length === 0) return null;

  let correctCount = 0;
  const totalQuestions = moduleRecord.quizQuestions.length;
  const breakdown = moduleRecord.quizQuestions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      text: q.text,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect
    };
  });

  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 60;

  const result = await prisma.quizResult.create({
    data: {
      userId,
      courseId,
      week,
      score,
      passed
    }
  });

  if (passed) {
    const currentProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId
        }
      }
    });

    const currentWeekCompleted = currentProgress?.weekCompleted || 0;
    
    if (week > currentWeekCompleted) {
      await prisma.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        },
        update: {
          weekCompleted: week,
          progress: Math.min(Math.round((week / 20) * 100), 100),
          completed: week >= 20
        },
        create: {
          userId,
          courseId,
          weekCompleted: week,
          progress: Math.min(Math.round((week / 20) * 100), 100),
          completed: week >= 20
        }
      });
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
    result,
    score,
    passed,
    breakdown,
    updatedUser
  };
};

export const createQuizQuestion = async (moduleId: number, data: { text: string; options: string[]; correctAnswer: string }) => {
  const newQuestion = await prisma.quizQuestion.create({
    data: {
      moduleId,
      text: data.text,
      options: data.options,
      correctAnswer: data.correctAnswer
    }
  });
  return newQuestion;
};

export const updateQuizQuestion = async (questionId: number, data: { text?: string; options?: string[]; correctAnswer?: string }) => {
  const updatedQuestion = await prisma.quizQuestion.update({
    where: { id: questionId },
    data: {
      text: data.text,
      options: data.options,
      correctAnswer: data.correctAnswer
    }
  });
  return updatedQuestion;
};

export const deleteQuizQuestion = async (questionId: number) => {
  return await prisma.quizQuestion.delete({ where: { id: questionId } });
};
