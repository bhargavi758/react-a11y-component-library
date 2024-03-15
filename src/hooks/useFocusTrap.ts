import { useEffect, useRef, useCallback } from 'react';
import { getFocusableElements } from '../utils/a11y';

interface UseFocusTrapOptions {
  enabled: boolean;
  returnFocusOnDeactivate?: boolean;
}

export function useFocusTrap<T extends HTMLElement>({
  enabled,
  returnFocusOnDeactivate = true,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    } else {
      container.setAttribute('tabindex', '-1');
      container.focus();
    }

    return () => {
      if (returnFocusOnDeactivate && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [enabled, returnFocusOnDeactivate]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!enabled || event.key !== 'Tab') return;

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [enabled],
  );

  return { containerRef, handleKeyDown };
}
