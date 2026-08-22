import React from 'react';
import { 
  LayoutDashboard, 
  AlertOctagon, 
  Sliders, 
  PlusCircle, 
  Activity, 
  RefreshCw,
  LogOut,
  Building,
  ShieldCheck,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { useAuth } from '../../context/AuthContext';

export interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onCloseMobileMenu?: () => void;
}

export function Sidebar({ currentPath, onNavigate, onCloseMobileMenu }: SidebarProps) {
  const { atRiskRequests, stats, resetToMockData } = useRequests();
  const { user } = useAuth();

  const isClient = user?.role === 'CLIENT';
  const isAdmin = user?.role === 'ADMIN';
  const isAgent = user?.role === 'AGENT';

  const handleNav = (path: string) => {
    onNavigate(path);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800/80 bg-[#0B0F19] flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      
      {/* Upper Navigation Sections */}
      <div className="space-y-6">
        
        {/* User Context Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
              alt={user?.name}
              className="h-10 w-10 rounded-xl object-cover border border-indigo-500/30"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-white truncate">{user?.name}</h4>
              <p className="text-[11px] text-slate-400 truncate">{user?.title || user?.email}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  isClient ? 'bg-cyan-500/10 text-cyan-300' : 'bg-purple-500/10 text-purple-300'
                }`}>
                  {user?.role} PORTAL
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client Role Navigation */}
        {isClient && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Requester Workspace
            </span>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleNav('/client')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentPath === '/client'
                    ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>My Active Requests</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                  {stats.active}
                </span>
              </button>

              <button
                onClick={() => handleNav('/client/create')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentPath === '/client/create'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <PlusCircle className="h-4 w-4 text-indigo-400" />
                <span>Submit New Ticket</span>
              </button>
            </div>
          </div>
        )}

        {/* Admin / Agent Role Navigation */}
        {(isAdmin || isAgent) && (
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Operations Center
            </span>
            <div className="mt-2 space-y-1">
              <button
                onClick={() => handleNav('/admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentPath === '/admin'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4 w-4" />
                  <span>All Queue Requests</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                  {stats.total}
                </span>
              </button>

              <button
                onClick={() => handleNav('/admin/at-risk')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentPath === '/admin/at-risk'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
                    : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="h-4 w-4 text-rose-400" />
                  <span>At-Risk Triage Hub</span>
                </div>
                {atRiskRequests.length > 0 && (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full animate-pulse">
                    {atRiskRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('/admin/billing')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentPath === '/admin/billing'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
                }`}
              >
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <span>Financial Billing</span>
              </button>

              <button
                onClick={() => handleNav('/admin/analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  currentPath === '/admin/analytics'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="h-4 w-4 text-purple-400" />
                <span>Visual Analytics</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNav('/admin/sla-policies')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    currentPath === '/admin/sla-policies'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Sliders className="h-4 w-4" />
                  <span>SLA Policy Studio</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live SLA Compliance Quick Status Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Compliance Rate</span>
            <span className="font-mono font-bold text-emerald-400">{stats.complianceRate}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.complianceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Target SLA: <span className="text-white font-medium">99.0%</span>
          </p>
        </div>

      </div>

      {/* Footer / Helper Controls */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={resetToMockData}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition"
          title="Reset database to default seed state"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Sample DB</span>
        </button>

        <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-500">
          <span>Session: Verified</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <ShieldCheck className="h-3 w-3" />
            RBAC Active
          </span>
        </div>
      </div>

    </aside>
  );
}
