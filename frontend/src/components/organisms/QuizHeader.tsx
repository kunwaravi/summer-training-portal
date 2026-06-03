import React from 'react';
import { ChevronLeft, Clock } from 'lucide-react';

interface QuizHeaderProps {
  onCancel: () => void;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ onCancel, timeLeft, formatTime }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
      <button 
        onClick={onCancel}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-bold uppercase tracking-wider"
      >
        <ChevronLeft size={16} /> Cancel Exam
      </button>
      
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm ${
        timeLeft < 60 
          ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
          : 'bg-slate-900/60 border-slate-800 text-slate-300'
      }`}>
        <Clock size={16} />
        <span>{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

export default QuizHeader;
