import React from 'react';

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

/**
 * Skeleton (Phase 5, #46) — shimmer placeholder for loading states.
 * Mirrors layout blocks so screens feel instant. Pair with a visually
 * hidden `role="status"` label on the parent for screen readers.
 */
const Skeleton: React.FC<SkeletonProps> = ({ className = '', rounded = true }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${rounded ? 'rounded-xl' : 'rounded-none'} ${className}`}
  />
);

export default Skeleton;
