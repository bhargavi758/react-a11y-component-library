import React, { forwardRef } from 'react';
import { classNames } from '../../utils/a11y';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-white hover:bg-brand-primary-dark focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus',
  secondary:
    'bg-brand-dark text-white hover:bg-brand-warm-grey focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus',
  outline:
    'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus',
  ghost:
    'text-brand-primary hover:bg-brand-fog focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    iconLeft,
    iconRight,
    fullWidth = false,
    children,
    className,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors duration-150',
        'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && iconLeft && <span aria-hidden="true">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span aria-hidden="true">{iconRight}</span>}
      {loading && <span className="sr-only">Loading</span>}
    </button>
  );
});
