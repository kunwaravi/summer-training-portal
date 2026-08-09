import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useCourses } from '../hooks/useCourses';
import { Cpu, Code, Wifi, Box, BookOpen, Award, CheckCircle2, TrendingUp, Zap, Target, Globe, Terminal, Database, Wrench, Building2 } from 'lucide-react';
import CourseCard from '../components/molecules/CourseCard';
import Spinner from '../components/atoms/Spinner';
import SkillRadar from '../components/molecules/SkillRadar';
import ProjectStatusCard from '../components/molecules/ProjectStatusCard';
import LeaderboardTab from '../components/organisms/LeaderboardTab';

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'referrals'>('overview');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: coursesData, loading } = useCourses();
  // Daily coding challenge + real streak (issue #74)
  const [daily, setDaily] = useState<any>(null);
  const [dailySolved, setDailySolved] = useState<boolean | null>(null);
  const [dailyFeedback, setDailyFeedback] = useState<string | null>(null);
  const [dailyAnswer, setDailyAnswer] = useState<string | null>(null);

  useEffect(() => {
    api.get('/practice/daily').then((r) => setDaily(r.data)).catch(() => {});
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  const courses = coursesData || [];

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

  return (
    <div className="py-8 space-y-10 max-w-7xl mx-auto px-4">
      
      {/* Welcome Heading & Profile Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-450 text-sm">
            Welcome to your student academic console. Manage your industrial learning tracks below.
          </p>
          {user?.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 items-center">
              <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider">Achievements:</span>
              {user.badges.map((b: string) => {
                const meta: Record<string, string> = {
                  perfect_score: '💯 Perfect Score',
                  week_1_master: '🎓 Week 1 Master',
                  bug_hunter: '🐛 Bug Hunter'
                };
                return (
                  <span key={b} className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-300">
                    {meta[b] || b}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-bold items-center">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center gap-1.5 shadow-sm">
            🔥 {streakDays}-Day Learn Streak
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 flex items-center gap-1.5 shadow-sm">
            ⚡ {user?.points || 0} XP
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            🏢 {user?.collegeName || 'Government Polytechnic'}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            ⚙ {user?.branchName || 'ECE'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-900 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 font-black uppercase tracking-widest text-[11px] sm:text-xs transition-colors relative ${
            activeTab === 'overview' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          Overview
          {activeTab === 'overview' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-4 font-black uppercase tracking-widest text-[11px] sm:text-xs transition-colors relative ${
            activeTab === 'leaderboard' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          Leaderboard
          {activeTab === 'leaderboard' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`pb-4 font-black uppercase tracking-widest text-[11px] sm:text-xs transition-colors relative ${
            activeTab === 'referrals' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          Referrals & Rewards
          {activeTab === 'referrals' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></span>
          )}
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Analytics Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: BookOpen, label: 'Active Tracks', value: activeTracksCount, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: CheckCircle2, label: 'Completed Tracks', value: completedTracksCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: TrendingUp, label: 'Quizzes Passed', value: totalQuizzesPassed, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { icon: Award, label: 'Certificates Earned', value: completedTracksCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((stat, idx) => (
          <div key={idx} className="p-5 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
            <div className={`p-3 ${stat.bg} rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Coding Challenge Widget (issue #74) */}
      {daily && (
        <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/25 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-widest">
              <span className="text-base">🔥</span> Daily Coding Challenge
              <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 rounded-md text-amber-300">
                Streak {daily.streak} day{daily.streak !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {daily.bonusOnNextMilestone === 0 ? 'Milestone ready!' : `${daily.bonusOnNextMilestone} days to bonus XP`}
            </span>
          </div>

          <p className="text-sm text-slate-300 font-medium mb-1">{daily.question.text}</p>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-3">
            {daily.question.topic} · {daily.question.difficulty}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {(daily.question.options || []).map((opt: string, i: number) => (
              <button
                key={i}
                disabled={daily.solvedToday || dailySolved !== null}
                onClick={() => submitDailyAnswer(opt)}
                className={`text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  dailySolved === true && dailyAnswer === opt
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : dailySolved === false && dailyAnswer === opt
                      ? 'bg-red-500/15 border-red-500/40 text-red-300'
                      : dailySolved === false && opt === daily.question.correctAnswer
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : dailySolved !== null
                          ? 'bg-slate-900/40 border-slate-800 text-slate-600'
                          : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {dailySolved !== null && dailyFeedback && (
            <p className={`text-xs font-bold ${dailySolved ? 'text-emerald-400' : 'text-red-400'}`}>{dailyFeedback}</p>
          )}
          {daily.solvedToday && dailySolved === null && (
            <p className="text-xs font-bold text-emerald-400">✓ Solved today — come back tomorrow to keep your streak!</p>
          )}
        </div>
      )}

      {/* Dynamic Mid-Section: Quick Resume & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Quick Resume Card */}
        <div className="lg:col-span-2 p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-400 text-[11px] font-black uppercase tracking-widest">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Pick Up Where You Left Off
            </div>
            
            {latestActiveCourse ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{latestActiveCourse.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                  You are currently on Chapter {latestActiveCourse.weekCompleted + 1}. Resume your studies and clear the chapter assessment to proceed!
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-500">
                    <span>Course Progress</span>
                    <span className="text-blue-400 font-mono">{latestActiveCourse.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-800/50">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
                      style={{ width: `${latestActiveCourse.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">Ready to start your journey?</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                  Choose a specialized engineering track below, study the industrial-focused curriculum chapters, and claim your accredited certifications!
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-8 mt-8 border-t border-slate-800/50 flex justify-end">
            <button 
              onClick={() => navigate(latestActiveCourse ? `/course/${latestActiveCourse.id}` : `/course/C`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 uppercase tracking-widest"
            >
              {latestActiveCourse ? "Resume Course" : "Get Started"}
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width): Skill Analytics Radar */}
        <div className="p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Zap size={16} className="text-amber-400" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-300">Industrial Skill Matrix</h3>
          </div>
          
          <SkillRadar skills={skills} />
        </div>

      </div>

      {/* Task & Submission Tracker Row */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Target size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-wider">Milestone Submissions</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Courses/Tracks Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase tracking-widest text-sm opacity-80">Choose Your Training Track</h2>
          <div className="h-px flex-1 bg-slate-800 mx-6"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
      </>
      ) : activeTab === 'leaderboard' ? (
        <LeaderboardTab currentUserId={user?.id} />
      ) : (
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
                      navigator.clipboard.writeText(user.referralCode);
                      alert('Referral Code copied to clipboard!');
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
                      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referralCode}`);
                      alert('Invite Link copied to clipboard!');
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
      )}
    </div>
  );
};

export default Dashboard;
