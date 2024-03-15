let idCounter = 0;

export function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function resetIdCounter(): void {
  idCounter = 0;
}

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  'details > summary:first-of-type',
].join(', ');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
    (el) => !el.hasAttribute('disabled') && !el.closest('[hidden]'),
  );
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const region = document.createElement('div');
  region.setAttribute('role', 'status');
  region.setAttribute('aria-live', priority);
  region.setAttribute('aria-atomic', 'true');
  region.className = 'sr-only';
  Object.assign(region.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });

  document.body.appendChild(region);
  requestAnimationFrame(() => {
    region.textContent = message;
  });

  setTimeout(() => {
    document.body.removeChild(region);
  }, 1000);
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
