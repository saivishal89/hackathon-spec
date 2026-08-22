import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'ai-glow' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm font-medium rounded-xl gap-2',
      lg: 'px-6 py-3 text-base font-semibold rounded-xl gap-2.5',
    };

    const variantClasses = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/30 hover:border-indigo-400 active:scale-[0.98] transition-all',
      secondary:
        'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 active:scale-[0.98] transition-all',
      outline:
        'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 transition-all',
      danger:
        'bg-rose-600/90 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-500/40 active:scale-[0.98] transition-all',
      ghost:
        'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 transition-all',
      'ai-glow':
        'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 active:scale-[0.98]',
      glass:
        'bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/80 text-slate-200 border border-slate-700/60 hover:border-indigo-500/50 shadow-lg transition-all',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none cursor-pointer',
            sizeClasses[size],
            variantClasses[variant],
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
