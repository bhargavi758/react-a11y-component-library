import React, { useState, useCallback, useRef, useId } from 'react';
import { classNames } from '../../utils/a11y';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  defaultExpanded?: string[];
  className?: string;
  onChange?: (expandedIds: string[]) => void;
}

export function Accordion({
  items,
  multiple = false,
  defaultExpanded = [],
  className,
  onChange,
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpanded));
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const toggle = useCallback(
    (id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!multiple) next.clear();
          next.add(id);
        }
        onChange?.(Array.from(next));
        return next;
      });
    },
    [multiple, onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const enabledIndices = items
        .map((item, i) => (item.disabled ? -1 : i))
        .filter((i) => i !== -1);
      const currentEnabledIndex = enabledIndices.indexOf(index);
      if (currentEnabledIndex === -1) return;

      let targetIndex: number | undefined;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const next = currentEnabledIndex + 1;
          targetIndex = enabledIndices[next >= enabledIndices.length ? 0 : next];
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prev = currentEnabledIndex - 1;
          targetIndex = enabledIndices[prev < 0 ? enabledIndices.length - 1 : prev];
          break;
        }
        case 'Home':
          event.preventDefault();
          targetIndex = enabledIndices[0];
          break;
        case 'End':
          event.preventDefault();
          targetIndex = enabledIndices[enabledIndices.length - 1];
          break;
      }

      if (targetIndex !== undefined) {
        buttonRefs.current[targetIndex]?.focus();
      }
    },
    [items],
  );

  return (
    <div className={classNames('divide-y divide-brand-fog-dark border border-brand-fog-dark rounded-lg', className)}>
      {items.map((item, index) => {
        const isExpanded = expandedIds.has(item.id);
        const headingId = `${baseId}-heading-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id}>
            <h3>
              <button
                ref={(el) => { buttonRefs.current[index] = el; }}
                id={headingId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                aria-disabled={item.disabled}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={classNames(
                  'flex w-full items-center justify-between px-4 py-3 text-left',
                  'font-medium text-brand-dark transition-colors',
                  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus focus:outline-none',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-brand-fog cursor-pointer',
                )}
              >
                <span>{item.title}</span>
                <svg
                  className={classNames(
                    'h-5 w-5 text-brand-cool-grey transition-transform duration-200',
                    isExpanded && 'rotate-180',
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isExpanded}
              className="px-4 pb-4 pt-2 text-brand-cool-grey"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
