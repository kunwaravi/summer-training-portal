import React from 'react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseHeroProps {
  courseId: string | undefined;
}

const CourseHero: React.FC<CourseHeroProps> = ({ courseId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-semibold"
      >
        <ArrowLeft size={16} /> Back to Tracks
      </button>
      <div className="flex items-center gap-2">
        <GraduationCap className="text-blue-400" size={20} />
        <span className="text-xs uppercase tracking-widest text-slate-350 font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700/60">
          {courseId} Training Track
        </span>
      </div>
    </div>
  );
};

export default CourseHero;
