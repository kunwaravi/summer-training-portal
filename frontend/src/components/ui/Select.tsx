import React from 'react';

// ── Select (styled native <select>, zero deps) ─────────────────────────────
// Deliberately a thin wrapper around the native <select>: we do NOT re-invent
// a combobox. The OS picker, keyboard behavior, form submission and mobile
// sheets all stay native. What this adds over a raw <select>:
//   • the app's standard field styling (shared border/bg/radius/focus; size
//     classes like "px-4 py-2.5 text-xs" are passed by the caller so each
//     field keeps its exact look — see the two sizes in AdminDashboard)
//   • label ↔ select association via useId (the previous markup had bare
//     text labels with no htmlFor)
//   • optional error state + aria-invalid / aria-describedby
// Matches the Input atom's conventions (label/error/containerClassName).

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  containerClassName = '',
  className = '',
  id,
  children,
  ...props
}) => {
  const generatedId = React.useId();
  const selectId = id ?? `select-${generatedId}`;
  const errorId = error ? `${selectId}-error` : undefined;
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-[11px] uppercase font-black tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`
          w-full bg-slate-950 border border-slate-800 rounded-xl
          text-white focus:outline-none focus:border-cyan-500 transition-colors
          ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-red-400 text-[11px] font-semibold pl-1 uppercase tracking-tight">
          ⚠ {error}
        </p>
      )}
    </div>
  );
};

export default Select;
