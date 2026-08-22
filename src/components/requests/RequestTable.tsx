import React from 'react';
import { 
  Clock, 
  ArrowUpDown, 
  ChevronRight, 
  User, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { ServiceRequest } from '../../types/request';
import { RiskBadge } from './RiskBadge';
import { calculateSLAProgress } from '../../utils/slaCalculator';
import { getPriorityBadge, getStatusBadge, getSLAStatusBadge } from '../../utils/formatters';

export interface RequestTableProps {
  requests: ServiceRequest[];
  onSelectRequest: (request: ServiceRequest) => void;
  isAdmin?: boolean;
}

export function RequestTable({ requests, onSelectRequest, isAdmin = false }: RequestTableProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <HelpCircle className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-semibold text-white">No requests matching your filters</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Try resetting the search filters or adjusting the department / risk criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4">Ticket</th>
              <th className="py-3.5 px-4">Title & Context</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">SLA Countdown</th>
              <th className="py-3.5 px-4">AI Breach Risk</th>
              <th className="py-3.5 px-4">Assignee</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {requests.map(req => {
              const sla = calculateSLAProgress(req);
              const priority = getPriorityBadge(req.priority);
              const status = getStatusBadge(req.status);
              const slaBadge = getSLAStatusBadge(sla.status);

              return (
                <tr
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  {/* Ticket # */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20 group-hover:border-indigo-400/40 transition">
                      {req.ticketNumber}
                    </span>
                  </td>

                  {/* Title & Department */}
                  <td className="py-4 px-4 max-w-xs sm:max-w-md">
                    <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {req.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400 font-medium">{req.department}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-slate-400">{req.requesterName}</span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] border ${priority.bg} ${priority.text} ${priority.border}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
                      {priority.label}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${status.bg} ${status.text} ${status.border}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* SLA Countdown & Progress */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-indigo-400" />
                        <span
                          className={`font-mono font-bold text-xs ${
                            sla.isBreached
                              ? 'text-rose-400 font-bold'
                              : sla.minutesRemaining < 60
                              ? 'text-amber-400'
                              : 'text-slate-200'
                          }`}
                        >
                          {sla.formattedRemaining}
                        </span>
                      </div>
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sla.isBreached
                              ? 'bg-rose-500'
                              : sla.status === 'AT_RISK'
                              ? 'bg-orange-500'
                              : sla.status === 'WARNING'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, sla.percentageElapsed)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Risk Score */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <RiskBadge score={req.riskScore} level={req.riskLevel} size="sm" showLabel={false} />
                  </td>

                  {/* Assignee */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {req.assigneeName ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={req.assigneeAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'}
                          alt={req.assigneeName}
                          className="h-6 w-6 rounded-full object-cover border border-slate-700"
                        />
                        <span className="text-slate-200 font-medium text-xs">{req.assigneeName}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                    )}
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                      <span>View</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
