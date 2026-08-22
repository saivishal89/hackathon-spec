import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Activity, 
  LayoutGrid, 
  ListFilter, 
  Sparkles, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { RequestCard } from '../../components/requests/RequestCard';
import { RequestTable } from '../../components/requests/RequestTable';
import { RequestFilters } from '../../components/admin/RequestFilters';
import { ServiceRequest } from '../../types/request';

export interface ClientDashboardProps {
  onNavigate: (path: string) => void;
  onSelectRequest: (req: ServiceRequest) => void;
}

export function ClientDashboard({ onNavigate, onSelectRequest }: ClientDashboardProps) {
  const { currentUser, filteredRequests, filters, setFilters, resetFilters } = useRequests();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const activeCount = filteredRequests.filter(r => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
  const resolvedCount = filteredRequests.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Client Service Portal
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold">
              Live SLA Monitoring Active
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser.company || 'Enterprise Partner'} • Track real-time progress and SLA resolution forecasts.
          </p>
        </div>

        <Button
          variant="ai-glow"
          size="lg"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => onNavigate('/client/create')}
          className="text-xs sm:text-sm font-semibold flex-shrink-0"
        >
          Submit New Request
        </Button>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="glass" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Active Requests</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{activeCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Activity className="h-5 w-5" />
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Resolved & Closed</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{resolvedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card variant="glass" className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400">Average First Response</span>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">18 Mins</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Clock className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>My Submitted Requests</span>
            <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
              {filteredRequests.length}
            </span>
          </h3>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Data Table View"
            >
              <ListFilter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <RequestFilters
          filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
        />
      </div>

      {/* Request Display (Grid or Table) */}
      {viewMode === 'grid' ? (
        filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onClick={() => onSelectRequest(req)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <FileText className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No requests found</h4>
            <p className="text-xs text-slate-400 mt-1">Submit your first ticket using the button above.</p>
          </div>
        )
      ) : (
        <RequestTable
          requests={filteredRequests}
          onSelectRequest={onSelectRequest}
          isAdmin={false}
        />
      )}

    </div>
  );
}
