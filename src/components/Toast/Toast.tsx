import { useEffect, useState, useCallback, useRef } from 'react';
import { classNames } from '../../utils/a11y';

export type ToastSeverity = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  message: string;
  severity?: ToastSeverity;
  duration?: number;
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const severityStyles: Record<ToastSeverity, string> = {
  info: 'bg-blue-50 border-blue-400 text-blue-800',
  success: 'bg-green-50 border-green-400 text-green-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  error: 'bg-red-50 border-red-400 text-red-800',
};

const severityIcons: Record<ToastSeverity, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

const severityLabels: Record<ToastSeverity, string> = {
  info: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

export function Toast({
  id,
  message,
  severity = 'info',
  duration = 5000,
  onDismiss,
}: ToastProps) {
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const pause = () => setPaused(true);
    const unpause = () => setPaused(false);
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', unpause);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', unpause);
    return () => {
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', unpause);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', unpause);
    };
  }, []);

  useEffect(() => {
    if (duration <= 0 || paused) return;

    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss, paused]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={classNames(
        'flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md',
        'max-w-sm w-full pointer-events-auto',
        'transition-all duration-300 ease-in-out',
        severityStyles[severity],
      )}
    >
      <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
        {severityIcons[severity]}
      </span>

      <div className="flex-1 min-w-0">
        <p className="sr-only">{severityLabels[severity]}</p>
        <p className="text-sm font-medium">{message}</p>
      </div>

      <button
        onClick={dismiss}
        aria-label={`Dismiss ${severityLabels[severity].toLowerCase()} notification`}
        className={classNames(
          'flex-shrink-0 p-0.5 rounded-md transition-colors',
          'hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-focus focus:outline-none',
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
