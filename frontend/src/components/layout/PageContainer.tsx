import React from 'react';

export type PageMaxWidth =
  | 'max-w-md'
  | 'max-w-lg'
  | 'max-w-xl'
  | 'max-w-2xl'
  | 'max-w-3xl'
  | 'max-w-4xl'
  | 'max-w-5xl'
  | 'max-w-6xl'
  | 'max-w-7xl';

interface PageContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /**
   * Content max-width — the single source of truth for page width.
   * Default `max-w-7xl` so pages using 7xl actually reach 7xl (the old shell
   * `container` class capped width at breakpoints independently of the page's
   * own max-w, i.e. two conflicting width authorities). Pass a narrower token
   * only for intentionally-narrow pages (e.g. Quiz `max-w-2xl`).
   */
  maxWidth?: PageMaxWidth;
  className?: string;
}

/**
 * Page-content container (M-043) — single source of truth for page horizontal
 * padding (`px-4`) and max-width (`maxWidth`). Vertical rhythm comes from the
 * app shell (`py-8` in App.tsx) plus each page's own `py-*` in `className`.
 *
 * Only for standard content-column pages. Self-contained layouts (auth
 * centering, full-bleed legal pages, centered cards like PayPage, Certificate)
 * keep their own roots and do not use this container.
 */
const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'max-w-7xl',
  className = '',
  ...rest
}) => (
  <div className={`w-full mx-auto px-4 flex-grow ${maxWidth} ${className}`} {...rest}>
    {children}
  </div>
);

export default PageContainer;
