import React from 'react';

// ── Table primitives (semantic HTML, zero deps, no data-grid) ──────────────
// Structure-only helpers: Table wraps the horizontal-scroll container + the
// <table>; *Header / *Body / *Row / *Head / *Cell map 1:1 to
// thead / tbody / tr / th / td. Every part takes className so callers keep
// their exact look — the primitive only guarantees the standard structural
// classes (overflow-x-auto, w-full text-left).
//
// Deliberately out of scope: sorting, filtering, pagination, cell selection.
// Those are page-level concerns and stay in the callers (e.g. LeaderboardTab's
// pagination, AdminDashboard's handleSort).

interface TableProps {
  children: React.ReactNode;
  /** Extra <table> classes, e.g. "text-xs border-collapse". */
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className = '' }) => (
  <div className="overflow-x-auto">
    <table className={`w-full text-left ${className}`}>{children}</table>
  </div>
);

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => (
  <thead className={className}>{children}</thead>
);

interface TableBodyProps {
  children: React.ReactNode;
  /** Row dividers, e.g. "divide-y divide-slate-850". */
  className?: string;
}

const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => (
  <tbody className={className}>{children}</tbody>
);

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => (
  <tr className={className}>{children}</tr>
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHead: React.FC<TableHeadProps> = ({ className = '', children, ...rest }) => (
  <th className={className} {...rest}>
    {children}
  </th>
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ className = '', children, ...rest }) => (
  <td className={className} {...rest}>
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
