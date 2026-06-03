import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../hooks/useCourses';
import { Cpu, Code, Wifi, Box, BookOpen, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import CourseCard from '../components/molecules/CourseCard';
import Spinner from '../components/atoms/Spinner';

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

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const streakDays = totalQuizzesPassed > 0 ? (totalQuizzesPassed * 2 + 1) : activeTracksCount > 0 ? 1 : 0;

  const hasWeek1 = user?.progresses?.some((p: any) => p.weekCompleted >= 1) || false;
  const hasWeek2 = user?.progresses?.some((p: any) => p.weekCompleted >= 2) || false;
  const hasWeek3 = user?.progresses?.some((p: any) => p.weekCompleted >= 3) || false;
  const hasCompleted = user?.progresses?.some((p: any) => p.completed) || false;

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
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-bold items-center">
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center gap-1.5 shadow-sm">
            🔥 {streakDays}-Day Learn Streak
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            🏢 {user?.collegeName || 'Government Polytechnic'}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            ⚙ {user?.branchName || 'ECE'}
          </span>
        </div>
      </div>

      {/* Staff Privileges Banner */}
      {user?.role === 'ADMIN' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold shadow-lg shadow-red-950/20">
          <div className="flex items-center gap-2">
            <span className="text-sm">🛡</span>
            <span>STAFF PRIVILEGES ACTIVE: You have complete administrative privileges over course contents, transactions, and quizzes.</span>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg transition-all active:scale-[0.98] uppercase tracking-wider text-[10px]"
          >
            Open CMS Editor Panel
          </button>
        </div>
      )}

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

      {/* Dynamic Mid-Section: Quick Resume & Milestone Badges */}
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
                  You are currently on Week {latestActiveCourse.weekCompleted + 1} module. Resume your studies and clear the weekly assessment to proceed!
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
                  Choose a specialized engineering track below, study the industrial-focused weekly curriculum, and claim your accredited certifications!
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

        {/* Right Column (1/3 width): Gamified Badges Panel */}
        <div className="p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl space-y-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-4">Milestone Badges</h3>
          
          <div className="grid grid-cols-2 gap-4 pt-1">
            {[
              { emoji: '🚀', label: 'First Step', sub: 'Passed W1', active: hasWeek1, color: 'blue' },
              { emoji: '🎯', label: 'Quiz Ace', sub: 'Passed W2', active: hasWeek2, color: 'purple' },
              { emoji: '🛡', label: 'Specialist', sub: 'Passed W3', active: hasWeek3, color: 'orange' },
              { emoji: '🎓', label: 'Graduate', sub: 'Certified', active: hasCompleted, color: 'emerald' },
            ].map((badge, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-300 ${
                badge.active 
                  ? `bg-${badge.color}-500/5 border-${badge.color}-500/20 text-amber-400 shadow-sm` 
                  : 'bg-slate-950/20 border-slate-800 text-slate-600 opacity-60'
              }`}>
                <span className={`text-3xl mb-2 filter ${badge.active ? 'drop-shadow-lg' : 'grayscale opacity-40'}`}>{badge.emoji}</span>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-200">{badge.label}</h4>
                <p className={`text-[8px] mt-1 font-black uppercase tracking-tighter ${badge.active ? 'text-amber-500/80' : 'text-slate-600'}`}>
                  {badge.active ? badge.sub : "Locked"}
                </p>
              </div>
            ))}
          </div>
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

      {/* Training Guidelines */}
      <div className="p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <CheckCircle2 size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Training Guidelines</h2>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {[
            "The training is structured into 4 weeks per course.",
            "Each week has dedicated study material that must be reviewed before unlocking quizzes.",
            "A quiz is mandatory at the end of each week to unlock the next. You need at least 60% in each quiz to pass.",
            "Progress is tracked separately for all tracks, allowing you to study multiple tracks simultaneously!",
            "Complete all 4 weeks of any track to generate and print your official certified certificate.",
            "Quizzes can be retaken if you don't pass on your first attempt."
          ].map((text, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-400 text-xs leading-relaxed">
              <span className="text-blue-500 font-bold">0{idx + 1}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
