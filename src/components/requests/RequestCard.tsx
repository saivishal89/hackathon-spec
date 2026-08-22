import React from 'react';
import { Clock, User, ArrowUpRight, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';
import { ServiceRequest } from '../../types/request';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RiskBadge } from './RiskBadge';
import { calculateSLAProgress } from '../../utils/slaCalculator';
import { getPriorityBadge, getStatusBadge, formatTimeAgo } from '../../utils/formatters';

export interface RequestCardProps {
  request: ServiceRequest;
  onClick: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  const sla = calculateSLAProgress(request);
  const priorityMeta = getPriorityBadge(request.priority);
  const statusMeta = getStatusBadge(request.status);

  // SLA Progress Bar Color
  let progressBarColor = 'bg-emerald-500';
  if (sla.isBreached || sla.status === 'BREACHED') {
    progressBarColor = 'bg-rose-500 animate-pulse';
  } else if (sla.status === 'AT_RISK') {
    progressBarColor = 'bg-orange-500';
  } else if (sla.status === 'WARNING') {
    progressBarColor = 'bg-amber-500';
  }

  return (
    <Card
      onClick={onClick}
      variant="interactive"
      hoverEffect
      className="p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
    >
      {/* Top Bar: Ticket #, Priority, Status, Risk */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              {request.ticketNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityMeta.bg} ${priorityMeta.text} ${priorityMeta.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priorityMeta.dot}`} />
              {priorityMeta.label}
            </span>
          </div>

          <RiskBadge score={request.riskScore} level={request.riskLevel} size="sm" showLabel={false} />
        </div>

        {/* Title & Description */}
        <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
          {request.title}
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
          {request.description}
        </p>
      </div>

      {/* SLA Live Progress Bar & Countdown */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-medium text-[11px]">SLA Target</span>
          </div>
          <span
            className={`font-mono text-xs font-bold ${
              sla.isBreached ? 'text-rose-400 font-bold' : sla.minutesRemaining < 60 ? 'text-amber-400' : 'text-slate-200'
            }`}
          >
            {sla.formattedRemaining}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
            style={{ width: `${Math.min(100, sla.percentageElapsed)}%` }}
          />
        </div>
      </div>

      {/* Footer: Department, Assignee, Time Ago */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
            {request.department}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
            {statusMeta.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {request.assigneeAvatar ? (
            <img
              src={request.assigneeAvatar}
              alt={request.assigneeName}
              title={`Assigned to ${request.assigneeName}`}
              className="h-6 w-6 rounded-full object-cover border border-indigo-500/40"
            />
          ) : (
            <span className="text-[10px] text-slate-500 italic">Unassigned</span>
          )}
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

    </Card>
  );
}
