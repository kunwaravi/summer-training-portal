import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'accent' | 'outline';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col shadow-lg';
  
  const variants = {
    default: 'bg-slate-900 border-slate-800',
    glass: 'bg-slate-900/30 backdrop-blur-md border-slate-800',
    accent: 'bg-slate-900 border-blue-500/20 shadow-blue-500/5',
    outline: 'bg-transparent border-slate-800',
  };

  const hoverStyles = hoverable || onClick ? 'cursor-pointer hover:border-slate-700 hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
