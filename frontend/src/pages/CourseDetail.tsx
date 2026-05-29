import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Lock, BookOpen, Play, ArrowLeft, Clipboard, CheckCircle2, ChevronRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CourseDetail = () => {
  const { id } = useParams(); // Course ID: e.g., 'C', 'C++', 'IoT', 'Embedded'
  const [weeks, setWeeks] = useState<any[]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [hasReadMaterial, setHasReadMaterial] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find course-specific completed week progress from user state
  const progressInfo = user?.progresses?.find((p: any) => p.courseId === id);
  const currentWeek = progressInfo?.weekCompleted || 0; // 0 to 4

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/courses');
        const courseWeeks = res.data[id as string] || [];
        setWeeks(courseWeeks);
        
        // Default active week to their current active progress week (clamp to index 0-3)
        const activeIndex = Math.min(currentWeek, 3);
        setActiveWeekIndex(activeIndex);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
      }
    };
    fetchContent();
  }, [id, currentWeek]);

  // Reset reader checkbox when switching weeks
  useEffect(() => {
    setHasReadMaterial(false);
  }, [activeWeekIndex]);

  const handleCopyCode = (code: string, topicIndex: number) => {
    navigator.clipboard.writeText(code);
    setCopiedText(`${topicIndex}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (weeks.length === 0) {
    return <div className="text-center py-20 text-slate-400">Loading course curriculum...</div>;
  }

  const selectedWeek = weeks[activeWeekIndex];

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 space-y-6">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Back to Tracks
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-400" size={20} />
          <span className="text-xs uppercase tracking-widest text-slate-450 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
            {id} Training Track
          </span>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Weekly Modules Sidebar */}
        <div className="w-full lg:w-1/3 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
          <h2 className="text-lg font-extrabold tracking-tight px-2 pb-2 border-b border-slate-800">Weekly Modules</h2>
          
          <div className="space-y-2.5">
            {weeks.map((week, index) => {
              const isUnlocked = index <= currentWeek;
              const isCompleted = index < currentWeek;
              const isActive = index === activeWeekIndex;
              
              return (
                <button
                  key={index}
                  disabled={!isUnlocked}
                  onClick={() => setActiveWeekIndex(index)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-500/5' 
                      : isUnlocked 
                        ? 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-850 hover:border-slate-600' 
                        : 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : isUnlocked 
                          ? 'bg-slate-700/50 text-slate-400' 
                          : 'bg-slate-800 text-slate-600'
                    }`}>
                      {isCompleted ? <CheckCircle size={18} className="text-emerald-400" /> : isUnlocked ? <BookOpen size={18} /> : <Lock size={18} />}
                    </div>
                    <div>
                      <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Week {week.week}</p>
                      <h4 className="text-sm font-bold truncate max-w-[170px]">{week.title}</h4>
                    </div>
                  </div>
                  {isUnlocked && <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic E-Learning Viewer Console */}
        <div className="flex-1 w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeWeekIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Header block */}
              <div>
                <div className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded mb-2">
                  Module {selectedWeek.week} Study Material
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">{selectedWeek.title}</h2>
                <p className="text-slate-400 text-sm mt-1">{selectedWeek.description}</p>
              </div>

              {/* Curriculum Topics List */}
              <div className="space-y-8 pt-4 border-t border-slate-800/80">
                {selectedWeek.topics.map((topic: any, idx: number) => (
                  <div key={idx} className="space-y-3.5 group">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-slate-200 tracking-tight group-hover:text-white transition">
                        {topic.title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-350 text-sm leading-relaxed pl-8">
                      {topic.text}
                    </p>

                    {/* Highly aesthetic code blocks with copy features */}
                    {topic.code && (
                      <div className="ml-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 relative group/code shadow-inner">
                        <button
                          onClick={() => handleCopyCode(topic.code, idx)}
                          className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5 opacity-0 group-hover/code:opacity-100 focus:opacity-100"
                          title="Copy Code"
                        >
                          <Clipboard size={14} />
                          {copiedText === `${idx}` ? 'Copied!' : 'Copy'}
                        </button>
                        <pre className="p-4 text-xs font-mono text-cyan-400 overflow-x-auto select-all leading-relaxed">
                          <code>{topic.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Highlighted core takeaways / notes */}
                    {topic.note && (
                      <div className="ml-8 p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed flex items-start gap-3">
                        <span className="text-lg leading-none select-none">💡</span>
                        <div>
                          <strong className="text-teal-200 block mb-0.5">Core Takeaway</strong>
                          {topic.note}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Lock / Quiz Unlocking Control Console */}
              <div className="mt-10 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Module Verification</h4>
                
                {activeWeekIndex < currentWeek ? (
                  /* Module already passed */
                  <div className="flex items-center gap-3 text-emerald-400">
                    <CheckCircle2 size={24} />
                    <div>
                      <p className="text-sm font-bold">Week {selectedWeek.week} Completed successfully!</p>
                      <p className="text-xs text-slate-400">You passed the quiz for this week. You can re-take it to improve your score if desired.</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/quiz/${id}/${selectedWeek.week}`)}
                      className="ml-auto text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold transition"
                    >
                      Retry Quiz
                    </button>
                  </div>
                ) : activeWeekIndex === currentWeek ? (
                  /* Current week to learn and pass */
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-400 select-none">
                      <input 
                        type="checkbox"
                        checked={hasReadMaterial}
                        onChange={(e) => setHasReadMaterial(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded bg-slate-800 border-slate-700 focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer"
                      />
                      <span className="group-hover:text-slate-200 transition leading-tight">
                        I have read and understood all the study concepts for Week {selectedWeek.week} of this track. I am ready to attempt the quiz.
                      </span>
                    </label>

                    <button 
                      disabled={!hasReadMaterial}
                      onClick={() => navigate(`/quiz/${id}/${selectedWeek.week}`)}
                      className={`w-full py-3 rounded-xl font-extrabold text-sm transition flex items-center justify-center gap-2 text-white shadow-lg active:scale-[0.99] ${
                        hasReadMaterial
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
                      }`}
                    >
                      <Play size={16} /> Unlock & Start Week {selectedWeek.week} Quiz
                    </button>
                  </div>
                ) : (
                  /* Fully locked module */
                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                    <Lock size={18} />
                    <span>Complete Week {currentWeek + 1} quiz to unlock the subsequent learning materials.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Golden Accreditation Certificate Panel */}
      {currentWeek >= 4 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 p-8 rounded-2xl text-center relative overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-cyan-900/40 border border-yellow-500/40 shadow-xl shadow-yellow-500/5"
        >
          {/* Sparkles or decorative items */}
          <div className="absolute top-2 left-2 text-yellow-500/10 text-6xl pointer-events-none select-none font-serif">★</div>
          <div className="absolute bottom-2 right-2 text-yellow-500/10 text-6xl pointer-events-none select-none font-serif">★</div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 tracking-tight mb-2">Track Fully Accomplished! 🎓</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Congratulations! You have successfully mastered all 4 weeks of technical coursework and passed the quizzes for <strong>{id} Training Track</strong>. Your certified credentials are ready.
          </p>
          <button 
            onClick={() => navigate(`/certificate?courseId=${id}`)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            Generate Verified Certificate
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CourseDetail;
