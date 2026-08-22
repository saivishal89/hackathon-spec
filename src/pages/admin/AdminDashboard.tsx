import React, { useState } from 'react';
import { 
  Activity, 
  AlertOctagon, 
  Sliders, 
  Sparkles, 
  ShieldAlert, 
  LayoutGrid, 
  ListFilter,
  Plus,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { StatsCards } from '../../components/admin/StatsCards';
import { SLAOverview } from '../../components/admin/SLAOverview';
import { RiskRanking } from '../../components/admin/RiskRanking';
import { RequestFilters } from '../../components/admin/RequestFilters';
import { RequestTable } from '../../components/requests/RequestTable';
import { RequestCard } from '../../components/requests/RequestCard';
import { Button } from '../../components/ui/Button';
import { ServiceRequest } from '../../types/request';

export interface AdminDashboardProps {
  onNavigate: (path: string) => void;
  onSelectRequest: (req: ServiceRequest) => void;
}

export function AdminDashboard({ onNavigate, onSelectRequest }: AdminDashboardProps) {
  const { 
    filteredRequests, 
    atRiskRequests, 
    stats, 
    filters, 
    setFilters, 
    resetFilters 
  } = useRequests();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const handleFilterAtRisk = () => {
    onNavigate('/admin/at-risk');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Operations Command Center
            </span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.2 rounded-full font-semibold flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              Real-Time AI Triage
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            SLA Intelligence & Operations Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Proactive ML breach prediction, engineer capacity balancing, and policy governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="danger"
            size="sm"
            leftIcon={<AlertOctagon className="h-4 w-4" />}
            onClick={() => onNavigate('/admin/at-risk')}
            className="text-xs font-semibold"
          >
            At-Risk Hub ({atRiskRequests.length})
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sliders className="h-4 w-4" />}
            onClick={() => onNavigate('/admin/sla-policies')}
            className="text-xs font-semibold"
          >
            SLA Policies
          </Button>
        </div>
      </div>

      {/* 1. Executive Stats Cards */}
      <StatsCards stats={stats} onFilterAtRisk={handleFilterAtRisk} />

      {/* 2. Top Risk Ranking & SLA Performance Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Ranking Widget (1 col) */}
        <div className="lg:col-span-1">
          <RiskRanking
            requests={filteredRequests}
            onSelectRequest={onSelectRequest}
            onOpenAtRiskHub={() => onNavigate('/admin/at-risk')}
          />
        </div>

        {/* SLA Compliance Performance Charts (2 cols) */}
        <div className="lg:col-span-2">
          <SLAOverview />
        </div>

      </div>

      {/* 3. Global Request Queue with Filters */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Global Incident & Request Queue
            </h3>
            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
              {filteredRequests.length} Total
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <ListFilter className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <RequestFilters
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />

        {/* Table or Grid */}
        {viewMode === 'table' ? (
          <RequestTable
            requests={filteredRequests}
            onSelectRequest={onSelectRequest}
            isAdmin={true}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onClick={() => onSelectRequest(req)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
