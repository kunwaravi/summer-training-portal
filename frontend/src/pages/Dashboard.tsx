import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import api from '../api';
import { useCourses } from '../hooks/useCourses';
import { Cpu, Code, Wifi, Box, BookOpen, Award, CheckCircle2, TrendingUp, Zap, Target, Globe, Terminal, Database, Wrench, Building2, Flame, RefreshCw, Briefcase, Clock, CalendarDays } from 'lucide-react';
import CourseCard from '../components/molecules/CourseCard';
import Skeleton from '../components/atoms/Skeleton';
import SkillRadar from '../components/molecules/SkillRadar';
import ProjectStatusCard from '../components/molecules/ProjectStatusCard';
import LeaderboardTab from '../components/organisms/LeaderboardTab';
import PageContainer from '../components/layout/PageContainer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

const courseMetadata: Record<string, any> = {
  'C': {
    icon: Code,
    color: 'from-blue-500 to-blue-700',
    barColor: 'bg-blue-500',
  },
  'C++': {
    icon: Box,
    color: 'from-purple-500 to-purple-700',
    barColor: 'bg-purple-500',
  },
  'IoT': {
    icon: Wifi,
    color: 'from-green-500 to-green-700',
    barColor: 'bg-green-500',
  },
  'Embedded': {
    icon: Cpu,
    color: 'from-orange-500 to-orange-750',
    barColor: 'bg-orange-500',
  },
  'WebDesign': {
    icon: Globe,
    color: 'from-pink-500 to-pink-700',
    barColor: 'bg-pink-500',
  },
  'Python': {
    icon: Terminal,
    color: 'from-amber-500 to-amber-700',
    barColor: 'bg-amber-500',
  },
  'SQL': {
    icon: Database,
    color: 'from-emerald-500 to-emerald-700',
    barColor: 'bg-emerald-500',
  },
  'CADDED_Mech': {
    icon: Wrench,
    color: 'from-orange-500 to-orange-700',
    barColor: 'bg-orange-500',
  },
  'CADDED_Civil': {
    icon: Building2,
    color: 'from-emerald-500 to-emerald-700',
    barColor: 'bg-emerald-500',
  },
};

