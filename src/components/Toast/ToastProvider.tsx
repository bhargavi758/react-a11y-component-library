import React, { createContext, useContext, useCallback, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Toast, ToastData, ToastSeverity } from './Toast';

interface ToastContextValue {
  addToast: (message: string, severity?: ToastSeverity, duration?: number) => string;
  removeToast: (id: string) => void;
  removeAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

let toastCounter = 0;

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

const positionStyles: Record<string, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (message: string, severity: ToastSeverity = 'info', duration = 5000): string => {
      toastCounter += 1;
      const id = `toast-${toastCounter}`;
      const newToast: ToastData = { id, message, severity, duration };

      setToasts((prev) => {
        const next = [...prev, newToast];
        return next.length > maxToasts ? next.slice(-maxToasts) : next;
      });

      return id;
    },
    [maxToasts],
  );

  const contextValue = useMemo(
    () => ({ addToast, removeToast, removeAll }),
    [addToast, removeToast, removeAll],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            aria-relevant="additions removals"
            className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${positionStyles[position] ?? positionStyles['top-right']}`}
          >
            {toasts.map((toast) => (
              <Toast key={toast.id} {...toast} onDismiss={removeToast} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}
