import { useCallback } from 'react';

type KeyHandler = (event: React.KeyboardEvent) => void;

interface KeyMap {
  [key: string]: KeyHandler;
}

export function useKeyboard(keyMap: KeyMap) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const handler = keyMap[event.key];
      if (handler) {
        handler(event);
      }
    },
    [keyMap],
  );

  return { onKeyDown: handleKeyDown };
}

export function useRovingTabIndex(
  items: HTMLElement[],
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  loop = true,
) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const currentIndex = items.indexOf(event.currentTarget as HTMLElement);
      if (currentIndex === -1) return;

      const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

      let nextIndex: number | undefined;

      switch (event.key) {
        case nextKey:
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= items.length) {
            nextIndex = loop ? 0 : currentIndex;
          }
          break;
        case prevKey:
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) {
            nextIndex = loop ? items.length - 1 : currentIndex;
          }
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = items.length - 1;
          break;
      }

      if (nextIndex !== undefined) {
        items[nextIndex]?.focus();
      }
    },
    [items, orientation, loop],
  );

  return { onKeyDown: handleKeyDown };
}
