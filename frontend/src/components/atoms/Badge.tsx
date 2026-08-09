import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded font-black uppercase tracking-wider border';
  
  const variants = {
    primary: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    secondary: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    accent: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    neutral: 'bg-slate-800 border-slate-700 text-slate-300',
    success: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-[11px]',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
