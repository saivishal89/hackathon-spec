import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  UserPlus, 
  ArrowUpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Check, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { ServiceRequest } from '../../types/request';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RiskBadge } from '../../components/requests/RiskBadge';
import { RiskExplanation } from '../../components/requests/RiskExplanation';
import { RecommendedAction } from '../../components/requests/RecommendedAction';
import { calculateSLAProgress } from '../../utils/slaCalculator';
import { getPriorityBadge, formatDateTime, formatTimeAgo } from '../../utils/formatters';

export interface AtRiskRequestsProps {
  onNavigate: (path: string) => void;
  onSelectRequest: (req: ServiceRequest) => void;
}

export function AtRiskRequests({ onNavigate, onSelectRequest }: AtRiskRequestsProps) {
  const { atRiskRequests, executeRecommendedAction } = useRequests();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    atRiskRequests.length > 0 ? atRiskRequests[0].id : null
  );

  const activeSelectedRequest = atRiskRequests.find(r => r.id === selectedTicketId) || atRiskRequests[0];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/admin')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                Breach Risk Triage Center
              </span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.2 rounded-full font-bold animate-pulse">
                {atRiskRequests.length} High / Critical Incidents
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              SLA Pre-Breach Mitigation Hub
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Apply autonomous AI recommendations to redistribute workloads, escalate priority, and prevent SLA penalties.
            </p>
          </div>
        </div>

        {/* Penalty Exposure Badge */}
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-rose-300 uppercase">Penalty Exposure</span>
            <div className="text-sm font-extrabold text-rose-400 font-mono">
              ~$150 / min on Breached Platinum
            </div>
          </div>
        </div>
      </div>

      {atRiskRequests.length === 0 ? (
        <Card variant="glass" className="p-12 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">All SLA Targets Healthy</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no tickets with critical breach risk. The AI platform is actively monitoring all queues.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: At-Risk Ticket List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prioritized Incident Queue ({atRiskRequests.length})
              </span>
              <span className="text-[11px] text-slate-500">Sorted by Breach Probability</span>
            </div>

            <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {atRiskRequests.map(req => {
                const isSelected = activeSelectedRequest && activeSelectedRequest.id === req.id;
                const sla = calculateSLAProgress(req);
                const priority = getPriorityBadge(req.priority);

                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedTicketId(req.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500/80 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {req.ticketNumber}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priority.bg} ${priority.text} ${priority.border}`}>
                          {priority.label}
                        </span>
                      </div>
                      <RiskBadge score={req.riskScore} level={req.riskLevel} size="sm" />
                    </div>

                    <h4 className="text-xs font-semibold text-white line-clamp-1 mb-2">
                      {req.title}
                    </h4>

                    {/* SLA Progress */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="font-mono font-bold text-slate-200">
                          {sla.formattedRemaining}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {req.assigneeName || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep AI Diagnostic & Mitigation Actions (7 cols) */}
          {activeSelectedRequest && (
            <div className="lg:col-span-7 space-y-5 sticky top-20">
              
              {/* Selected Ticket Overview Card */}
              <Card variant="glow" className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {activeSelectedRequest.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-300 font-medium">
                        {activeSelectedRequest.department}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {activeSelectedRequest.title}
                    </h3>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectRequest(activeSelectedRequest)}
                    className="text-xs"
                  >
                    Open 360° View
                  </Button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSelectedRequest.description}
                </p>
              </Card>

              {/* AI Explainable Diagnostics */}
              <RiskExplanation
                score={activeSelectedRequest.riskScore}
                level={activeSelectedRequest.riskLevel}
                explanation={activeSelectedRequest.riskExplanation}
                factors={activeSelectedRequest.riskFactors}
              />

              {/* AI Recommended Mitigations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      1-Click AI Auto-Remediations
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Calculated for fastest SLA recovery
                  </span>
                </div>

                <div className="space-y-3">
                  {activeSelectedRequest.recommendedActions.map(action => (
                    <RecommendedAction
                      key={action.id}
                      action={action}
                      onExecute={actionId => executeRecommendedAction(activeSelectedRequest.id, actionId)}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
