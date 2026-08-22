import React, { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: SelectOption[];
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, children, leftIcon, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            className={twMerge(
              clsx(
                'block w-full appearance-none rounded-xl border bg-slate-900/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
                error ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-700/80 focus:border-indigo-500',
                leftIcon && 'pl-10',
                className
              )
            )}
            {...props}
          >
            {options
              ? options.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-slate-900 text-slate-200">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
