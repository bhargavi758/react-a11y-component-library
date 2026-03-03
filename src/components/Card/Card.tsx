import React, { forwardRef } from 'react';
import { classNames } from '../../utils/a11y';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  titleAs?: 'h2' | 'h3' | 'h4';
}

export interface CardActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'between';
}

const variantStyles = {
  elevated: 'bg-white shadow-md hover:shadow-lg',
  outlined: 'bg-white border border-brand-fog-dark',
  filled: 'bg-brand-fog',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    as: Component = 'div',
    variant = 'elevated',
    interactive = false,
    href,
    onClick,
    children,
    className,
    ...props
  },
  ref,
) {
  const isClickable = interactive || !!href || !!onClick;

  const baseProps = {
    ref,
    className: classNames(
      'rounded-lg overflow-hidden transition-all duration-200',
      variantStyles[variant],
      isClickable && 'cursor-pointer focus-within:ring-2 focus-within:ring-focus',
      className,
    ),
    ...props,
  };

  if (href) {
    return (
      <Component {...baseProps}>
        <a
          href={href}
          className="block focus:outline-none"
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        >
          {children}
        </a>
      </Component>
    );
  }

  if (isClickable) {
    return (
      <Component
        {...baseProps}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.(event as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
      >
        {children}
      </Component>
    );
  }

  return <Component {...baseProps}>{children}</Component>;
});

export function CardImage({ aspectRatio = '16/9', alt = '', className, ...props }: CardImageProps) {
  const aspectMap = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  };

  return (
    <div className={classNames('overflow-hidden', aspectMap[aspectRatio])}>
      <img
        alt={alt}
        role="img"
        className={classNames('w-full h-full object-cover', className)}
        {...props}
      />
    </div>
  );
}

export function CardHeader({ title, subtitle, titleAs: TitleTag = 'h3' }: CardHeaderProps) {
  return (
    <div className="px-4 pt-4">
      <TitleTag className="text-lg font-semibold text-brand-dark">{title}</TitleTag>
      {subtitle && <p className="mt-1 text-sm text-brand-cool-grey">{subtitle}</p>}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={classNames('px-4 py-3 text-brand-cool-grey text-sm', className)}>{children}</div>;
}

export function CardActions({ children, align = 'right' }: CardActionsProps) {
  const alignStyles = {
    left: 'justify-start',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={classNames('flex items-center gap-2 px-4 pb-4', alignStyles[align])}>
      {children}
    </div>
  );
}
