import React, { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { classNames } from '../../utils/a11y';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlayClick?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { containerRef, handleKeyDown } = useFocusTrap<HTMLDivElement>({ enabled: open });

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={classNames(
          'relative z-10 w-full mx-4 bg-white rounded-lg shadow-xl',
          'p-6 focus:outline-none',
          sizeMap[size],
          className,
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id={titleId} className="text-xl font-semibold text-brand-dark">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className={classNames(
              'p-1 rounded-md text-brand-cool-grey hover:text-brand-dark',
              'focus-visible:ring-2 focus-visible:ring-focus focus:outline-none',
              'transition-colors',
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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

        {description && (
          <p id={descriptionId} className="text-sm text-brand-cool-grey mb-4">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}
