import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

interface QuizResultsProps {
  passed: boolean;
  score: number;
  courseId: string;
  breakdown: any[];
  onReturn: () => void;
  onRetry: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  passed, 
  score, 
  courseId, 
  breakdown, 
  onReturn, 
  onRetry 
}) => {
  return (
    <div className="py-6 max-w-3xl mx-auto px-4 space-y-8">
      
      {/* Top Header Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 rounded-2xl text-center border relative overflow-hidden bg-slate-900/60 shadow-xl ${
          passed 
            ? 'border-emerald-500/30 shadow-emerald-500/5' 
            : 'border-red-500/30 shadow-red-500/5'
        }`}
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none bg-current"></div>
        
        <div className="inline-flex items-center justify-center p-4 rounded-full mb-4 bg-slate-800">
          {passed ? (
            <CheckCircle className="text-emerald-400" size={48} />
          ) : (
            <XCircle className="text-red-400" size={48} />
          )}
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight">
          {passed ? 'Module Passed! 🎉' : 'Assessment Failed ✖'}
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
          {passed 
            ? `Congratulations! You unlocked the next week training modules for ${courseId} course track.` 
            : 'You scored below the passing threshold of 60%. Please review the weekly notes and try again.'}
        </p>

        {/* Large Score Meter */}
        <div className="my-6">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Your Score</span>
          <h1 className={`text-6xl font-black ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
            {score}%
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={onReturn}
            className="px-6 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl font-bold transition text-sm flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Return to Course
          </button>
          {!passed && (
            <button 
              onClick={onRetry}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg transition text-sm"
            >
              Re-Attempt Quiz
            </button>
          )}
        </div>
      </motion.div>

      {/* Detailed Question Review Panel */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold tracking-tight px-1">Questions Review</h3>
        
        <div className="space-y-4">
          {breakdown.map((item, index) => (
            <div 
              key={index}
              className={`p-5 rounded-xl border bg-slate-900/30 ${
                item.isCorrect ? 'border-emerald-500/10' : 'border-red-500/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.isCorrect ? (
                    <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-400 shrink-0" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <p className="font-semibold text-slate-200 text-sm">
                    {index + 1}. {item.text}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900">
                      <span className="text-slate-450 block">Your Answer:</span>
                      <span className={`font-bold ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.userAnswer || '[No Answer Selected]'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900">
                      <span className="text-slate-450 block">Correct Answer:</span>
                      <span className="font-bold text-emerald-400">
                        {item.correctAnswer}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
