import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from '../components/atoms/ConfirmDialog';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  busy: boolean;
  resolve: ((ok: boolean) => void) | null;
}

interface UIContextType {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  /** Promise-based confirm dialog — resolves true on confirm, false on cancel. */
  confirmDialog: (options: ConfirmOptions) => Promise<boolean>;
}

const UIContext = createContext<UIContextType | null>(null);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    busy: false,
    resolve: null,
    title: '',
    message: '',
  });

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const confirmDialog = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, open: true, busy: false, resolve });
    });
  }, []);

  const settleConfirm = useCallback((ok: boolean) => {
    setConfirmState((prev) => {
      prev.resolve?.(ok);
      return { ...prev, open: false, resolve: null };
    });
  }, []);

  const handleConfirm = useCallback(() => {
    // Close immediately; the caller owns the async work (busy state is opt-in via a re-open).
    settleConfirm(true);
  }, [settleConfirm]);

  return (
    <UIContext.Provider value={{ toasts, addToast, removeToast, confirmDialog }}>
      {children}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        danger={confirmState.danger}
        busy={confirmState.busy}
        onConfirm={handleConfirm}
        onCancel={() => settleConfirm(false)}
      />
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded shadow-lg text-white transition-all transform animate-fade-in ${
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' :
              toast.type === 'warning' ? 'bg-yellow-600' :
              'bg-blue-600'
            }`}
          >
            {toast.message}
            <button onClick={() => removeToast(toast.id)} className="ml-2 font-bold">&times;</button>
          </div>
        ))}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
