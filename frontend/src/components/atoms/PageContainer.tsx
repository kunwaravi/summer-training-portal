import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Page-content spacing shell (Task 3).
 *
 * Centering + vertical rhythm only. Horizontal padding belongs to each page
 * (every page already self-pads via `max-w-* mx-auto px-4`), so nothing is
 * double-padded. Full-bleed / self-contained pages (e.g. Certificate) are
 * unaffected — their content self-pads and their print layout is driven by
 * their own `@media print` rules.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children, className = '' }) => (
  <div className={`container mx-auto py-8 flex-grow w-full ${className}`}>
    {children}
  </div>
);

export default PageContainer;
