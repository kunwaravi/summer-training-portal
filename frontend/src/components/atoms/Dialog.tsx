import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';

/**
 * Accessible Dialog primitive (M-042) — shared shell for every modal/slide-over
 * in the app. Owns the behaviours every overlay used to duplicate ad hoc:
 *
 *   - `role="dialog"` + `aria-modal="true"` + accessible title (aria-label)
 *   - Focus trap (Tab cycles inside), initial focus, focus restore to trigger
 *   - Escape-to-close (suppressed while `busy`)
 *   - Body scroll lock (nesting-safe — ConfirmDialog over another dialog)
 *   - Backdrop click-to-close (suppressed while `busy`)
 *   - Busy state: opaque spinner overlay, blocks close paths
 *   - Size map + per-overlay panel/backdrop appearance preserved via props
 *
 * z-index layering (documented in index.css):
 *   overlays → z-50 (default), ConfirmDialog → z-60, FAB → z-[9999],
 *   toasts → z-[10001]. Dialog never blindly raises its own index.
 *
 * Children own the visible header/body/footer markup so screenshot parity is
 * exact; the primitive only adds the chrome + behaviour around it.
 *
 * Initial focus: first focusable element inside, or `[data-dialog-autofocus]`
 * when present (opt-in per dialog, e.g. the safest confirm button).
 */
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible dialog title — announced by screen readers as the dialog name. */
  title: string;
  /** id of an element inside `children` that describes the dialog (aria-describedby). */
  descriptionId?: string;
  /** Width variant: sm/md/lg/xl/full (max-w-sm … max-w-5xl). Ignored when placement="right". */
  size?: DialogSize;
  /** Panel position: centered modal (default) or right-edge slide-over drawer. */
  placement?: 'center' | 'right';
  /** Panel appearance classes — background, border-color, radius, padding, height. */
  className?: string;
  /** Backdrop appearance classes (kept per-overlay for visual parity). */
  backdropClassName?: string;
  /** Backdrop dim level (ExamResults 0.75 / PeerSolutions 0.6 / others 1). */
  backdropOpacity?: number;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  /** Locks the dialog with a spinner and blocks all close paths while true. */
  busy?: boolean;
  /** Stacking layer — 50 for overlays, 60 for confirm dialogs. */
  zIndex?: number;
  children: React.ReactNode;
}

const SIZES: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-5xl',
};

// Nested dialogs (ConfirmDialog over a modal) share a single scroll lock.
let scrollLocks = 0;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  descriptionId,
  size = 'lg',
  placement = 'center',
  className = '',
  backdropClassName = 'bg-black/60 backdrop-blur-sm',
  backdropOpacity = 1,
  closeOnBackdrop = true,
  closeOnEscape = true,
  busy = false,
  zIndex = 50,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Snapshot children while open so the exit animation keeps the full content
  // mounted (parents may pass `{data && …}` that goes null on close). Written
  // in an effect (not render) so the latest content is captured each frame
  // while open, but the close render's null never overwrites the snapshot.
  const childrenRef = useRef<React.ReactNode>(children);
  useEffect(() => {
    if (open) childrenRef.current = children;
  });

  // Open/close lifecycle: nested-safe scroll lock, initial focus, focus restore.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevScrollY = window.scrollY;

    scrollLocks += 1;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const initial =
      panel?.querySelector<HTMLElement>('[data-dialog-autofocus]') ||
      panel?.querySelector<HTMLElement>(FOCUSABLE) ||
      panel ||
      null;
    initial?.focus({ preventScroll: true });

    return () => {
      scrollLocks = Math.max(0, scrollLocks - 1);
      if (scrollLocks === 0) document.body.style.overflow = '';
      window.scrollTo(0, prevScrollY);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Escape + Tab trap (Esc suppressed while busy — mirrors the old ConfirmDialog).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (busy) return;
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusables.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, busy, closeOnEscape, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — shares the dialog's z-index so it always sits above any
              overlay beneath (e.g. a ConfirmDialog stacked over a z-50 modal). */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: backdropOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 no-print ${backdropClassName}`}
            style={{ zIndex }}
            aria-hidden="true"
            onClick={closeOnBackdrop && !busy ? onClose : undefined}
          />
          {/* Positioning layer — scrolls when the panel exceeds the viewport.
              pointer-events-none so empty-area clicks fall through to the
              backdrop below (it shares the z-index and paints on top). */}
          <div
            className={`fixed inset-0 overflow-y-auto no-print pointer-events-none ${placement === 'right' ? 'flex items-stretch justify-end' : 'flex items-center justify-center p-4'}`}
            style={{ zIndex }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              aria-describedby={descriptionId}
              ref={panelRef}
              tabIndex={-1}
              initial={placement === 'right' ? { x: '100%' } : { opacity: 0, scale: 0.95, y: 16 }}
              animate={placement === 'right' ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={placement === 'right' ? { x: '100%' } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={placement === 'right' ? { type: 'spring', damping: 25, stiffness: 200 } : { type: 'spring', damping: 26, stiffness: 260 }}
              className={`relative w-full flex flex-col overflow-hidden border shadow-2xl pointer-events-auto ${placement === 'right' ? 'h-full max-h-full w-full max-w-md' : `max-h-[88vh] ${SIZES[size]}`} ${className}`}
            >
              {busy && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <Spinner size="lg" />
                </div>
              )}
              {/* Live children while open; the snapshot only feeds the exit pass,
                  where the parent has already turned `children` null. */}
              {/* eslint-disable-next-line react-hooks/refs */}
              {open ? children : childrenRef.current}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
