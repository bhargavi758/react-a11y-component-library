import React from 'react';
import { classNames } from '../../utils/a11y';

export interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to main content',
  className,
}: SkipLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.removeAttribute('tabindex');
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={classNames(
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-2 focus:left-2 focus:z-[100]',
        'focus:inline-block focus:px-4 focus:py-2',
        'focus:bg-stanford-red focus:text-white focus:font-semibold',
        'focus:rounded-md focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus',
        'transition-none',
        className,
      )}
    >
      {children}
    </a>
  );
}
