import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={twMerge(
          clsx(
            'relative w-full bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all',
            maxWidthClasses[maxWidth]
          )
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
            <div>
              {title && <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>}
              {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
