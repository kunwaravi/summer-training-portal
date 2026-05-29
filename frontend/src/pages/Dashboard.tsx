import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, Code, Wifi, Box, BookOpen, Award, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const courses = [
  { 
    id: 'C', 
    title: 'C Language', 
    icon: <Code />, 
    color: 'from-blue-500 to-blue-700', 
    textColor: 'text-blue-400',
    barColor: 'bg-blue-500', 
    desc: 'Master procedural programming, memory maps, and hardware structure compilations.' 
  },
  { 
    id: 'C++', 
    title: 'C++ Language', 
    icon: <Box />, 
    color: 'from-purple-500 to-purple-700', 
    textColor: 'text-purple-400',
    barColor: 'bg-purple-500', 
    desc: 'Implement high-performance object-oriented software design, templates, and STL.' 
  },
  { 
    id: 'IoT', 
    title: 'IoT (Internet of Things)', 
    icon: <Wifi />, 
    color: 'from-green-500 to-green-700', 
    textColor: 'text-green-400',
    barColor: 'bg-green-500', 
    desc: 'Connect physical systems with ESP microcontrollers, MQTT protocols, and cloud services.' 
  },
  { 
    id: 'Embedded', 
    title: 'Embedded Systems', 
    icon: <Cpu />, 
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

  return (
    <div className="py-8 space-y-10 max-w-7xl mx-auto px-4">
      
      {/* Welcome Heading & Profile Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Academic Console</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome, <span className="text-white font-semibold">{user?.name}</span>. Manage your industrial learning tracks below.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            🏢 {user?.collegeName || 'Government Polytechnic'}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            ⚙ {user?.branchName || 'ECE'}
          </span>
        </div>
      </div>

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
                  {React.cloneElement(course.icon as React.ReactElement, { size: 48, className: "text-white drop-shadow-md" })}
                  
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
