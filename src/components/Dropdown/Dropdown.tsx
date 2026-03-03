import React, { useState, useCallback, useRef, useEffect, useId } from 'react';
import { classNames } from '../../utils/a11y';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function Dropdown({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  placeholder = 'Select an option',
  disabled = false,
  className,
  error,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [typeaheadBuffer, setTypeaheadBuffer] = useState('');
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listboxId = `${baseId}-listbox`;
  const errorId = `${baseId}-error`;

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const selectOption = useCallback(
    (optionValue: string) => {
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [isControlled, onChange],
  );

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
    setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
  }, [disabled, options, selectedValue]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      const el = optionRefs.current[activeIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, activeIndex]);

  const handleTypeahead = useCallback(
    (char: string) => {
      if (!isOpen) return;

      clearTimeout(typeaheadTimerRef.current);
      const newBuffer = typeaheadBuffer + char.toLowerCase();
      setTypeaheadBuffer(newBuffer);

      const matchIndex = options.findIndex(
        (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(newBuffer),
      );
      if (matchIndex >= 0) {
        setActiveIndex(matchIndex);
      }

      typeaheadTimerRef.current = setTimeout(() => setTypeaheadBuffer(''), 500);
    },
    [isOpen, options, typeaheadBuffer],
  );

  const handleTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Enter':
        case ' ':
          event.preventDefault();
          openDropdown();
          break;
        case 'Escape':
          if (isOpen) {
            event.preventDefault();
            closeDropdown();
          }
          break;
      }
    },
    [openDropdown, isOpen, closeDropdown],
  );

  const handleListKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          setActiveIndex((prev) => {
            let next = prev + 1;
            while (next < options.length && options[next]?.disabled) next++;
            return next < options.length ? next : prev;
          });
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          setActiveIndex((prev) => {
            let next = prev - 1;
            while (next >= 0 && options[next]?.disabled) next--;
            return next >= 0 ? next : prev;
          });
          break;
        }
        case 'Home': {
          event.preventDefault();
          const firstEnabled = options.findIndex((opt) => !opt.disabled);
          if (firstEnabled >= 0) setActiveIndex(firstEnabled);
          break;
        }
        case 'End': {
          event.preventDefault();
          const lastEnabled = options.length - 1 - [...options].reverse().findIndex((opt) => !opt.disabled);
          if (lastEnabled >= 0 && lastEnabled < options.length) setActiveIndex(lastEnabled);
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          const active = options[activeIndex];
          if (active && !active.disabled) {
            selectOption(active.value);
          }
          break;
        }
        case 'Escape':
          event.preventDefault();
          closeDropdown();
          break;
        case 'Tab':
          closeDropdown();
          break;
        default:
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
            handleTypeahead(event.key);
          }
          break;
      }
    },
    [options, activeIndex, selectOption, closeDropdown, handleTypeahead],
  );

  return (
    <div className={classNames('relative', className)}>
      <label
        id={labelId}
        className="block text-sm font-medium text-brand-dark mb-1"
      >
        {label}
      </label>

      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? `${baseId}-option-${activeIndex}` : undefined
        }
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className={classNames(
          'w-full flex items-center justify-between px-3 py-2 border rounded-md text-left',
          'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-focus',
          disabled && 'opacity-50 cursor-not-allowed bg-brand-fog',
          error
            ? 'border-red-500'
            : 'border-brand-fog-dark hover:border-brand-cool-grey',
          !disabled && 'bg-white',
        )}
      >
        <span className={selectedOption ? 'text-brand-dark' : 'text-brand-cool-grey'}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          className={classNames(
            'h-5 w-5 text-brand-cool-grey transition-transform',
            isOpen && 'rotate-180',
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

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className={classNames(
            'absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white',
            'border border-brand-fog-dark shadow-lg py-1',
            'focus:outline-none',
          )}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => { optionRefs.current[index] = el; }}
              id={`${baseId}-option-${index}`}
              role="option"
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled}
              onClick={() => {
                if (!option.disabled) selectOption(option.value);
              }}
              onMouseEnter={() => {
                if (!option.disabled) setActiveIndex(index);
              }}
              className={classNames(
                'px-3 py-2 cursor-pointer select-none',
                index === activeIndex && 'bg-brand-fog',
                option.value === selectedValue && 'font-medium text-brand-primary',
                option.disabled && 'opacity-50 cursor-not-allowed',
                !option.disabled && index !== activeIndex && 'hover:bg-brand-fog',
              )}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
