import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Standard ConfirmDialog (Phase 5) — replaces window.confirm for
 * destructive / consequential actions. Promise-driven via useUI().confirmDialog.
 */
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  // Esc closes (cancel); disabled while an action is in flight
  useEffect(() => {
    if (!open || busy) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, busy, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm no-print"
            onClick={busy ? undefined : onCancel}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 no-print">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg ${danger ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    <AlertTriangle size={16} />
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{title}</h3>
                </div>
                <button
                  onClick={onCancel}
                  disabled={busy}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                  aria-label="Close dialog"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 py-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  onClick={onCancel}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={busy}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                    danger
                      ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
