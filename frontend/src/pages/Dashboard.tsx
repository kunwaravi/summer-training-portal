import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { Cpu, Code, Wifi, Box, BookOpen, Award, CheckCircle2, TrendingUp, Zap, Target } from 'lucide-react';
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
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard'>('overview');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: coursesData, loading } = useCourses();

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
    { label: 'System Design', value: Math.min(totalQuizzesPassed * 5, 100) || 10, color: '#06b6d4' },
  ];

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const streakDays = totalQuizzesPassed > 0 ? (totalQuizzesPassed * 2 + 1) : activeTracksCount > 0 ? 1 : 0;

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
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Achievements:</span>
              {user.badges.map((b: string) => {
                const meta: Record<string, string> = {
                  perfect_score: '💯 Perfect Score',
                  week_1_master: '🎓 Week 1 Master',
                  bug_hunter: '🐛 Bug Hunter'
                };
                return (
                  <span key={b} className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-black uppercase tracking-wider text-slate-300">
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
          className={`pb-4 font-black uppercase tracking-widest text-[10px] sm:text-xs transition-colors relative ${
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
          className={`pb-4 font-black uppercase tracking-widest text-[10px] sm:text-xs transition-colors relative ${
            activeTab === 'leaderboard' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-350'
          }`}
        >
          Leaderboard
          {activeTab === 'leaderboard' && (
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
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Mid-Section: Quick Resume & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Quick Resume Card */}
        <div className="lg:col-span-2 p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
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
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
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
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Industrial Skill Matrix</h3>
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
      ) : (
        <LeaderboardTab currentUserId={user?.id} />
      )}
    </div>
  );
};

export default Dashboard;
