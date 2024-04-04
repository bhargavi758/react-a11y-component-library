import React, { useState, useCallback, useRef, useId } from 'react';
import { classNames } from '../../utils/a11y';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({
  tabs,
  defaultActiveTab,
  orientation = 'horizontal',
  onChange,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab ?? tabs[0]?.id ?? '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const activateTab = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const enabledIndices = tabs
        .map((tab, i) => (tab.disabled ? -1 : i))
        .filter((i) => i !== -1);
      const currentEnabledIndex = enabledIndices.indexOf(index);
      if (currentEnabledIndex === -1) return;

      const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

      let targetEnabledIndex: number | undefined;

      switch (event.key) {
        case nextKey:
          event.preventDefault();
          targetEnabledIndex =
            currentEnabledIndex + 1 >= enabledIndices.length ? 0 : currentEnabledIndex + 1;
          break;
        case prevKey:
          event.preventDefault();
          targetEnabledIndex =
            currentEnabledIndex - 1 < 0 ? enabledIndices.length - 1 : currentEnabledIndex - 1;
          break;
        case 'Home':
          event.preventDefault();
          targetEnabledIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          targetEnabledIndex = enabledIndices.length - 1;
          break;
      }

      if (targetEnabledIndex !== undefined) {
        const targetIndex = enabledIndices[targetEnabledIndex]!;
        const targetTab = tabs[targetIndex]!;
        tabRefs.current[targetIndex]?.focus();
        activateTab(targetTab.id);
      }
    },
    [tabs, orientation, activateTab],
  );

  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={classNames(
        isHorizontal ? 'flex flex-col' : 'flex flex-row',
        className,
      )}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        className={classNames(
          isHorizontal
            ? 'flex border-b border-stanford-fog-dark'
            : 'flex flex-col border-r border-stanford-fog-dark',
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => activateTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={classNames(
                'px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus focus:outline-none',
                isActive
                  ? isHorizontal
                    ? 'border-b-2 border-stanford-red text-stanford-red'
                    : 'border-r-2 border-stanford-red text-stanford-red bg-stanford-fog'
                  : 'text-stanford-cool-grey hover:text-stanford-black hover:bg-stanford-fog',
                tab.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          tabIndex={0}
          hidden={activeTab !== tab.id}
          className="p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
