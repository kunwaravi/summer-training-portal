import { Router } from 'express';
import prisma from '../lib/prisma';
import { quizzes } from '../lib/curriculumData';

const router = Router();

// GET /api/quiz/questions/:courseId/:week - Fetch questions for a specific week's quiz without showing correct answers
router.get('/questions/:courseId/:week', async (req: any, res: any) => {
  try {
    const { courseId, week } = req.params;
    const weekNum = parseInt(week);

    const courseQuizzes = quizzes[courseId];
    if (!courseQuizzes) {
      return res.status(404).json({ message: 'Course quizzes not found' });
    }

    const weekQuiz = courseQuizzes.find(q => q.week === weekNum);
    if (!weekQuiz) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    // Map questions to omit the correctAnswer property
    const safeQuestions = weekQuiz.questions.map(({ correctAnswer, ...q }) => q);

    res.json({
      courseId,
      week: weekNum,
      questions: safeQuestions
    });
  } catch (error) {
    console.error('Fetch quiz questions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/quiz/submit - Grade quiz submissions in backend, update specific course progress, and save result
router.post('/submit', async (req: any, res: any) => {
  try {
    const { userId, courseId, week, answers } = req.body;
    const weekNum = parseInt(week);
    const userIdNum = parseInt(userId);

    const courseQuizzes = quizzes[courseId];
    if (!courseQuizzes) {
      return res.status(404).json({ message: 'Course quizzes not found' });
    }

    const weekQuiz = courseQuizzes.find(q => q.week === weekNum);
    if (!weekQuiz) {
      return res.status(404).json({ message: 'Quiz for this week not found' });
    }

    // Server-side grading logic
    let correctCount = 0;
    const totalQuestions = weekQuiz.questions.length;
    const breakdown = weekQuiz.questions.map(q => {
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

    // Save to QuizResult DB
    const result = await prisma.quizResult.create({
      data: {
        userId: userIdNum,
        courseId,
        week: weekNum,
        score,
        passed
      }
    });

    // Check if we need to update/upsert CourseProgress for this specific course track
    if (passed) {
      const currentProgress = await prisma.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId: userIdNum,
            courseId
          }
        }
      });

      const currentWeekCompleted = currentProgress?.weekCompleted || 0;
      
      // Only increment week progress if they passed a week that exceeds their previous max week
      if (weekNum > currentWeekCompleted) {
        await prisma.courseProgress.upsert({
          where: {
            userId_courseId: {
              userId: userIdNum,
              courseId
            }
          },
          update: {
            weekCompleted: weekNum,
            progress: weekNum * 25,
            completed: weekNum >= 4
          },
          create: {
            userId: userIdNum,
            courseId,
            weekCompleted: weekNum,
            progress: weekNum * 25,
            completed: weekNum >= 4
          }
        });
      }
    }

    // Fetch the updated user profile to return to the frontend
    const updatedUser = await prisma.user.findUnique({
      where: { id: userIdNum },
      include: {
        progresses: true,
        results: true
      }
    });

    res.json({
      result,
      score,
      passed,
      breakdown,
      updatedUser
    });
  } catch (error) {
    console.error('Quiz submission grading error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
