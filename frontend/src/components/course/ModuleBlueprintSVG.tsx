import React from 'react';

interface ModuleBlueprintSVGProps {
  courseKey: string;
  weekNum: number;
}

export const ModuleBlueprintSVG: React.FC<ModuleBlueprintSVGProps> = ({
  courseKey,
  weekNum
}) => {
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
          <text x="115" y="73" textAnchor="middle" className="fill-cyan-400 text-[11px] font-extrabold">Assembly</text>
          
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
          <text x="285" y="85" textAnchor="middle" className="fill-emerald-400 text-[11px] font-black">TRUE</text>
          <rect x="230" y="120" width="80" height="30" rx="6" fill="#065f46" stroke="#10b981" strokeWidth="1" />
          <text x="270" y="138" textAnchor="middle" className="fill-white text-[11px] font-black">PASS EXAM</text>
          
          <path d="M 80 60 L 50 60 L 50 120" stroke="#ef4444" strokeWidth="1.5" />
          <text x="35" y="85" textAnchor="middle" className="fill-red-400 text-[11px] font-black">FALSE</text>
          <rect x="10" y="120" width="80" height="30" rx="6" fill="#991b1b" stroke="#ef4444" strokeWidth="1" />
          <text x="50" y="138" textAnchor="middle" className="fill-white text-[11px] font-black">FAIL RETRY</text>
        </svg>
      );
    }
    if (weekNum === 3) {
      return (
        <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
          <g transform="translate(10, 50)">
            <rect x="0" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
            <text x="25" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">10</text>
            <text x="25" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[11px]">Idx 0</text>
            
            <rect x="50" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
            <text x="75" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">20</text>
            <text x="75" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[11px]">Idx 1</text>
            
            <rect x="100" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
            <text x="125" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">30</text>
            <text x="125" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[11px]">Idx 2</text>
            
            <rect x="150" y="20" width="50" height="40" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
            <text x="175" y="45" textAnchor="middle" className="fill-white font-mono text-sm font-bold">40</text>
            <text x="175" y="80" textAnchor="middle" className="fill-slate-500 font-mono text-[11px]">Idx 3</text>
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
          <text x="60" y="82" textAnchor="middle" className="fill-slate-500 font-mono text-[11px]">Holds: 0x7FFA</text>
          
          <path d="M 100 70 L 180 70" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" markerEnd="url(#goldArrow)" />
          <text x="140" y="60" textAnchor="middle" className="fill-amber-400 text-[11px] font-bold">Points To</text>
          
          <rect x="190" y="50" width="100" height="45" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <text x="240" y="72" textAnchor="middle" className="fill-emerald-400 font-mono text-sm font-black">100</text>
          <text x="240" y="86" textAnchor="middle" className="fill-slate-400 font-mono text-[11px]">Address: 0x7FFA</text>
          <defs>
            <marker id="goldArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      );
    }
  }

  // Fallback vector outline for other weeks/courses (Sleek generic architecture circuit map)
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto max-h-[160px]">
      <circle cx="60" cy="100" r="30" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
      <text x="60" y="104" textAnchor="middle" className="fill-white text-[11px] font-black">{courseKey} Micro</text>
      
      <path d="M 90 100 L 150 100" stroke={strokeColor} strokeWidth="2" />
      <rect x="150" y="75" width="80" height="50" rx="8" fill="#1e293b" stroke={accentColor} strokeWidth="2" />
      <text x="190" y="104" textAnchor="middle" className="fill-cyan-400 text-[11px] font-bold">Registers</text>
      
      <path d="M 230 100 L 280 100" stroke={strokeColor} strokeWidth="2" />
      <circle cx="290" cy="100" r="10" fill="#10b981" />
      <text x="190" y="50" textAnchor="middle" className="fill-amber-400 text-[11px] font-black">Week {weekNum} Logic Flow</text>
    </svg>
  );
};
export default ModuleBlueprintSVG;
