import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, CheckCircle2, TrendingUp, Zap, Target, Star, ShieldAlert } from 'lucide-react';
import { coursesConfig } from '../config/courses';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to extract course specific stats
  const getCourseProgress = (courseId: string) => {
    if (!user || !user.progresses) return { progress: 0, completed: false };
    const p = user.progresses.find((item: any) => item.courseId === courseId);
    return p ? { progress: p.progress, completed: p.completed } : { progress: 0, completed: false };
  };

  const getBestGrade = (courseId: string) => {
    if (!user || !user.results) return null;
    const passingResults = user.results.filter((r: any) => r.courseId === courseId && r.passed);
    if (passingResults.length === 0) return null;
    const best = passingResults.reduce((prev: any, current: any) => (prev.accuracy > current.accuracy) ? prev : current);
    return best.grade;
  };

  // Aggregated metrics
  const activeTracksCount = user?.progresses?.filter((p: any) => p.progress > 0 && p.progress < 100).length || 0;
  const completedTracksCount = user?.progresses?.filter((p: any) => p.progress === 100).length || 0;
  const highestAccuracy = user?.results?.length > 0 ? Math.max(...user.results.map((r: any) => r.accuracy)) : 0;

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const activeTracks = user?.progresses?.filter((p: any) => p.progress > 0 && p.progress < 100) || [];
  const latestProgressInfo = activeTracks.length > 0 ? activeTracks[0] : null;
  const latestActiveCourse = latestProgressInfo ? {
    id: latestProgressInfo.courseId,
    progress: latestProgressInfo.progress,
    title: coursesConfig.find(c => c.id === latestProgressInfo.courseId)?.titleShort || "Specialized Track"
  } : null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="py-8 space-y-10 max-w-7xl mx-auto px-4"
    >
      
      {/* Welcome Heading & Profile Details */}
      <motion.div variants={itemVariants as any} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="space-y-1.5">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Welcome to your next-generation academic console. Master deep technical tracks and earn accuracy-based certifications.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-bold items-center">
          <span className="px-4 py-2 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-300 shadow-sm flex items-center gap-2">
            <span className="text-blue-400">🏢</span> {user?.collegeName || 'Government Polytechnic'}
          </span>
          <span className="px-4 py-2 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-slate-300 shadow-sm flex items-center gap-2">
            <span className="text-emerald-400">⚙</span> {user?.branchName || 'ECE'}
          </span>
        </div>
      </motion.div>

      {/* Staff Privileges Banner */}
      {user?.role === 'ADMIN' && (
        <motion.div variants={itemVariants as any} className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold shadow-lg shadow-red-950/20">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} />
            <span>STAFF PRIVILEGES ACTIVE: You have complete administrative privileges over course contents, transactions, and quizzes.</span>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg transition-all active:scale-[0.98] uppercase tracking-wider text-[10px]"
          >
            Open CMS Editor Panel
          </button>
        </motion.div>
      )}

      {/* Analytics Metric Cards Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Active Tracks", value: activeTracksCount, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
          { title: "Completed Tracks", value: completedTracksCount, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { title: "Highest Accuracy", value: `${highestAccuracy}%`, icon: Target, color: "text-purple-400", bg: "bg-purple-500/10" },
          { title: "Certificates", value: completedTracksCount, icon: Award, color: "text-amber-400", bg: "bg-amber-500/10" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants as any} 
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-5 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl flex items-center gap-4 shadow-xl shadow-black/20"
          >
            <div className={`p-4 ${stat.bg} rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Dynamic Mid-Section */}
      <motion.div variants={itemVariants as any} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Resume Card */}
        <div className="lg:col-span-2 p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
              <Zap size={14} className="animate-pulse text-amber-400" />
              Your Next Objective
            </div>
            
            {latestActiveCourse ? (
              <div className="space-y-3">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{latestActiveCourse.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                  Dive deep into the curriculum. Complete all modules to unlock the final comprehensive exam and earn your certification.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `\${latestActiveCourse.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full relative overflow-hidden" 
                    >
                      <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', backgroundSize: '200% 100%' }}></div>
                    </motion.div>
                  </div>
                  <span className="text-xs font-black text-blue-400 font-mono shrink-0 bg-blue-500/10 px-3 py-1 rounded-lg">{latestActiveCourse.progress}%</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-3xl font-extrabold text-white tracking-tight">Begin Your Training</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                  Choose an engineering track below. Study the deep industrial curriculum and ace the final exam to claim your accredited credentials.
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-6 mt-6 border-t border-slate-700/50 flex justify-end relative z-10">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(latestActiveCourse ? `/course/\${latestActiveCourse.id}` : `/course/C`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
            >
              {latestActiveCourse ? "Resume Training" : "Explore Tracks"} <TrendingUp size={16} />
            </motion.button>
          </div>
        </div>

        {/* Right Column: Guidelines */}
        <div className="p-8 bg-slate-800/50 backdrop-blur-md border border-slate-700/80 rounded-3xl space-y-5 shadow-2xl">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
            <Star className="text-amber-400" size={20} />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200">New Grading System</h3>
          </div>
          
          <ul className="text-slate-300 text-xs space-y-4">
            <li className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <span className="text-emerald-500 shrink-0 text-lg">🎓</span>
              <div><strong className="text-white block">One Final Exam</strong> Tests your deep knowledge across the entire track.</div>
            </li>
            <li className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <span className="text-blue-500 shrink-0 text-lg">📊</span>
              <div><strong className="text-white block">Accuracy Based</strong> 60% (Good), 70% (Very Good), 80% (Excellent), 90%+ (Outstanding).</div>
            </li>
            <li className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <span className="text-amber-500 shrink-0 text-lg">🔄</span>
              <div><strong className="text-white block">Re-attempts Allowed</strong> Score below 60%? Review the deep topics and try again to improve.</div>
            </li>
          </ul>
        </div>

      </motion.div>

      {/* Courses/Tracks Grid */}
      <motion.div variants={itemVariants as any} className="space-y-8 pt-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-2 bg-blue-500 rounded-full"></div>
          <h2 className="text-3xl font-extrabold tracking-tight">Available Engineering Tracks</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coursesConfig.map((course, index) => {
            const progressInfo = getCourseProgress(course.id);
            const isCompleted = progressInfo.completed;
            const hasStarted = progressInfo.progress > 0;
            const grade = getBestGrade(course.id);

            return (
              <motion.div 
                key={course.id}
                variants={itemVariants as any}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/course/\${course.id}`)}
                className="group cursor-pointer bg-slate-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col justify-between relative"
              >
                {/* Header Block */}
                <div className={`h-36 bg-gradient-to-br \${course.colorDark} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <course.icon size={56} className="text-white drop-shadow-xl relative z-10" />
                  </motion.div>
                  
                  {/* Dynamic Status Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    {isCompleted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/90 backdrop-blur text-white text-[10px] font-black tracking-wider shadow border border-emerald-400">
                        {grade ? `\${grade}` : 'COMPLETED'}
                      </span>
                    ) : hasStarted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-blue-600/90 backdrop-blur text-white text-[10px] font-black tracking-wider shadow border border-blue-500">
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] font-black tracking-wider shadow border border-slate-700">
                        NOT STARTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl font-extrabold group-hover:text-blue-400 transition-colors tracking-tight">
                      {course.titleShort}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {course.descShort}
                    </p>
                  </div>

                  {/* Progress Ring / Bar */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                      <span>Track Mastery</span>
                      <span className={isCompleted ? 'text-emerald-400' : 'text-slate-200'}>{progressInfo.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `\${progressInfo.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full \${course.barColor}`}
                      ></motion.div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className={`flex items-center justify-between font-black text-xs \${course.textColor} pt-2`}>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {isCompleted ? 'View Results & Certificate' : hasStarted ? 'Continue Deep Dive' : 'Start Course'}
                    </span>
                    <span className="bg-slate-900/50 p-2 rounded-lg group-hover:bg-slate-700 transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default Dashboard;