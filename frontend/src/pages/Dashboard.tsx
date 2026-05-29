import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Code, Wifi, Box, BookOpen, Award, CheckCircle2, TrendingUp } from 'lucide-react';

const courses = [
  { 
    id: 'C', 
    title: 'C Language', 
    icon: Code, 
    color: 'from-blue-500 to-blue-700', 
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500', 
    desc: 'Master procedural programming, memory maps, and hardware structure compilations.' 
  },
  { 
    id: 'C++', 
    title: 'C++ Language', 
    icon: Box, 
    color: 'from-purple-500 to-purple-700', 
    textColor: 'text-purple-400',
    barColor: 'bg-purple-500', 
    desc: 'Implement high-performance object-oriented software design, templates, and STL.' 
  },
  { 
    id: 'IoT', 
    title: 'IoT (Internet of Things)', 
    icon: Wifi, 
    color: 'from-green-500 to-green-700', 
    textColor: 'text-green-400',
    barColor: 'bg-green-500', 
    desc: 'Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services.' 
  },
  { 
    id: 'Embedded', 
    title: 'Embedded Systems', 
    icon: Cpu, 
    color: 'from-orange-500 to-orange-750', 
    textColor: 'text-orange-400',
    barColor: 'bg-orange-500', 
    desc: 'Architect microcontroller interfaces, serial communication buses, and RTOS kernels.' 
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    title: courses.find(c => c.id === latestProgressInfo.courseId)?.title || "Specialized Track"
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
        <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Tracks</p>
            <h3 className="text-2xl font-bold">{activeTracksCount}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed Tracks</p>
            <h3 className="text-2xl font-bold">{completedTracksCount}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Quizzes Passed</p>
            <h3 className="text-2xl font-bold">{totalQuizzesPassed}</h3>
          </div>
        </div>

        <div className="p-5 bg-slate-800 border border-slate-700 rounded-xl flex items-center gap-4 shadow-md">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Award size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Certificates Earned</p>
            <h3 className="text-2xl font-bold">{completedTracksCount}</h3>
          </div>
        </div>
      </div>

      {/* Dynamic Mid-Section: Quick Resume & Milestone Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Quick Resume Card */}
        <div className="lg:col-span-2 p-6 bg-slate-800 border border-slate-700/80 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-md">
          {/* Faint blue ambient glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Pick Up Where You Left Off
            </div>
            
            {latestActiveCourse ? (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{latestActiveCourse.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                  You are currently on Week {latestActiveCourse.weekCompleted + 1} module. Resume your studies and clear the weekly assessment to proceed!
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden p-[0.5px]">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${latestActiveCourse.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-355 font-mono shrink-0">{latestActiveCourse.progress}% Completed</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Ready to start your journey?</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                  Choose a specialized engineering track below, study the industrial-focused weekly curriculum, and claim your accredited certifications!
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-4 mt-4 border-t border-slate-700/50 flex justify-end">
            <button 
              onClick={() => navigate(latestActiveCourse ? `/course/${latestActiveCourse.id}` : `/course/C`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow active:scale-95 flex items-center gap-1"
            >
              {latestActiveCourse ? "Resume Course →" : "Get Started →"}
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width): Gamified Badges Panel */}
        <div className="p-6 bg-slate-800 border border-slate-700/80 rounded-2xl space-y-4 shadow-md">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-350 pl-0.5 border-b border-slate-750 pb-2">Milestone Badges</h3>
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              hasWeek1 
                ? 'bg-blue-500/5 border-blue-500/30 text-amber-400 shadow-md shadow-blue-500/5' 
                : 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-60'
            }`}>
              <span className={`text-2xl mb-1 filter ${hasWeek1 ? 'drop-shadow-md' : 'grayscale'}`}>🚀</span>
              <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-200">First Step</h4>
              <p className="text-[8px] text-slate-500 mt-0.5 font-bold uppercase tracking-tight">{hasWeek1 ? "Passed W1" : "Lock"}</p>
            </div>

            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              hasWeek2 
                ? 'bg-purple-500/5 border-purple-500/30 text-amber-400 shadow-md shadow-purple-500/5' 
                : 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-60'
            }`}>
              <span className={`text-2xl mb-1 filter ${hasWeek2 ? 'drop-shadow-md' : 'grayscale'}`}>🎯</span>
              <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-200">Quiz Ace</h4>
              <p className="text-[8px] text-slate-500 mt-0.5 font-bold uppercase tracking-tight">{hasWeek2 ? "Passed W2" : "Lock"}</p>
            </div>

            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              hasWeek3 
                ? 'bg-orange-500/5 border-orange-500/30 text-amber-400 shadow-md shadow-orange-500/5' 
                : 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-60'
            }`}>
              <span className={`text-2xl mb-1 filter ${hasWeek3 ? 'drop-shadow-md' : 'grayscale'}`}>🛡</span>
              <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-200">Specialist</h4>
              <p className="text-[8px] text-slate-500 mt-0.5 font-bold uppercase tracking-tight">{hasWeek3 ? "Passed W3" : "Lock"}</p>
            </div>

            <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
              hasCompleted 
                ? 'bg-emerald-500/5 border-emerald-500/30 text-amber-400 shadow-md shadow-emerald-500/5' 
                : 'bg-slate-950/20 border-slate-900 text-slate-600 opacity-60'
            }`}>
              <span className={`text-2xl mb-1 filter ${hasCompleted ? 'drop-shadow-md' : 'grayscale'}`}>🎓</span>
              <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-200">Graduate</h4>
              <p className="text-[8px] text-slate-500 mt-0.5 font-bold uppercase tracking-tight">{hasCompleted ? "Certified" : "Lock"}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Courses/Tracks Grid (Using original colorful two-toned layout) */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Choose Your Training Track</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            const progressInfo = getCourseProgress(course.id);
            const isCompleted = progressInfo.completed;
            const hasStarted = progressInfo.progress > 0;

            return (
              <div 
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="group cursor-pointer bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all transform hover:-translate-y-2 shadow-lg flex flex-col justify-between"
              >
                {/* Top Half: Original Colorful Gradient Header Block */}
                <div className={`h-32 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}>
                  <course.icon size={48} className="text-white drop-shadow-md" />
                  
                  {/* Dynamic Status Badge overlay */}
                  <div className="absolute top-3 right-3">
                    {isCompleted ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black tracking-wider shadow">
                        Completed
                      </span>
                    ) : hasStarted ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-wider shadow">
                        Week {progressInfo.weekCompleted}/4
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/60 text-slate-200 text-[10px] font-black tracking-wider shadow">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Half: Detailed Course Content & Re-designed Progress Bars */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold group-hover:text-blue-400 transition tracking-tight">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {course.desc}
                    </p>
                  </div>

                  {/* Course Progress Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-700/60">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                      <span>Progress</span>
                      <span className="text-slate-200">{progressInfo.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${course.barColor} transition-all duration-700`}
                        style={{ width: `${progressInfo.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Navigation Callout */}
                  <div className={`flex items-center font-bold text-xs ${course.textColor} pt-1 group-hover:translate-x-1 transition-transform`}>
                    {isCompleted ? 'View Certificate' : hasStarted ? 'Resume Training' : 'Start Training'} →
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guidelines Accordion Info Panel */}
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-2xl relative overflow-hidden shadow-md">
        <h2 className="text-xl font-bold mb-4 tracking-tight">Training Guidelines</h2>
        <ul className="text-slate-400 text-sm space-y-3 pl-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 shrink-0">✔</span>
            <span>The training is structured into 4 weeks per course.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 shrink-0">✔</span>
            <span>Each week has dedicated study material that must be reviewed before unlocking quizzes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 shrink-0">✔</span>
            <span>A quiz is mandatory at the end of each week to unlock the next. You need at least <strong>60%</strong> in each quiz to pass.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 shrink-0">✔</span>
            <span>Progress is tracked separately for C, C++, IoT, and Embedded tracks, allowing you to study multiple tracks simultaneously!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 shrink-0">✔</span>
            <span>Complete all 4 weeks of any track to generate and print your official certified certificate.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
