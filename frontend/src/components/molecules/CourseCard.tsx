import React, { useState } from 'react';
import { BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

interface SyllabusItem {
  week: number;
  title: string;
  details: string;
}

interface CourseCardProps {
  id: string;
  title: string;
  desc: string;
  icon?: LucideIcon;
  color?: string; // Gradient string for header
  barColor?: string; // Tailwind color class for progress bar
  progress?: number;
  weekCompleted?: number;
  completed?: boolean;
  difficulty?: string;
  tags?: string[];
  syllabus?: SyllabusItem[];
  type?: 'catalog' | 'dashboard';
  onAction?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  desc,
  icon: Icon,
  color = 'from-blue-500 to-blue-700',
  barColor = 'bg-blue-500',
  progress = 0,
  weekCompleted = 0,
  completed = false,
  difficulty,
  syllabus = [],
  type = 'dashboard',
  onAction,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (type === 'catalog') {
    return (
      <Card 
        className={`p-6 ${isExpanded ? 'border-amber-500/20 shadow-amber-500/5' : 'border-slate-850'}`}
        variant="glass"
      >
        {/* Visual Accent */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${color} rounded-full blur-3xl pointer-events-none`}></div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Badge variant="accent">Free to Learn</Badge>
            {difficulty && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                ⚡ {difficulty}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
          </div>

          {syllabus.length > 0 && (
            <div className="pt-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                  isExpanded 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-slate-950/40 border-slate-900 text-slate-355 hover:bg-slate-900/60 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen size={14} /> {isExpanded ? "Hide Syllabus Details" : "View Syllabus Details"}
                </span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-3.5 space-y-3.5 pl-1.5"
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-1.5 pl-0.5">Syllabus Breakdown</h4>
                    <div className="space-y-3">
                      {syllabus.map((syll) => (
                        <div key={syll.week} className="flex gap-3 text-left">
                          <span className="text-[10px] font-black text-amber-400 shrink-0 bg-amber-500/10 h-5 w-9 flex items-center justify-center rounded border border-amber-500/20">
                            W{syll.week}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">{syll.title}</p>
                            <p className="text-[10px] text-slate-450 mt-0.5 font-medium leading-relaxed">{syll.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="pt-6 mt-6 border-t border-slate-850/60 flex justify-end">
          <button 
            onClick={() => onAction?.(id)}
            className="text-xs font-extrabold uppercase text-amber-450 hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            Start Learning →
          </button>
        </div>
      </Card>
    );
  }

  // Dashboard version
  return (
    <Card 
      onClick={() => onAction?.(id)}
      hoverable
      className="group"
    >
      {/* Top Half: Gradient Header Block */}
      <div className={`h-32 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
        {Icon && <Icon size={48} className="text-white drop-shadow-md" />}
        
        {/* Dynamic Status Badge overlay */}
        <div className="absolute top-3 right-3">
          {completed ? (
            <Badge variant="success">Completed</Badge>
          ) : progress > 0 ? (
            <Badge variant="primary">Week {weekCompleted}/4</Badge>
          ) : (
            <Badge variant="neutral">Not Started</Badge>
          )}
        </div>
      </div>

      {/* Bottom Half: Detailed Course Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold group-hover:text-blue-400 transition tracking-tight text-white">
            {title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {desc}
          </p>
        </div>

        {/* Course Progress Section */}
        <div className="space-y-2 pt-2 border-t border-slate-700/60">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
            <span>Progress</span>
            <span className="text-slate-200">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${barColor} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Navigation Callout */}
        <div className={`flex items-center font-bold text-xs pt-1 group-hover:translate-x-1 transition-transform ${completed ? 'text-emerald-400' : 'text-blue-400'}`}>
          {completed ? 'View Certificate' : progress > 0 ? 'Resume Training' : 'Start Training'} →
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
