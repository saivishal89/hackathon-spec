import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export interface ForbiddenPageProps {
  attemptedPath?: string;
  requiredRole?: string;
  onNavigate: (path: string) => void;
}

export function ForbiddenPage({ attemptedPath = '/admin', requiredRole = 'ADMIN', onNavigate }: ForbiddenPageProps) {
  const { user } = useAuth();

  const safeReturnPath = user?.role === 'CLIENT' ? '/client' : '/admin';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card variant="danger" className="max-w-lg w-full p-8 text-center space-y-6 bg-slate-950/90 border-rose-500/40 shadow-2xl">
        
        {/* Glowing Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.3)] animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <span className="font-mono text-xs font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
            HTTP 403 Forbidden
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight pt-2">
            Access Denied: Insufficient Permissions
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Your authenticated role does not possess authorization to view or execute operations on this protected endpoint.
          </p>
        </div>

        {/* Security Telemetry Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Target Resource:</span>
            <span className="text-rose-400 font-bold">{attemptedPath}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Your Current Role:</span>
            <span className="text-indigo-400 font-bold">{user?.role || 'UNAUTHENTICATED'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Required Role:</span>
            <span className="text-emerald-400 font-bold">{requiredRole}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
            <span className="text-slate-500">Security Audit ID:</span>
            <span className="text-slate-400">sec_aud_{Date.now().toString().slice(-6)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="md"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => onNavigate(safeReturnPath)}
            className="text-xs"
          >
            Return to Permitted Portal ({user?.role === 'CLIENT' ? 'Client View' : 'Admin View'})
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('/login')}
            className="text-xs"
          >
            Switch Account
          </Button>
        </div>

      </Card>
    </div>
  );
}
