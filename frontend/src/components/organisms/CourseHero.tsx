import React from 'react';
import { ArrowLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface CourseHeroProps {
  courseId: string | undefined;
  courseTitle?: string;
  weekTitle?: string;
  topicTitle?: string;
  viewState: 'course-home' | 'module-home' | 'topic-reader';
  setViewState: (state: 'course-home' | 'module-home' | 'topic-reader') => void;
  mobileView?: 'chapters' | 'content';
  onBackClick?: () => void;
}

const CourseHero: React.FC<CourseHeroProps> = ({
  courseId,
  courseTitle = 'Specialized Track',
  weekTitle,
  topicTitle,
  viewState,
  setViewState,
  mobileView = 'chapters',
  onBackClick
}) => {
  const navigate = useNavigate();
  const isMobileContent = mobileView === 'content';

  const handleBack = () => {
    if (viewState === 'topic-reader') {
      setViewState('module-home');
    } else if (viewState === 'module-home') {
      setViewState('course-home');
      if (isMobileContent && onBackClick) {
        onBackClick();
      }
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-3.5 border-b border-slate-850 pb-4">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-500">
        <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
        <ChevronRight size={10} className="text-slate-800" />
        <button 
          onClick={() => setViewState('course-home')} 
          className={`hover:text-blue-400 transition-colors uppercase cursor-pointer ${
            viewState === 'course-home' ? 'text-slate-400 font-bold' : ''
          }`}
        >
          {courseTitle}
        </button>
        {viewState !== 'course-home' && weekTitle && (
          <>
            <ChevronRight size={10} className="text-slate-800" />
            <button 
              onClick={() => setViewState('module-home')}
              className={`hover:text-cyan-400 transition-colors uppercase cursor-pointer ${
                viewState === 'module-home' ? 'text-cyan-400 font-bold' : ''
              }`}
            >
              {weekTitle}
            </button>
          </>
        )}
        {viewState === 'topic-reader' && topicTitle && (
          <>
            <ChevronRight size={10} className="text-slate-800" />
            <span className="text-amber-400 truncate max-w-[120px] sm:max-w-none">{topicTitle}</span>
          </>
        )}
      </nav>

      {/* Hero Control Row */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-[10px] sm:text-xs font-black uppercase tracking-widest bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.08)] group cursor-pointer"
        >
          <ArrowLeft size={14} className="text-blue-500 group-hover:-translate-x-0.5 transition-transform" /> 
          {viewState === 'topic-reader' 
            ? 'Back to Outline' 
            : viewState === 'module-home' 
              ? 'Back to Overview' 
              : 'Back to Dashboard'}
        </button>
        <div className="flex items-center gap-2">
          <GraduationCap className="text-blue-400" size={16} />
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-black bg-slate-900/60 px-3 py-1 rounded-full border border-slate-850 shadow-inner">
            {courseId} Track
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;
