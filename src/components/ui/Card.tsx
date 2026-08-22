import React, { HTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'glow' | 'danger' | 'interactive';
  hoverEffect?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverEffect = false, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-[#111827]/80 border-slate-800/80 shadow-lg shadow-black/40',
      glass: 'bg-slate-900/60 backdrop-blur-xl border-slate-800/60 shadow-xl shadow-black/30',
      glow: 'bg-[#111827]/90 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
      danger: 'bg-rose-950/20 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      interactive: 'bg-[#111827]/70 hover:bg-[#151f33] border-slate-800 hover:border-indigo-500/40 cursor-pointer shadow-lg',
    };

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            'rounded-2xl border transition-all duration-200 overflow-hidden',
            variantStyles[variant],
            hoverEffect && 'hover:translate-y-[-2px] hover:shadow-indigo-500/10 hover:shadow-2xl',
            className
          )
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('p-5 border-b border-slate-800/60 flex items-center justify-between', className))} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('p-5', className))} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('p-5 pt-0 border-t border-slate-800/60 mt-4', className))} {...props}>
      {children}
    </div>
  );
}
