import prisma from '../lib/prisma';

/**
 * Daily Coding Challenge + streak tracking (issue #74).
 *
 * - One deterministic practice question per day (rotated by date).
 * - Streak semantics (using User.streak + User.lastActiveAt as the last active date):
 *     last active == yesterday → streak+1
 *     last active == today     → unchanged (already active today)
 *     otherwise                → reset to 1
 * - Bonus XP every 7-day streak milestone.
 */

const dayKey = (d: Date = new Date()): string => d.toISOString().slice(0, 10); // YYYY-MM-DD UTC

const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
};

const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date): boolean => a.toDateString() === b.toDateString();

/** Compute the streak that applies today given the stored streak + last active date. */
export const computeStreak = (streak: number, lastActiveAt: Date | null): number => {
  const today = startOfDay(new Date());
  if (!lastActiveAt) return 1;
  const last = startOfDay(lastActiveAt);
  if (isSameDay(last, today)) return Math.max(streak, 1); // already active today
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(last, yesterday)) return streak + 1; // consecutive day
  return 1; // missed a day → reset
};

const BONUS_XP = 50;

export const getDailyChallenge = async (userId: number) => {
  const [total, user] = await Promise.all([
    prisma.practiceQuestion.count(),
    prisma.user.findUnique({ where: { id: userId }, select: { streak: true, lastActiveAt: true } })
  ]);

  if (total === 0 || !user) return null;

  const date = dayKey();
  const idx = hashString(date) % total;
  const question = await prisma.practiceQuestion.findFirst({ skip: idx, take: 1 });
  if (!question) return null;

  const streak = computeStreak(user.streak, user.lastActiveAt);
  const solvedToday = user.lastActiveAt ? isSameDay(user.lastActiveAt, new Date()) : false;

  const { correctAnswer, explanation, ...safe } = question;
  return {
    date,
    question: safe,
    streak,
    solvedToday,
    bonusOnNextMilestone: (7 - (streak % 7)) % 7
  };
};

export const submitDailyChallenge = async (userId: number, answer: string) => {
  const daily = await getDailyChallenge(userId);
  if (!daily) return null;

  // Prevent repeat submissions farming XP (already graded today → no-op)
  if (daily.solvedToday) {
    return {
      correct: false,
      alreadySolved: true,
      streak: daily.streak,
      milestone: false,
      bonusXp: 0,
      pointsEarned: 0,
      correctAnswer: '',
      explanation: ''
    };
  }

  const question = await prisma.practiceQuestion.findUnique({
    where: { id: daily.question.id },
    select: { correctAnswer: true, explanation: true, text: true }
  });
  if (!question) return null;

  const correct = answer.trim() === question.correctAnswer.trim();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streak: true, lastActiveAt: true, points: true }
  });
  if (!user) return null;

  const newStreak = computeStreak(user.streak, user.lastActiveAt);
  const milestone = newStreak > 0 && newStreak % 7 === 0;
  const bonusXp = milestone && correct ? BONUS_XP : 0;
  const pointsEarned = correct ? 10 + bonusXp : 0;

  // Atomically claim today's reward. The updateMany WHERE guard means only one
  // concurrent request can win — lastActiveAt must still be before today — so a
  // losing parallel request (count === 0) is treated as already-solved and can
  // never double-award XP.
  const claim = await prisma.user.updateMany({
    where: {
      id: userId,
      OR: [
        { lastActiveAt: null },
        { lastActiveAt: { lt: startOfDay(new Date()) } }
      ]
    },
    data: {
      streak: newStreak,
      lastActiveAt: new Date(),
      points: user.points + pointsEarned
    }
  });

  if (claim.count === 0) {
    return {
      correct: false,
      alreadySolved: true,
      streak: newStreak,
      milestone: false,
      bonusXp: 0,
      pointsEarned: 0,
      correctAnswer: '',
      explanation: ''
    };
  }

  return {
    correct,
    streak: newStreak,
    milestone,
    bonusXp,
    pointsEarned,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation
  };
};
