import React from 'react';
import { Briefcase, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProjectStatusCardProps {
  title: string;
  type: 'Assignment' | 'Final Project';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_SUBMITTED';
  feedback?: string;
  week?: number;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ 
  title, type, status, feedback, week 
}) => {
  const statusConfig = {
    PENDING: { 
      icon: Clock, 
      color: 'text-amber-400', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20',
      text: 'Under Evaluation' 
    },
    APPROVED: { 
      icon: CheckCircle2, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      text: 'Completed' 
    },
    REJECTED: { 
      icon: AlertCircle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20',
      text: 'Revision Needed' 
    },
    NOT_SUBMITTED: { 
      icon: Briefcase, 
      color: 'text-slate-500', 
      bg: 'bg-slate-900/40', 
      border: 'border-slate-800',
      text: 'Not Started' 
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-2xl border ${config.bg} ${config.border} flex flex-col justify-between h-full`}>
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <span className={`text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${config.bg} ${config.color} border ${config.border}`}>
            {type} {week ? `• Week ${week}` : ''}
          </span>
          <Icon size={14} className={config.color} />
        </div>
        <h4 className="text-xs font-bold text-white truncate">{title}</h4>
        {feedback && (
          <p className="text-[11px] text-slate-400 italic line-clamp-2">"{feedback}"</p>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <span className={`text-[11px] font-bold ${config.color}`}>{config.text}</span>
        {status === 'NOT_SUBMITTED' && (
          <button className="text-[11px] font-black text-blue-400 uppercase tracking-widest hover:underline">
            Submit Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectStatusCard;
