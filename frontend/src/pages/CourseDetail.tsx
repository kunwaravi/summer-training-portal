import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { 
  Lock, Play, Clipboard, 
  CheckCircle2, Zap, Eye 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

import CourseHero from '../components/organisms/CourseHero';
import SyllabusManager from '../components/organisms/SyllabusManager';
import EnrollmentPanel from '../components/organisms/EnrollmentPanel';
import Spinner from '../components/atoms/Spinner';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    weeks,
    activeWeekIndex,
    setActiveWeekIndex,
    loadingSyllabus,
    loadingDetails,
    activeModuleDetail,
    isPaid,
    checkingPayment,
    currentWeek,
    setIsPaid
  } = useCourseDetail(id);

  const [hasReadMaterial, setHasReadMaterial] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<React.ReactNode | null>(null);

  const handleCopyCode = (code: string, topicIndex: number) => {
    navigator.clipboard.writeText(code);
    setCopiedText(`${topicIndex}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const selectedWeek = weeks[activeWeekIndex];

  // Concept Infographic Blueprint Renderer (Issue #13)
  const renderWeeklyDiagram = (courseKey: string, weekNum: number) => {
    const strokeColor = "#22d3ee"; // cyan-400
    const accentColor = "#3b82f6"; // blue-500
    const textTheme = "fill-slate-300 font-sans text-[11px] font-bold text-center";
    
    // C Programming Track SVG Blueprints
    if (courseKey === "C") {
      if (weekNum === 1) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <rect x="10" y="10" width="80" height="30" rx="6" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="50" y="28" textAnchor="middle" className={textTheme}>Source (.c)</text>
            <path d="M 50 40 L 50 65" stroke={strokeColor} strokeWidth="1.5" markerEnd="url(#arrow)" />
            <rect x="10" y="65" width="80" height="30" rx="6" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="50" y="83" textAnchor="middle" className={textTheme}>Compiler</text>
            <path d="M 90 80 L 140 80" stroke={strokeColor} strokeWidth="1.5" />
            <text x="115" y="73" textAnchor="middle" className="fill-cyan-400 text-[9px] font-extrabold">Assembly</text>
            <rect x="140" y="65" width="80" height="30" rx="6" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="180" y="83" textAnchor="middle" className={textTheme}>Linker</text>
            <path d="M 180 95 L 180 120" stroke={strokeColor} strokeWidth="1.5" />
            <rect x="140" y="120" width="80" height="35" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="180" y="141" textAnchor="middle" className="fill-emerald-400 font-sans text-xs font-black">Binary (.exe)</text>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeColor} />
              </marker>
            </defs>
          </svg>
        );
      }
      if (weekNum === 2) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <polygon points="160,20 240,60 160,100 80,60" fill="#1e293b" stroke={accentColor} strokeWidth="1.5" />
            <text x="160" y="64" textAnchor="middle" className={textTheme}>if (Score &gt;= 60)</text>
            <path d="M 240 60 L 270 60 L 270 120" stroke="#10b981" strokeWidth="1.5" />
            <text x="285" y="85" textAnchor="middle" className="fill-emerald-400 text-[10px] font-black">TRUE</text>
            <rect x="230" y="120" width="80" height="30" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="1" />
            <text x="270" y="138" textAnchor="middle" className="fill-white text-[9px] font-black">PASS EXAM</text>
            <path d="M 80 60 L 50 60 L 50 120" stroke="#ef4444" strokeWidth="1.5" />
            <text x="35" y="85" textAnchor="middle" className="fill-red-400 text-[10px] font-black">FALSE</text>
            <rect x="10" y="120" width="80" height="30" rx="6" fill="#991b1b" stroke="#ef4444" strokeWidth="1" />
            <text x="50" y="138" textAnchor="middle" className="fill-white text-[9px] font-black">FAIL RETRY</text>
          </svg>
        );
      }
      if (weekNum === 3) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <g transform="translate(10, 50)">
              <rect x="0" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="25" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">10</text>
              <text x="25" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 0</text>
              <rect x="50" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="75" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">20</text>
              <text x="75" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 1</text>
              <rect x="100" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="125" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">30</text>
              <text x="125" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 2</text>
              <rect x="150" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
              <text x="175" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">40</text>
              <text x="175" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[9px]">Idx 3</text>
            </g>
            <text x="110" y="30" textAnchor="middle" className="fill-cyan-400 text-xs font-black">Contiguous Array Layout</text>
          </svg>
        );
      }
      if (weekNum === 4) {
        return (
          <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
            <rect x="20" y="50" width="80" height="40" rx="6" fill="#1e293b" stroke={strokeColor} strokeWidth="1.5" />
            <text x="60" y="70" textAnchor="middle" className="fill-cyan-400 font-mono text-xs font-extrabold">int *ptr</text>
            <text x="60" y="82" textAnchor="middle" className="fill-slate-500 font-mono text-[8px]">Holds: 0x7FFA</text>
            <path d="M 100 70 L 180 70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#goldArrow)" />
            <text x="140" y="60" textAnchor="middle" className="fill-amber-400 text-[8px] font-bold">Points To</text>
            <rect x="190" y="50" width="100" height="45" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
            <text x="240" y="72" textAnchor="middle" className="fill-emerald-400 font-mono text-sm font-black">100</text>
            <text x="240" y="86" textAnchor="middle" className="fill-slate-400 font-mono text-[8px]">Address: 0x7FFA</text>
            <defs>
              <marker id="goldArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
            </defs>
          </svg>
        );
      }
    }
    
    return (
      <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
        <circle cx="60" cy="100" r="30" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
        <text x="60" y="104" textAnchor="middle" className="fill-white text-[9px] font-black">{courseKey} Micro</text>
        <path d="M 90 100 L 150 100" stroke={strokeColor} strokeWidth="2" />
        <rect x="150" y="75" width="80" height="50" rx="8" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
        <text x="190" y="104" textAnchor="middle" className="fill-cyan-400 text-[10px] font-bold">Registers</text>
        <path d="M 230 100 L 280 100" stroke={strokeColor} strokeWidth="2" />
        <circle cx="290" cy="100" r="10" fill="#10b981" />
        <text x="190" y="50" textAnchor="middle" className="fill-amber-400 text-[9px] font-black">Chapter {weekNum} Concept</text>
      </svg>
    );
  };

  if (loadingSyllabus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Spinner size="lg" />
        <p className="text-slate-400 text-sm font-semibold">Decrypting curriculum syllabus registry...</p>
      </div>
    );
  }

  const completedPercentage = weeks.length > 0 ? Math.min(Math.round(((currentWeek) / weeks.length) * 100), 100) : 0;
  const wordCount = selectedWeek?.description?.split(/\s+/).length + (activeModuleDetail?.topics?.reduce((acc: number, t: any) => acc + (t.text?.split(/\s+/).length || 0), 0) || 0);
  const readingTime = Math.max(Math.ceil(wordCount / 180), 1);

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 space-y-6">
      
      <CourseHero courseId={id} />

      {/* Main Split-Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        <SyllabusManager 
          weeks={weeks}
          activeWeekIndex={activeWeekIndex}
          setActiveWeekIndex={setActiveWeekIndex}
          currentWeek={currentWeek}
          completedPercentage={completedPercentage}
          onWeekChange={() => setHasReadMaterial(false)}
        />

        {/* Right Column: Dynamic E-Learning Viewer Console */}
        <div className="flex-1 w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 overflow-hidden">
          
          {loadingDetails ? (
            <div className="space-y-6 animate-pulse py-4">
              <div className="flex gap-2">
                <div className="h-6 w-32 bg-slate-800 rounded"></div>
                <div className="h-6 w-20 bg-slate-800 rounded"></div>
              </div>
              <div className="h-8 w-2/3 bg-slate-800 rounded"></div>
              <div className="h-4 w-full bg-slate-800 rounded"></div>
              <div className="space-y-6 pt-10 border-t border-slate-850">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3 pl-8 relative">
                    <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-slate-800"></div>
                    <div className="h-6 w-40 bg-slate-800 rounded"></div>
                    <div className="h-4 w-full bg-slate-800 rounded"></div>
                    <div className="h-24 w-full bg-slate-850 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWeekIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Header block */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
                      Chapter {selectedWeek.week} Study Material
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                      ⏱ {readingTime} Min Read
                    </div>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white">{selectedWeek.title}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedWeek.description}</p>
                </div>

                {/* Curriculum Topics List */}
                <div className="space-y-8 pt-4 border-t border-slate-800/80">
                  {activeModuleDetail?.topics?.map((topic: any, idx: number) => (
                    <div key={idx} className="space-y-3.5 group">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-200 tracking-tight group-hover:text-white transition">
                          {topic.title}
                        </h3>
                      </div>
                      <div className="pl-8 prose prose-invert prose-sm max-w-none text-slate-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {topic.text}
                        </ReactMarkdown>
                      </div>
                      {topic.code && (
                        <div className="ml-0 sm:ml-8 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 relative group/code shadow-inner">
                          <button
                            onClick={() => handleCopyCode(topic.code, idx)}
                            className="absolute right-3 top-3 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5 opacity-0 group-hover/code:opacity-100 focus:opacity-100"
                          >
                            <Clipboard size={14} />
                            {copiedText === `${idx}` ? 'Copied!' : 'Copy'}
                          </button>
                          <div className="overflow-x-auto w-full">
                            <pre className="p-4 text-xs font-mono text-cyan-400 leading-relaxed min-w-[300px]">
                              <code>{topic.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                      {topic.note && (
                        <div className="ml-0 sm:ml-8 p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-300 text-xs leading-relaxed flex items-start gap-3">
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

                {/* Concept Visualized Blueprint */}
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 ml-0 sm:ml-8">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Zap size={18} className="animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest">Concept Visualized Blueprint</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2 text-slate-350 text-xs leading-relaxed">
                      <p className="font-bold text-slate-200">Interactive Blueprint Visualization</p>
                      <p>Study this visual schematic representation of the concepts introduced this week.</p>
                      <button 
                        onClick={() => setLightboxImage(renderWeeklyDiagram(id as string, selectedWeek.week))}
                        className="flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-400 hover:text-white font-extrabold uppercase rounded text-[9px] border border-slate-700/60 transition"
                      >
                        <Eye size={12} /> Click Diagram to Expand
                      </button>
                    </div>
                    <div 
                      onClick={() => setLightboxImage(renderWeeklyDiagram(id as string, selectedWeek.week))}
                      className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/80 hover:bg-slate-950/20 transition duration-300 cursor-pointer flex justify-center items-center group shadow-md"
                    >
                      <div className="transform group-hover:scale-[1.02] transition duration-300 w-full max-w-[280px]">
                        {renderWeeklyDiagram(id as string, selectedWeek.week)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Module Verification */}
                <div className="mt-10 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Module Verification</h4>
                  {activeWeekIndex < currentWeek ? (
                    <div className="flex items-center gap-3 text-emerald-400">
                      <CheckCircle2 size={24} />
                      <div>
                        <p className="text-sm font-bold">Chapter {selectedWeek.week} Completed!</p>
                        <p className="text-xs text-slate-400">You passed the quiz. Re-take it to improve your score.</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/quiz/${id}/${selectedWeek.week}`)}
                        className="ml-auto text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-slate-300 font-semibold transition"
                      >
                        Retry Quiz
                      </button>
                    </div>
                  ) : activeWeekIndex === currentWeek ? (
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer group text-xs text-slate-400 select-none">
                        <input 
                          type="checkbox"
                          checked={hasReadMaterial}
                          onChange={(e) => setHasReadMaterial(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-cyan-600 rounded bg-slate-800 border-slate-700"
                        />
                        <span className="group-hover:text-slate-200 transition">
                          I have read and understood all the study concepts for Chapter {selectedWeek.week}. I am ready to attempt the quiz.
                        </span>
                      </label>
                      <button 
                        disabled={!hasReadMaterial}
                        onClick={() => navigate(`/quiz/${id}/${selectedWeek.week}`)}
                        className={`w-full py-3 rounded-xl font-extrabold text-sm transition flex items-center justify-center gap-2 text-white shadow-lg ${
                          hasReadMaterial ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Play size={16} /> Unlock & Start Chapter {selectedWeek.week} Quiz
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                      <Lock size={18} />
                      <span>Complete Chapter {currentWeek + 1} quiz to unlock these materials.</span>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-800/80 mt-10">
                  <button
                    disabled={activeWeekIndex === 0}
                    onClick={() => setActiveWeekIndex(activeWeekIndex - 1)}
                    className="px-4 py-2.5 rounded-xl border text-[11px] font-extrabold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ← Prev Module
                  </button>
                  <button
                    disabled={activeWeekIndex >= Math.min(currentWeek, weeks.length - 1)}
                    onClick={() => setActiveWeekIndex(activeWeekIndex + 1)}
                    className="px-4 py-2.5 rounded-xl border text-[11px] font-extrabold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next Module →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {(currentWeek >= weeks.length || new URLSearchParams(window.location.search).get('pay_debug') === 'true') && !checkingPayment && (
        <EnrollmentPanel 
          courseId={id}
          user={user}
          isPaid={isPaid}
          onPaymentSuccess={() => setIsPaid(true)}
          navigate={navigate}
        />
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950/70 border border-slate-800 p-8 rounded-2xl w-full max-w-2xl relative flex flex-col items-center"
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute right-4 top-4 text-xs font-bold text-slate-500 hover:text-white"
              >
                Close ✕
              </button>
              <div className="w-full flex justify-center">{lightboxImage}</div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4">
                Interactive Technical Blueprint - Concept Visualized
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseDetail;
