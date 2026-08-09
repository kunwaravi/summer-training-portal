import React, { useState } from 'react';
import { BookOpen, Lock, CheckCircle, ChevronRight, Home, Map as MapIcon, List } from 'lucide-react';
import ProgressMap from './ProgressMap';

interface Week {
  week: number;
  title: string;
}

interface SyllabusManagerProps {
  weeks: Week[];
  activeWeekIndex: number;
  setActiveWeekIndex: (index: number) => void;
  currentWeek: number;
  completedPercentage: number;
  onWeekChange?: () => void;
  viewState?: 'course-home' | 'module-home' | 'topic-reader';
  setViewState?: (state: 'course-home' | 'module-home' | 'topic-reader') => void;
}

const SyllabusManager: React.FC<SyllabusManagerProps> = ({
  weeks,
  activeWeekIndex,
  setActiveWeekIndex,
  currentWeek,
  completedPercentage,
  onWeekChange,
  viewState = 'course-home',
  setViewState
}) => {
  const [showMap, setShowMap] = useState(false);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completedPercentage / 100) * circumference;

  return (
    <div className="w-full lg:w-1/3 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3.5 shrink-0">
      <h2 className="text-lg font-extrabold tracking-tight px-2 pb-2 border-b border-slate-800 text-white">Course Chapters</h2>
      
      {/* Circular Progress Widget in Sidebar */}
      <div className="flex items-center gap-3.5 p-3 bg-slate-900/60 border border-slate-800/85 rounded-xl shadow-inner">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-slate-800"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="text-cyan-400 transition-all duration-750 ease-out animate-pulse-slow"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[9px] font-black text-white">{completedPercentage}%</span>
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider">Track Progress</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{currentWeek} of {weeks.length} Chapters Completed</p>
        </div>
      </div>
      
      {/* List ↔ Map toggle (issue #73) */}
      <div className="flex rounded-lg border border-slate-800 overflow-hidden">
        <button
          onClick={() => setShowMap(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
            !showMap ? 'bg-cyan-500/15 text-cyan-400' : 'bg-slate-900/40 text-slate-500 hover:text-slate-300'
          }`}
        >
          <List size={12} /> List
        </button>
        <button
          onClick={() => setShowMap(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
            showMap ? 'bg-cyan-500/15 text-cyan-400' : 'bg-slate-900/40 text-slate-500 hover:text-slate-300'
          }`}
        >
          <MapIcon size={12} /> Map
        </button>
      </div>

      {showMap ? (
        <ProgressMap
          weeks={weeks}
          currentWeek={currentWeek}
          activeWeekIndex={activeWeekIndex}
          setActiveWeekIndex={setActiveWeekIndex}
          onNodeClick={() => {
            if (setViewState) {
              setViewState('module-home');
              onWeekChange?.();
            }
          }}
        />
      ) : (
      <div className="space-y-2.5">
        {/* Course Home Overview Button */}
        <button
          onClick={() => {
            if (setViewState) {
              setViewState('course-home');
              onWeekChange?.();
            }
          }}
          className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 group cursor-pointer ${
            viewState === 'course-home'
              ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/5' 
              : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              viewState === 'course-home'
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'bg-slate-700/50 text-slate-400'
            }`}>
              <Home size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overview</p>
              <h4 className="text-sm font-bold">Course Syllabus Outline</h4>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {weeks.map((week, index) => {
          const isUnlocked = index <= currentWeek;
          const isCompleted = index < currentWeek;
          const isActive = index === activeWeekIndex && viewState !== 'course-home';
          
          return (
            <button
              key={index}
              disabled={!isUnlocked}
              onClick={() => {
                setActiveWeekIndex(index);
                if (setViewState) {
                  setViewState('module-home');
                }
                onWeekChange?.();
              }}
              className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 group ${
                isActive 
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/5' 
                  : isUnlocked 
                    ? 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600' 
                    : 'bg-slate-950/20 border-slate-900 text-slate-500 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : isUnlocked 
                      ? 'bg-slate-700/50 text-slate-400' 
                      : 'bg-slate-800 text-slate-600'
                 }`}>
                  {isCompleted ? <CheckCircle size={18} className="text-emerald-400" /> : isUnlocked ? <BookOpen size={18} /> : <Lock size={18} />}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chapter {week.week}</p>
                  <h4 className="text-sm font-bold truncate max-w-[170px]">{week.title}</h4>
                </div>
              </div>
              {isUnlocked && <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default SyllabusManager;
