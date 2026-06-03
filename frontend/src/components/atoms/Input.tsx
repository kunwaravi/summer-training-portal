import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 group-focus-within:text-blue-500 transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            w-full bg-slate-800/80 rounded-xl border border-slate-700/60 text-white placeholder-slate-450 
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
            transition-all text-sm py-2.5
            ${leftIcon ? 'pl-10' : 'pl-4'} 
            ${rightIcon ? 'pr-10' : 'pr-4'}
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-[10px] font-semibold pl-1 uppercase tracking-tight">
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

export default Input;
