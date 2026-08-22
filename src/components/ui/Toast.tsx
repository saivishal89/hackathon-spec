import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'ai';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: Toast = { id, title, message, type };
    
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'ai':
        return <Sparkles className="h-4 w-4 text-purple-400" />;
      default:
        return <Info className="h-4 w-4 text-indigo-400" />;
    }
  };

  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/40 bg-[#0B151F]/90 shadow-emerald-500/10';
      case 'error':
        return 'border-rose-500/40 bg-[#1A0D14]/90 shadow-rose-500/10';
      case 'warning':
        return 'border-amber-500/40 bg-[#1A150B]/90 shadow-amber-500/10';
      case 'ai':
        return 'border-purple-500/40 bg-[#160E24]/90 shadow-purple-500/15';
      default:
        return 'border-indigo-500/40 bg-[#0E1326]/90 shadow-indigo-500/10';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 transform animate-fade-in flex items-start justify-between gap-3 ${getTypeStyles(
              toast.type
            )}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-slate-800/80 border border-slate-700/60 mt-0.5">
                {getIcon(toast.type)}
              </div>
              <div>
                <h5 className="text-xs font-bold text-white tracking-tight">{toast.title}</h5>
                {toast.message && (
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
