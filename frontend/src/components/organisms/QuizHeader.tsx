import React from 'react';
import { ChevronLeft, Clock } from 'lucide-react';

interface QuizHeaderProps {
  onCancel: () => void;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  /** Page's primary heading — the Quiz page previously had no h1 (audit HIGH). */
  title?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ onCancel, timeLeft, formatTime, title = 'Quiz' }) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-bold uppercase tracking-wider shrink-0"
      >
        <ChevronLeft size={16} /> Cancel Exam
      </button>

      <h1 className="min-w-0 flex-1 text-center text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-200 truncate">
        {title}
      </h1>

      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm shrink-0 ${
        timeLeft < 60
          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse'
          : timeLeft < 120
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <Clock size={16} />
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default QuizHeader;
