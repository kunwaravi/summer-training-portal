import React from 'react';
import { motion } from 'framer-motion';

interface Skill {
  label: string;
  value: number; // 0 to 100
  color: string;
}

interface SkillRadarProps {
  skills: Skill[];
}

const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
  // Simple Radar chart using SVG
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;
  const totalSkills = skills.length;

  const points = skills.map((skill, i) => {
    const angle = (i * 2 * Math.PI) / totalSkills - Math.PI / 2;
    const r = (skill.value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const backgroundPolygons = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    return skills.map((_, i) => {
      const angle = (i * 2 * Math.PI) / totalSkills - Math.PI / 2;
      const r = scale * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Grid */}
          {backgroundPolygons.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {skills.map((_, i) => {
            const angle = (i * 2 * Math.PI) / totalSkills - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(148, 163, 184, 0.1)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            points={points}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {skills.map((skill, i) => {
            const angle = (i * 2 * Math.PI) / totalSkills - Math.PI / 2;
            const r = (skill.value / 100) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
              <motion.circle
                key={i}
                initial={{ r: 0 }}
                animate={{ r: 3 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                cx={x}
                cy={y}
                fill={skill.color}
                className="drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
              />
            );
          })}

          {/* Labels */}
          {skills.map((skill, i) => {
            const angle = (i * 2 * Math.PI) / totalSkills - Math.PI / 2;
            const x = center + (radius + 25) * Math.cos(angle);
            const y = center + (radius + 15) * Math.sin(angle);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-slate-400 text-[11px] font-bold uppercase tracking-wider"
              >
                {skill.label}
              </text>
            );
          })}
        </svg>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4 w-full">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: skill.color }}></div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{skill.label}</span>
            <span className="text-[11px] font-mono text-slate-500 ml-auto">{skill.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadar;
