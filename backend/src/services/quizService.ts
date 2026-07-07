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

export const submitQuiz = async (userId: number, courseId: string, week: number, answers: Record<number, string>, topicId?: number) => {
  const questionIds = Object.keys(answers).map(id => parseInt(id));
  if (questionIds.length === 0) return null;

  const questions = await prisma.quizQuestion.findMany({
    where: {
      id: { in: questionIds }
    }
  });

  if (questions.length === 0) return null;

  let correctCount = 0;
  const totalQuestions = questions.length;
  const breakdown = questions.map(q => {
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
    const userRecord = await prisma.user.findUnique({ where: { id: userId } });
    if (userRecord) {
      let xpToAward = 100;
      if (score === 100) {
        xpToAward += 50;
      }

      const currentBadges = userRecord.badges || [];
      const newBadges = [...currentBadges];

      if (score === 100 && !newBadges.includes('perfect_score')) {
        newBadges.push('perfect_score');
      }
      if (week === 1 && !newBadges.includes('week_1_master')) {
        newBadges.push('week_1_master');
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          points: userRecord.points + xpToAward,
          badges: newBadges
        }
      });
    }

    if (topicId) {
      // Create/Update TopicProgress
      await prisma.topicProgress.upsert({
        where: {
          userId_topicId: {
            userId,
            topicId
          }
        },
        update: {
          completed: true,
          quizPassed: true,
          quizScore: score
        },
        create: {
          userId,
          courseId,
          topicId,
          completed: true,
          quizPassed: true,
          quizScore: score
        }
      });

      // Verify if it is the last topic to mark module/course completion
      const topicRecord = await prisma.topic.findUnique({
        where: { id: topicId },
        include: {
          module: {
            include: {
              topics: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (topicRecord) {
        const topicsInModule = topicRecord.module.topics;
        const lastTopic = topicsInModule[topicsInModule.length - 1];

        if (lastTopic && lastTopic.id === topicId) {
          // Mark module-level progress as completed
          await prisma.moduleProgress.upsert({
            where: {
              userId_moduleId: {
                userId,
                moduleId: topicRecord.moduleId
              }
            },
            update: {
              completed: true,
              quizPassed: true,
              quizScore: score
            },
            create: {
              userId,
              courseId,
              moduleId: topicRecord.moduleId,
              completed: true,
              quizPassed: true,
              quizScore: score
            }
          });

          // Advance overall CourseProgress
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
      }
    } else {
      // Standard Module-level progress update (e.g. CADDED)
      const moduleRecord = await prisma.module.findFirst({
        where: {
          courseId,
          week
        }
      });

      if (moduleRecord) {
        await prisma.moduleProgress.upsert({
          where: {
            userId_moduleId: {
              userId,
              moduleId: moduleRecord.id
            }
          },
          update: {
            completed: true,
            quizPassed: true,
            quizScore: score
          },
          create: {
            userId,
            courseId,
            moduleId: moduleRecord.id,
            completed: true,
            quizPassed: true,
            quizScore: score
          }
        });
      }

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

export const getTopicQuizQuestions = async (topicId: number) => {
  const questions = await prisma.quizQuestion.findMany({
    where: { topicId }
  });

  if (questions.length === 0) return null;

  // Shuffle and take 5 random questions to create a dynamic/randomized question bank experience
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);

  const safeQuestions = selected.map(({ correctAnswer, ...q }) => ({
    ...q
  }));

  const topicRecord = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      module: true
    }
  });

  return {
    courseId: topicRecord?.module.courseId || '',
    week: topicRecord?.module.week || 0,
    topicId,
    questions: safeQuestions
  };
};
