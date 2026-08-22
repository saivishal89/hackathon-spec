import React from 'react';
import { AlertOctagon, Clock, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { ServiceRequest } from '../../types/request';
import { Card } from '../ui/Card';
import { RiskBadge } from '../requests/RiskBadge';
import { calculateSLAProgress } from '../../utils/slaCalculator';

export interface RiskRankingProps {
  requests: ServiceRequest[];
  onSelectRequest: (request: ServiceRequest) => void;
  onOpenAtRiskHub?: () => void;
}

export function RiskRanking({ requests, onSelectRequest, onOpenAtRiskHub }: RiskRankingProps) {
  const sorted = [...requests]
    .filter(r => r.status !== 'RESOLVED' && r.status !== 'CLOSED')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <Card variant="glass" className="p-5 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertOctagon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Live Breach Risk Ranking</h4>
            <p className="text-xs text-slate-400">ML Heuristic Priority Queue</p>
          </div>
        </div>

        {onOpenAtRiskHub && (
          <button
            onClick={onOpenAtRiskHub}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Triage Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Ranked Tickets List */}
      <div className="space-y-2.5">
        {sorted.map((req, index) => {
          const sla = calculateSLAProgress(req);

          return (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank Number */}
                <span className={`w-5 text-center font-mono font-bold text-xs ${
                  index === 0 ? 'text-rose-400' : index === 1 ? 'text-orange-400' : 'text-slate-500'
                }`}>
                  #{index + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] font-bold text-indigo-400">
                      {req.ticketNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {req.department}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 group-hover:text-indigo-300 transition truncate">
                    {req.title}
                  </p>
                </div>
              </div>

              {/* Right: SLA remaining & Risk Badge */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <Clock className="h-3 w-3 text-indigo-400" />
                    <span className="font-mono font-semibold text-slate-200">{sla.formattedRemaining}</span>
                  </div>
                </div>
                <RiskBadge score={req.riskScore} level={req.riskLevel} size="sm" showLabel={false} />
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">
            All active tickets have low risk scores and are progressing smoothly.
          </p>
        )}
      </div>

    </Card>
  );
}
