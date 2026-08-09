import React from 'react';
import { Check, Lock } from 'lucide-react';

/**
 * Visual interactive progress map (issue #73) — freeCodeCamp Map style.
 * Renders course modules as nodes in a responsive grid:
 *   completed (emerald check) → unlocked (clickable cyan) → locked (gray lock)
 * Uses the corrected total-modules progress math from the backend.
 */

interface ProgressMapProps {
  weeks: { week: number; title: string }[];
  currentWeek: number; // number of completed weeks
  activeWeekIndex: number;
  setActiveWeekIndex: (index: number) => void;
  onNodeClick?: () => void;
}

const ProgressMap: React.FC<ProgressMapProps> = ({
  weeks,
  currentWeek,
  activeWeekIndex,
  setActiveWeekIndex,
  onNodeClick
}) => {
  const total = weeks.length || 1;
  const pct = Math.min(Math.round((currentWeek / total) * 100), 100);

  return (
    <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
      {/* Progress bar (corrected math — issue #70) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            Learning Progress Map
          </span>
          <span className="text-[11px] font-bold text-cyan-400">{pct}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Node map */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
        {weeks.map((week, index) => {
          const isCompleted = index < currentWeek;
          const isUnlocked = index <= currentWeek;
          const isActive = index === activeWeekIndex;

          return (
            <button
              key={week.week}
              disabled={!isUnlocked}
              onClick={() => {
                setActiveWeekIndex(index);
                onNodeClick?.();
              }}
              title={`Chapter ${week.week}: ${week.title}`}
              aria-label={`Chapter ${week.week}: ${week.title}`}
              className={`relative flex flex-col items-center gap-1 group focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-lg ${
                isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              {/* connector line (beehive feel) */}
              {index < weeks.length - 1 && (
                <span
                  className={`absolute top-3 left-1/2 w-full h-px ${
                    index < currentWeek ? 'bg-emerald-500/50' : 'bg-slate-800'
                  }`}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}

              <span
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                    : isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/30 scale-110'
                      : isUnlocked
                        ? 'bg-slate-800/60 border-slate-600 text-slate-300 group-hover:border-cyan-500 group-hover:text-cyan-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : isUnlocked ? (
                  <span className="text-[11px] font-black">{week.week}</span>
                ) : (
                  <Lock size={12} />
                )}
              </span>

              <span
                className={`text-[11px] font-bold uppercase tracking-wider max-w-full truncate ${
                  isUnlocked ? 'text-slate-500' : 'text-slate-700'
                }`}
              >
                Ch {week.week}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressMap;
