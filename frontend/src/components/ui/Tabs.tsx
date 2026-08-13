import React, { createContext, useContext } from 'react';

// ── Tabs (accessible tab pattern, zero deps) ───────────────────────────────
// Controlled compound component. Tabs owns `value`/`onValueChange`; TabsList,
// TabsTrigger and TabsContent read/write through context.
//
// Semantics: the real ARIA tab pattern — role="tablist" / role="tab" /
// role="tabpanel", aria-selected, aria-controls / aria-labelledby, and
// arrow-key navigation with roving tabindex (only the active trigger sits in
// the tab order). Panels unmount when inactive, matching the previous
// `{activeTab === x && …}` guards, so output is unchanged.
//
// Design rule: this primitive ships NO default visuals. Callers pass their
// exact existing classes to each part, so migrating a hand-rolled tab bar is
// pixel-identical — the value here is semantics, keyboard behavior and the
// trigger/panel relationship, not styling.

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Tabs>`);
  return ctx;
}

const triggerId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

/**
 * Controlled tabs root. Renders a fragment (no wrapper element) so any
 * `space-y-*`/layout rules on the consumer's own container still apply
 * between the tab list and the panels exactly as before.
 */
const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  const baseId = React.useId();
  return (
    <TabsContext.Provider value={{ value, onValueChange, baseId }}>
      {children}
    </TabsContext.Provider>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/** Tab strip — role="tablist". Arrow keys / Home / End move focus and activate. */
const TabsList: React.FC<TabsListProps> = ({ children, className = '', ...rest }) => {
  const { onValueChange } = useTabsContext('TabsList');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const triggers = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    if (triggers.length === 0) return;

    let nextIndex = triggers.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    if (nextIndex === -1) nextIndex = 0;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (nextIndex + 1) % triggers.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (nextIndex - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = triggers.length - 1;
        break;
      default:
        return;
    }

    const next = triggers[nextIndex];
    next.focus();
    const nextValue = next.getAttribute('data-value');
    if (nextValue) onValueChange(nextValue);
  };

  return (
    <div role="tablist" onKeyDown={handleKeyDown} className={className} {...rest}>
      {children}
    </div>
  );
};

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

/** Individual tab — role="tab". `value` wires it to its TabsContent panel. */
const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '', ...rest }) => {
  const { value: activeValue, onValueChange, baseId } = useTabsContext('TabsTrigger');
  const isActive = activeValue === value;
  return (
    <button
      type="button"
      id={triggerId(baseId, value)}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId(baseId, value)}
      tabIndex={isActive ? 0 : -1}
      data-value={value}
      onClick={() => onValueChange(value)}
      className={className}
      {...rest}
    >
      {children}
    </button>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

/**
 * Tab panel — role="tabpanel", focusable so keyboard users can scroll it.
 * Unmounts when inactive (same rendering as the old conditional guards).
 */
const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '', ...rest }) => {
  const { value: activeValue, baseId } = useTabsContext('TabsContent');
  if (activeValue !== value) return null;
  return (
    <div
      id={panelId(baseId, value)}
      role="tabpanel"
      aria-labelledby={triggerId(baseId, value)}
      tabIndex={0}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
