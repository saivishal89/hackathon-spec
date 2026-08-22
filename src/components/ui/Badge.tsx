import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline' | 'ai';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
  };

  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700/60',
    primary: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    outline: 'bg-transparent text-slate-300 border-slate-700',
    ai: 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 text-indigo-300 border-indigo-400/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]',
  };

  const dotColors = {
    default: 'bg-slate-400',
    primary: 'bg-indigo-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400 animate-pulse',
    purple: 'bg-purple-400',
    outline: 'bg-slate-400',
    ai: 'bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-wide select-none',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {dot && <span className={twMerge('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