// #102 — status chip palette for the My Internship panel (mirrors the admin
// InternshipAdmin console styles so a given status reads the same on both sides).
const INTERN_STATUS_STYLES: Record<string, string> = {
  APPLIED: 'bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-500/25',
  SELECTED: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/25',
  ACTIVE: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/25',
  COMPLETED: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/25',
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'referrals'>('overview');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUI();
  const { data: coursesData, loading } = useCourses();
  // Daily coding challenge + real streak (issue #74)
  const [daily, setDaily] = useState<any>(null);
  const [dailySolved, setDailySolved] = useState<boolean | null>(null);
  const [dailyFeedback, setDailyFeedback] = useState<string | null>(null);
  const [dailyAnswer, setDailyAnswer] = useState<string | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/practice/daily')
      .then((r) => setDaily(r.data))
      .catch((err) => {
        const msg = err.response?.data?.message || 'Failed to load the daily challenge.';
        setDailyError(msg);
        addToast(msg, 'error');
      });
  }, [addToast]);

  // #102 — the student's own internship records (GET /api/internships/mine →
  // bare array). Fetch failure degrades to the empty state, never a crash.
  const [myInternships, setMyInternships] = useState<any[]>([]);
  useEffect(() => {
    api
      .get('/internships/mine')
      .then((r) => setMyInternships(Array.isArray(r.data) ? r.data : []))
      .catch(() => setMyInternships([]));
  }, []);

  const submitDailyAnswer = async (answer: string) => {
    try {
      setDailyAnswer(answer);
      const res = await api.post('/practice/daily/submit', { answer });
      if (res.data.alreadySolved) {
        setDailySolved(false);
        setDailyFeedback('Already solved today — come back tomorrow for more XP!');
        return;
      }
      setDailySolved(res.data.correct);
      setDailyFeedback(
        res.data.correct
          ? `Correct! +${res.data.pointsEarned} XP (streak ${res.data.streak}🔥${res.data.milestone ? ' · milestone bonus!' : ''})`
          : `Not quite — correct answer: ${res.data.correctAnswer}`
      );
      setDaily((prev: any) => ({ ...prev, streak: res.data.streak, solvedToday: true }));
    } catch {
      setDailyFeedback('Failed to submit. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageContainer maxWidth="max-w-7xl" className="py-6 sm:py-8 space-y-8 sm:space-y-10" role="status" aria-label="Loading dashboard">
        <span className="sr-only">Loading your dashboard…</span>
        {/* welcome header */}
        <div className="space-y-4">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        {/* stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        {/* tab bar */}
        <Skeleton className="h-12 w-80 max-w-full rounded-2xl" />
        {/* course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      </PageContainer>
    );
  }

  const courses = coursesData || [];

  // #102 — internship dates arrive as raw ISO from listMine; format for display
  // (same idiom as the admin InternshipAdmin console).
  const fmtInternDate = (d: any) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  // Helper to extract course specific stats
  const getCourseProgress = (courseId: string) => {
    if (!user || !user.progresses) return { progress: 0, weekCompleted: 0, completed: false };
    const p = user.progresses.find((item: any) => item.courseId === courseId);
    return p ? { progress: p.progress, weekCompleted: p.weekCompleted, completed: p.completed } : { progress: 0, weekCompleted: 0, completed: false };
  };

  // Aggregated metrics
  const activeTracksCount = user?.progresses?.filter((p: any) => p.progress > 0 && p.progress < 100).length || 0;
  const completedTracksCount = user?.progresses?.filter((p: any) => p.progress === 100).length || 0;
  const totalQuizzesPassed = user?.results?.filter((r: any) => r.passed).length || 0;

  // #78 — real accuracy + XP level (no fabricated "+1 this week" deltas).
  const totalQuizzesAttempted = user?.results?.length || 0;
  const quizAccuracy = totalQuizzesAttempted > 0
    ? Math.round((totalQuizzesPassed / totalQuizzesAttempted) * 100)
    : null;
  const xpLevel = Math.floor((user?.points || 0) / 150) + 1;

  // Calculate mock skills based on progress
  const getSkillValue = (trackId: string) => {
    const p = getCourseProgress(trackId);
    return Math.min(Math.round(p.progress * 0.8 + (p.weekCompleted * 2)), 100);
  };

  const skills = [
    { label: 'C Logic', value: getSkillValue('C') || 15, color: '#3b82f6' },
    { label: 'OOP / C++', value: getSkillValue('C++') || 10, color: '#a855f7' },
    { label: 'IoT Networking', value: getSkillValue('IoT') || 5, color: '#10b981' },
    { label: 'Embedded HW', value: getSkillValue('Embedded') || 5, color: '#f59e0b' },
    { label: 'Web Design', value: getSkillValue('WebDesign') || 5, color: '#ec4899' },
    { label: 'Python Scripting', value: getSkillValue('Python') || 5, color: '#eab308' },
    { label: 'SQL DB', value: getSkillValue('SQL') || 5, color: '#10b981' },
    { label: 'Mech CAD', value: getSkillValue('CADDED_Mech') || 5, color: '#f97316' },
    { label: 'Civil CAD', value: getSkillValue('CADDED_Civil') || 5, color: '#10b981' },
    { label: 'System Design', value: Math.min(totalQuizzesPassed * 5, 100) || 10, color: '#06b6d4' },
  ];
  // #78 — top-4 skills shown as chips under the radar (showcase §02).
  const topSkills = [...skills].sort((a, b) => b.value - a.value).slice(0, 4);
  const skillBadgeColors = [
    'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
    'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
    'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
  ];

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Real streak from /practice/daily (issue #74) — replaces the old fake totalQuizzes*2+1.
  const streakDays = daily?.streak ?? (totalQuizzesPassed > 0 ? 1 : 0);

  const activeTracks = user?.progresses?.filter((p: any) => p.progress > 0 && p.progress < 100) || [];
  const latestProgressInfo = activeTracks.length > 0 ? activeTracks[0] : null;
  const latestActiveCourse = latestProgressInfo ? {
    id: latestProgressInfo.courseId,
    progress: latestProgressInfo.progress,
    weekCompleted: latestProgressInfo.weekCompleted,
    title: courses.find((c: any) => c.id === latestProgressInfo.courseId)?.title || "Specialized Track"
  } : null;

  // #78 — daily challenge option state styling (light-first + dark).
  const optionClass = (opt: string) =>
    dailySolved === true && dailyAnswer === opt
      ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
      : dailySolved === false && dailyAnswer === opt
        ? 'bg-red-50 dark:bg-red-500/15 border-red-500/40 text-red-700 dark:text-red-300'
        : dailySolved === false && opt === daily?.question?.correctAnswer
          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
          : dailySolved !== null
            ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
            : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-blue-500/50 hover:text-indigo-600 dark:hover:text-blue-300';

  return (
    <PageContainer maxWidth="max-w-7xl" className="py-6 sm:py-8 space-y-8 sm:space-y-10">

      {/* ── Welcome Header (showcase §02) ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-indigo-200 dark:to-cyan-400 dark:bg-clip-text">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {daily && daily.streak > 0
              ? daily.bonusOnNextMilestone === 0
                ? "Milestone bonus is ready — keep the streak alive!"
                : `You're on a ${daily.streak}-day streak — ${daily.bonusOnNextMilestone} day${daily.bonusOnNextMilestone !== 1 ? 's' : ''} to bonus XP.`
              : 'Welcome to your student academic console. Manage your industrial learning tracks below.'}
          </p>
        </div>

        {user?.badges && user.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">Achievements:</span>
            {user.badges.map((b: string) => {
              const meta: Record<string, string> = {
                perfect_score: '💯 Perfect Score',
                week_1_master: '🎓 Week 1 Master',
                bug_hunter: '🐛 Bug Hunter'
              };
              return (
                <span key={b} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  {meta[b] || b}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs font-bold items-center">
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shadow-sm">
            <Flame size={14} /> {streakDays}-Day Streak
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-blue-500/10 border border-indigo-500/25 dark:border-blue-500/25 text-indigo-600 dark:text-blue-400 flex items-center gap-1.5 shadow-sm">
            <Zap size={14} /> {user?.points || 0} XP
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            🏢 {user?.collegeName || 'Government Polytechnic'}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            ⚙ {user?.branchName || 'ECE'}
          </span>
        </div>
      </div>

      {/* ── Navigation Tabs ───────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
        <TabsList className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm overflow-x-auto">
          <TabsTrigger value="overview" className={`pb-4 font-black uppercase tracking-widest text-[11px] sm:text-xs transition-colors relative whitespace-nowrap ${
            activeTab === 'overview' ? 'text-indigo-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}>
            Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-blue-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className={`pb-4 font-black uppercase tracking-widest text-[11px] sm:text-xs transition-colors relative whitespace-nowrap ${
            activeTab === 'leaderboard' ? 'text-indigo-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}>
            Leaderboard
            {activeTab === 'leaderboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-blue-500"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="referrals" className={`pb-4 font-black uppercase tracking-widest text-[11px] sm:text-xs transition-colors relative whitespace-nowrap ${
            activeTab === 'referrals' ? 'text-indigo-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}>
            Referrals & Rewards
            {activeTab === 'referrals' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-blue-500"></span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 sm:space-y-10">
          {/* ── Stat Cards (showcase §02) ──────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: BookOpen, label: 'Active Tracks', value: activeTracksCount, hint: 'Tracks in progress', hintColor: 'text-indigo-600 dark:text-blue-400', iconColor: 'text-indigo-600 dark:text-blue-400', iconBg: 'bg-indigo-50 dark:bg-blue-500/10' },
              { icon: CheckCircle2, label: 'Completed', value: completedTracksCount, hint: 'Tracks finished', hintColor: 'text-emerald-600 dark:text-emerald-400', iconColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { icon: TrendingUp, label: 'Quizzes Passed', value: totalQuizzesPassed, hint: quizAccuracy !== null ? `▲ ${quizAccuracy}% accuracy` : 'No attempts yet', hintColor: 'text-emerald-600 dark:text-emerald-400', iconColor: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-500/10' },
              { icon: Award, label: 'Total XP', value: user?.points || 0, hint: `🔥 Level ${xpLevel}`, hintColor: 'text-amber-600 dark:text-amber-400', iconColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-500/10' },
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center gap-3 sm:gap-4">
                <div className={`p-2.5 sm:p-3 rounded-xl ${stat.iconBg} ${stat.iconColor} shrink-0`}>
                  <stat.icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">{stat.label}</p>
                  <h3 className="text-2xl font-black mt-0.5 text-slate-900 dark:text-white leading-none">{stat.value}</h3>
                  <p className={`text-[11px] font-bold mt-1 truncate ${stat.hintColor}`}>{stat.hint}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Continue Learning banner (regression-safe resume CTA) ──── */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-slate-900/50 dark:to-slate-900/30 border border-indigo-200 dark:border-blue-500/30 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 dark:bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 dark:bg-blue-500"></span>
                </span>
                Pick Up Where You Left Off
              </div>
              {latestActiveCourse ? (
                <div className="mt-2.5 space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">{latestActiveCourse.title}</h3>
                  <div className="flex items-center gap-3 max-w-xl">
                    <div className="h-2 flex-1 bg-white dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-blue-600 dark:to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${latestActiveCourse.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] font-black font-mono text-indigo-600 dark:text-blue-400 shrink-0">{latestActiveCourse.progress}%</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Currently on Chapter {latestActiveCourse.weekCompleted + 1} — clear the chapter assessment to proceed.
                  </p>
                </div>
              ) : (
                <div className="mt-2.5">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Ready to start your journey?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Choose a specialized engineering track below and claim your accredited certification.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(latestActiveCourse ? `/course/${latestActiveCourse.id}` : `/course/C`)}
              className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 dark:bg-blue-600 hover:bg-indigo-700 dark:hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 dark:shadow-blue-900/20 active:scale-95 uppercase tracking-widest"
            >
              {latestActiveCourse ? "Resume Course" : "Get Started"}
              <span className="text-lg">→</span>
            </button>
          </div>

          {/* ── Daily Challenge + Skill Matrix (showcase §02) ──────────── */}
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Daily Coding Challenge */}
            {!daily && dailyError && (
              <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm border border-red-300 dark:border-red-800 shadow-sm p-5">
                <p className="text-sm font-bold text-red-600 dark:text-red-400">{dailyError}</p>
              </div>
            )}
            {daily && (
              <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">🔥</span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white whitespace-nowrap">Daily Coding Challenge</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-widest shrink-0">
                      Streak {daily.streak}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold hidden sm:block">
                    {daily.bonusOnNextMilestone === 0 ? 'Milestone ready!' : `${daily.bonusOnNextMilestone} days to bonus XP`}
                  </span>
                </div>

                <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-200 leading-snug">{daily.question.text}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1 mb-3">
                  {daily.question.topic} · {daily.question.difficulty}
                </p>

                <div className="grid sm:grid-cols-2 gap-2">
                  {(daily.question.options || []).map((opt: string, i: number) => (
                    <button
                      key={i}
                      disabled={daily.solvedToday || dailySolved !== null}
                      onClick={() => submitDailyAnswer(opt)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed ${optionClass(opt)}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {dailySolved !== null && dailyFeedback && (
                  <p className={`mt-3 text-sm font-bold ${dailySolved ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{dailyFeedback}</p>
                )}
                {daily.solvedToday && dailySolved === null && (
                  <p className="mt-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">✓ Solved today — come back tomorrow to keep your streak!</p>
                )}
              </div>
            )}

            {/* Skill Matrix */}
            <div className={`${daily ? 'lg:col-span-2' : 'lg:col-span-5'} rounded-2xl bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col`}>
              <div className="flex items-center justify-between mb-3 gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Skill Matrix</h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  {topSkills.map((s) => s.label.split(' ')[0]).join(' · ')}
                </span>
              </div>
              <div className="relative flex-1 min-h-[200px]">
                <SkillRadar skills={skills} />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {topSkills.map((s, i) => (
                  <span key={s.label} className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${skillBadgeColors[i % skillBadgeColors.length]}`}>
                    {s.label} {s.value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Milestone Submissions ─────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                <Target size={18} />
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">Milestone Submissions</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProjectStatusCard
                type="Assignment"
                week={1}
                title="Binary System & Bitwise Macros"
                status={user?.progresses?.some((p: any) => p.weekCompleted >= 1) ? 'APPROVED' : 'NOT_SUBMITTED'}
              />
              <ProjectStatusCard
                type="Assignment"
                week={2}
                title="Modular Pointers & Array Logic"
                status={user?.progresses?.some((p: any) => p.weekCompleted >= 2) ? 'APPROVED' : 'NOT_SUBMITTED'}
              />
              <ProjectStatusCard
                type="Assignment"
                week={3}
                title="Hardware Structs & Register Mapping"
                status={user?.progresses?.some((p: any) => p.weekCompleted >= 3) ? 'APPROVED' : 'NOT_SUBMITTED'}
              />
              <ProjectStatusCard
                type="Final Project"
                title="Embedded OS Implementation"
                status={completedTracksCount > 0 ? 'PENDING' : 'NOT_SUBMITTED'}
              />
            </div>
          </div>

          {/* ── Courses / Training Tracks Grid ─────────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Choose Your Training Track</h2>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 py-14 px-6 text-center space-y-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                  <BookOpen size={24} />
                </span>
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 dark:text-white">No training tracks yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Your tracks are being prepared. Check back shortly — new industrial learning paths appear here.
                  </p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {courses.map((course: any) => {
                  const progressInfo = getCourseProgress(course.id);
                  const metadata = courseMetadata[course.id] || {
                    icon: BookOpen,
                    color: 'from-slate-700 to-slate-900',
                    barColor: 'bg-slate-500',
                  };

                  return (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      desc={course.description || course.desc}
                      icon={metadata.icon}
                      color={metadata.color}
                      barColor={metadata.barColor}
                      progress={progressInfo.progress}
                      weekCompleted={progressInfo.weekCompleted}
                      completed={progressInfo.completed}
                      type="dashboard"
                      onAction={(id) => navigate(`/course/${id}`)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* ── My Internship (#102) — distinct panel, separate from the training tracks ── */}
          <div className="rounded-2xl bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg text-cyan-600 dark:text-cyan-400">
                <Briefcase size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">My Internship</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Industrial placements & certificate access</p>
              </div>
            </div>

            {myInternships.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 py-10 px-6 text-center space-y-2">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                  <Briefcase size={22} />
                </span>
                <p className="text-sm font-black text-slate-600 dark:text-slate-300">No internships yet.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Your internship applications and issued certificates will show up here.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {myInternships.map((it: any) => (
                  <li key={it.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{it.programTitle || 'Internship Program'}</p>
                        <p className="text-[11px] uppercase font-bold tracking-wide text-slate-500 dark:text-slate-400 mt-0.5">
                          {[it.domain, it.role].filter(Boolean).join(' · ') || '—'}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${INTERN_STATUS_STYLES[it.status] || INTERN_STATUS_STYLES.APPLIED}`}>
                        {it.status || 'APPLIED'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {it.duration ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400 dark:text-slate-500" /> {it.duration}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-slate-400 dark:text-slate-500" />
                        {fmtInternDate(it.startDate)} — {fmtInternDate(it.endDate)}
                      </span>
                    </div>
                    {it.certificate && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => window.open(`/internship-certificate?internshipId=${it.id}`, '_blank')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 dark:bg-cyan-500 hover:bg-cyan-700 dark:hover:bg-cyan-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-all shadow-sm active:scale-95"
                        >
                          View Internship Certificate
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardTab currentUserId={user?.id} />
        </TabsContent>

        <TabsContent value="referrals">
        <div className="space-y-8 animate-fade-in text-slate-350">
          {/* Referral Intro Header */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-2xl space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-black uppercase tracking-wider text-emerald-400">
                Referral Program
              </span>
              <h3 className="text-2xl font-black text-white uppercase italic">Invite Friends, Learn For Free</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Share the gift of learning! Invite your fellow students to join Edunexus Automation Labs. For every successful signup using your referral ID, you unlock automatically scaling discounts on certification fees.
              </p>
            </div>
          </div>

          {/* Referral Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Your Referral Code</span>
              <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                <span className="font-mono text-xs font-bold text-white">{user?.referralCode || 'Generating...'}</span>
                <button
                  onClick={() => {
                    if (user?.referralCode) {
                      navigator.clipboard
                        .writeText(user.referralCode)
                        .then(() => addToast('Referral Code copied to clipboard!', 'success'))
                        .catch(() => addToast('Could not copy. Clipboard permission denied.', 'error'));
                    }
                  }}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-extrabold uppercase transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Your Invite Link</span>
              <div className="flex items-center justify-between gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                <span className="font-mono text-xs font-bold text-white truncate max-w-[150px]">
                  {window.location.origin}/register?ref={user?.referralCode}
                </span>
                <button
                  onClick={() => {
                    if (user?.referralCode) {
                      navigator.clipboard
                        .writeText(`${window.location.origin}/register?ref=${user.referralCode}`)
                        .then(() => addToast('Invite Link copied to clipboard!', 'success'))
                        .catch(() => addToast('Could not copy. Clipboard permission denied.', 'error'));
                    }
                  }}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-extrabold uppercase transition"
                >
                  Copy Link
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-6 w-full md:w-auto text-left">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">Referred Registrations</span>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{user?.referralCount || 0} <span className="text-xs text-slate-500 font-normal">/ 15</span></h3>
                </div>
                <div className="border-l border-slate-800 h-10 hidden md:block"></div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">Referred Payments</span>
                  <h3 className="text-2xl font-black text-cyan-400 mt-1">{user?.referralPaidCount || 0} <span className="text-xs text-slate-500 font-normal">/ 5</span></h3>
                </div>
              </div>
              <div className="text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-850">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">Referral Status</span>
                <h3 className={`text-lg font-black mt-1 ${user?.referralSuccess ? 'text-green-400' : 'text-amber-400'}`}>
                  {user?.referralSuccess ? "SUCCESSFUL (100% OFF)" : "IN PROGRESS (0% OFF)"}
                </h3>
              </div>
            </div>
          </div>

          {/* Discount Tiers Progression */}
          <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-2xl space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Referral Targets & Milestones</h4>
            <div className="space-y-6 text-left">
              {[
                {
                  label: "1. Referred Registrations",
                  current: user?.referralCount || 0,
                  target: 15,
                  desc: "Referred users must complete registration on the EduNexus Pro portal using your referral code or link.",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  label: "2. Successful Payments",
                  current: user?.referralPaidCount || 0,
                  target: 5,
                  desc: "At least 5 of those registered referrals must successfully purchase/verify a course certificate.",
                  color: "from-emerald-500 to-teal-600"
                }
              ].map((tier, idx) => {
                const isCompleted = tier.current >= tier.target;
                const pct = Math.min((tier.current / tier.target) * 100, 100);

                return (
                  <div key={idx} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black uppercase ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                          {isCompleted ? "✓ Completed" : `Needs ${tier.target - tier.current} more`}
                        </span>
                        <h5 className="text-xs font-bold text-white">{tier.label}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500">{tier.desc}</p>
                    </div>

                    <div className="w-full md:w-1/3 space-y-1 shrink-0">
                      <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-500">
                        <span>Target: {tier.target} Users</span>
                        <span className="font-mono">{tier.current} / {tier.target}</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-850">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${tier.color} transition-all duration-1000`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Dashboard;
