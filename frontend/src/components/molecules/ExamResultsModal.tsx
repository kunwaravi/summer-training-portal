import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, RotateCcw, Award, Lock, ArrowLeft } from 'lucide-react';

/**
 * Exam Results Modal (issue #76) — freeCodeCamp-style exam-results-modal.
 * Shown right after exam submission: animated score ring, pass/fail badge,
 * per-section breakdown (grouped by topic when available), and
 * certificate / retry actions using the #67 grade logic.
 */

interface ExamResultsModalProps {
  open: boolean;
  onClose: () => void;
  passed: boolean;
  score: number;
  passingScore?: number;
  courseId: string;
  breakdown: any[];
  courseCompleted: boolean;
  onRetry: () => void;
  onViewCertificate: () => void;
  onReturn: () => void;
}

const ExamResultsModal: React.FC<ExamResultsModalProps> = ({
  open,
  onClose,
  passed,
  score,
  passingScore = 60,
  courseId,
  breakdown,
  courseCompleted,
  onRetry,
  onViewCertificate,
  onReturn,
}) => {
  // Group per-question review by topic for a per-section breakdown
  const sections = useMemo(() => {
    const groups: Record<string, any[]> = {};
    (breakdown || []).forEach((item) => {
      const key = item.topicTitle || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return Object.entries(groups).map(([title, items]) => ({
      title,
      items,
      correct: items.filter((i) => i.isCorrect).length,
      total: items.length,
    }));
  }, [breakdown]);

  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black no-print"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
          >
            <div className="w-full max-w-lg max-h-[88vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Exam Results · {courseId}
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Score ring + pass/fail badge */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r={radius} fill="none" stroke="#1e293b" strokeWidth="9" />
                      <motion.circle
                        cx="64" cy="64" r={radius} fill="none"
                        stroke={passed ? '#10b981' : '#ef4444'}
                        strokeWidth="9" strokeLinecap="round"
                        initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (Math.min(score, 100) / 100) * circumference }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'}`}>{score}%</span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Pass: {passingScore}%</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.4 }}
                    className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-black uppercase tracking-widest text-xs ${
                      passed
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/15 border-red-500/40 text-red-300'
                    }`}
                  >
                    {passed ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {passed ? 'Passed' : 'Failed'}
                  </motion.div>

                  <p className="text-xs text-slate-500 mt-3 leading-relaxed max-w-sm">
                    {passed
                      ? courseCompleted
                        ? 'Outstanding! Your course is complete — your certificate is ready.'
                        : 'Great job! Keep completing the remaining weeks to unlock your certificate.'
                      : `You scored below the ${passingScore}% passing threshold. Review the material and try again.`}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  {passed && courseCompleted && (
                    <button
                      onClick={onViewCertificate}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition text-sm"
                    >
                      <Award size={16} /> View Certificate
                    </button>
                  )}
                  {passed && !courseCompleted && (
                    <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[11px] font-black uppercase tracking-widest">
                      <Lock size={13} /> Certificate Locked · Complete all weeks
                    </span>
                  )}
                  {!passed && (
                    <button
                      onClick={onRetry}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transition text-sm"
                    >
                      <RotateCcw size={16} /> Retry Exam
                    </button>
                  )}
                  <button
                    onClick={onReturn}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl font-bold transition text-sm text-slate-300"
                  >
                    <ArrowLeft size={16} /> Return to Course
                  </button>
                </div>

                {/* Per-section breakdown */}
                {sections.length > 0 && (
                  <div className="mt-7 space-y-3">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Section Breakdown</h4>
                    {sections.map((section) => (
                      <div key={section.title} className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                        <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800/70">
                          <span className="text-xs font-bold text-slate-200">{section.title}</span>
                          <span className={`text-[11px] font-black ${section.correct === section.total ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {section.correct}/{section.total} correct
                          </span>
                        </div>
                        <div className="p-3 space-y-2">
                          {section.items.map((item: any, i: number) => (
                            <div key={item.questionId ?? i} className="flex items-start gap-2.5">
                              {item.isCorrect ? (
                                <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] text-slate-300 font-semibold leading-snug">{item.text}</p>
                                {!item.isCorrect && (
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    Your answer: <span className="text-red-400 font-bold">{item.userAnswer || '—'}</span> · Correct: <span className="text-emerald-400 font-bold">{item.correctAnswer}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExamResultsModal;
