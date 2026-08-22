import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Bell, 
  Search, 
  Plus, 
  Menu, 
  AlertTriangle,
  LogOut,
  ChevronDown,
  Lock,
  Building,
  Crown,
  DollarSign,
  BarChart3,
  User as UserIcon
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onOpenMobileMenu?: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export function Navbar({ onOpenMobileMenu, onNavigate, currentPath }: NavbarProps) {
  const { atRiskRequests } = useRequests();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isClient = user?.role === 'CLIENT';
  const isAdminOrAgent = user?.role === 'ADMIN' || user?.role === 'AGENT';

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Mobile Trigger */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div 
            onClick={() => onNavigate(isClient ? '/client' : '/admin')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:scale-105 transition">
              <Sparkles className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white text-base">SLA</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-base">
                  AI
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono font-semibold border border-indigo-500/30">
                  Pro Max
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Role-Authorized Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onNavigate(isClient ? '/client' : '/admin')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentPath === '/client' || currentPath === '/admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isClient ? 'My Requests' : 'Queue'}
          </button>

          {isAdminOrAgent && (
            <button
              onClick={() => onNavigate('/admin/at-risk')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                currentPath === '/admin/at-risk'
                  ? 'bg-rose-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <span>At-Risk Hub</span>
              {atRiskRequests.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {atRiskRequests.length}
                </span>
              )}
            </button>
          )}

          {isAdminOrAgent && (
            <button
              onClick={() => onNavigate('/admin/billing')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                currentPath === '/admin/billing'
                  ? 'bg-emerald-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>Billing & Penalties</span>
            </button>
          )}

          {isAdminOrAgent && (
            <button
              onClick={() => onNavigate('/admin/analytics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                currentPath === '/admin/analytics'
                  ? 'bg-purple-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Analytics</span>
            </button>
          )}

          {user?.role === 'ADMIN' && (
            <button
              onClick={() => onNavigate('/admin/sla-policies')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentPath === '/admin/sla-policies'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Policies
            </button>
          )}

          <button
            onClick={() => onNavigate('/')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              currentPath === '/' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Landing
          </button>
        </nav>

        {/* Right: Actions, Alerts, Secure Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Quick Create Button */}
          <Button
            size="sm"
            variant="ai-glow"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => onNavigate('/client/create')}
            className="hidden sm:inline-flex text-xs"
          >
            New Ticket
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition"
              aria-label="View notifications"
            >
              <Bell className="h-4 w-4" />
              {isAdminOrAgent && atRiskRequests.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                      SLA Telemetry Alerts ({atRiskRequests.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Live</span>
                </div>
                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {atRiskRequests.slice(0, 4).map(req => (
                    <div
                      key={req.id}
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate(isClient ? `/client/requests/${req.id}` : `/admin/requests/${req.id}`);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition text-left"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-indigo-400 font-semibold">{req.ticketNumber}</span>
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                          {req.riskScore}% Risk
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1 font-medium">{req.title}</p>
                    </div>
                  ))}
                  {atRiskRequests.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">All tickets progressing within SLA limits.</p>
                  )}
                </div>
                {isAdminOrAgent && (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('/admin/at-risk');
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Open Mitigation Hub →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Authenticated User Profile & Sign Out Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                alt={user?.name}
                className="h-7 w-7 rounded-full object-cover border border-indigo-500/40"
              />
              <div className="hidden sm:block text-left pr-1">
                <p className="text-xs font-semibold text-white leading-none">{user?.name}</p>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase leading-none">
                  {user?.role}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-fade-in space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
                  <p className="font-bold text-white">{user?.name}</p>
                  <p className="text-slate-400 truncate text-[11px]">{user?.email}</p>
                  <div className="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Organization:</span>
                    <span className="font-semibold text-slate-200">{user?.company || 'Internal Ops'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-1">
                    <span className="text-slate-400">Role:</span>
                    <span className={`font-bold uppercase px-1.5 py-0.2 rounded ${
                      user?.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 transition"
                  >
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    <span>Switch User Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition"
                  >
                    <LogOut className="h-4 w-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
