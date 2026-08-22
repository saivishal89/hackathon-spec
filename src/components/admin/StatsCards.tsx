import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { Card } from '../ui/Card';

export interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    atRisk: number;
    breached: number;
    metSla: number;
    complianceRate: number;
    avgResolutionTimeHours: number;
    criticalPending: number;
  };
  onFilterAtRisk?: () => void;
}

export function StatsCards({ stats, onFilterAtRisk }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      
      {/* Card 1: Active Requests */}
      <Card variant="glass" className="p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Queue
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">{stats.active}</span>
          <span className="text-xs text-slate-400 font-medium">/ {stats.total} total</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="font-semibold">+12%</span>
          <span className="text-slate-400 font-normal">throughput this week</span>
        </div>
      </Card>

      {/* Card 2: High & Critical At-Risk */}
      <Card
        variant="glow"
        onClick={onFilterAtRisk}
        className={`p-5 relative overflow-hidden cursor-pointer transition ${
          stats.atRisk > 0 ? 'border-rose-500/40 bg-rose-950/10' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
            Imminent Breach Risk
          </span>
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-rose-400 font-mono">{stats.atRisk}</span>
          <span className="text-xs text-rose-300/80 font-medium">tickets flagged</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-rose-400 font-medium">Requires SRE triage</span>
          <span className="text-[11px] font-bold text-indigo-400 hover:underline">View All →</span>
        </div>
      </Card>

      {/* Card 3: SLA Compliance Rate */}
      <Card variant="glass" className="p-5 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            SLA Compliance
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">
            {stats.complianceRate}%
          </span>
          <span className="text-xs text-slate-400 font-medium">target 99.0%</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold">{stats.metSla} Met</span>
          <span>•</span>
          <span className="text-rose-400 font-semibold">{stats.breached} Breached</span>
        </div>
      </Card>

      {/* Card 4: AI Preempted Breaches */}
      <Card variant="glass" className="p-5 relative overflow-hidden group bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            AI Breaches Prevented
          </span>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md group-hover:scale-110 transition">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-indigo-300 font-mono">38</span>
          <span className="text-xs text-slate-400 font-medium">auto-mitigated</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-purple-300">
          <Zap className="h-3.5 w-3.5" />
          <span className="font-semibold">~$5,700 saved</span>
          <span className="text-slate-400 font-normal">in penalties</span>
        </div>
      </Card>

    </div>
  );
}
