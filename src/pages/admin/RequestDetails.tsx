import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  UserPlus, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Building, 
  Calendar,
  Layers,
  Send
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { ServiceRequest, RequestStatus } from '../../types/request';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RiskBadge } from '../../components/requests/RiskBadge';
import { RiskExplanation } from '../../components/requests/RiskExplanation';
import { RecommendedAction } from '../../components/requests/RecommendedAction';
import { RequestTimeline } from '../../components/requests/RequestTimeline';
import { calculateSLAProgress, calculateResponseSLAMetrics } from '../../utils/slaCalculator';
import { getPriorityBadge, getStatusBadge, formatDateTime, formatTimeAgo } from '../../utils/formatters';

export interface AdminRequestDetailsProps {
  request: ServiceRequest;
  onNavigate: (path: string) => void;
}

export function AdminRequestDetails({ request, onNavigate }: AdminRequestDetailsProps) {
  const { users, updateRequestStatus, reassignRequest, executeRecommendedAction, addComment } = useRequests();
  const [selectedAssignee, setSelectedAssignee] = useState(request.assigneeId || '');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(request.status);

  const sla = calculateSLAProgress(request);
  const responseSla = calculateResponseSLAMetrics(request);
  const priorityMeta = getPriorityBadge(request.priority);
  const statusMeta = getStatusBadge(request.status);

  const handleStatusChange = (newStatus: RequestStatus) => {
    setSelectedStatus(newStatus);
    updateRequestStatus(request.id, newStatus);
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    setSelectedAssignee(newAssigneeId);
    reassignRequest(request.id, newAssigneeId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Back and Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/admin')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                {request.ticketNumber}
              </span>
              <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityMeta.bg} ${priorityMeta.text} ${priorityMeta.border}`}>
                {priorityMeta.label}
              </span>
              <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                {statusMeta.label}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{request.title}</h2>
          </div>
        </div>

        <RiskBadge score={request.riskScore} level={request.riskLevel} size="md" />
      </div>

      {/* SLA Live Telemetry Strip */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Resolution SLA Window
          </span>
          <div className="text-xl font-extrabold text-white font-mono mt-1">
            {sla.formattedRemaining}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full ${
                sla.isBreached ? 'bg-rose-500' : sla.status === 'AT_RISK' ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, sla.percentageElapsed)}%` }}
            />
          </div>
        </div>

        <div className="sm:border-l border-slate-800 sm:pl-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            First Response SLA
          </span>
          <div className="text-xl font-bold text-indigo-300 font-mono mt-1">
            {responseSla.formattedTime}
          </div>
        </div>

        <div className="sm:border-l border-slate-800 sm:pl-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            SLA Policy Tier
          </span>
          <div className="text-lg font-bold text-purple-300 mt-1">
            {request.slaTier} Tier
          </div>
        </div>

        <div className="sm:border-l border-slate-800 sm:pl-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Breach Risk Level
          </span>
          <div className="text-lg font-bold text-rose-400 mt-1">
            {request.riskLevel} ({request.riskScore}%)
          </div>
        </div>
      </div>

      {/* Main Grid: Ticket Details, AI Diagnostics, Timeline, Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Details & Timeline */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Incident Description */}
          <Card variant="glass" className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Incident Context & Technical Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
              {request.description}
            </p>

            {request.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {request.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {/* AI Recommended Mitigations */}
          {request.recommendedActions && request.recommendedActions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  AI Remediation Strategies
                </h4>
              </div>
              <div className="space-y-3">
                {request.recommendedActions.map(action => (
                  <RecommendedAction
                    key={action.id}
                    action={action}
                    onExecute={actionId => executeRecommendedAction(request.id, actionId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Audit History & Internal Notes */}
          <Card variant="glass" className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Audit Timeline & Engineer Collaboration
            </h4>
            <RequestTimeline
              events={request.timeline}
              onAddComment={msg => addComment(request.id, msg)}
              canComment={true}
            />
          </Card>
        </div>

        {/* Right 5 Columns: Operations Control Panel & AI Diagnostics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Triage Action Panel */}
          <Card variant="glow" className="p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              Operations Control Panel
            </h4>

            {/* Change Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Ticket Status
              </label>
              <select
                value={selectedStatus}
                onChange={e => handleStatusChange(e.target.value as RequestStatus)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="TRIAGED">TRIAGED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Reassign Engineer */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Assigned Engineer
              </label>
              <select
                value={selectedAssignee}
                onChange={e => handleAssigneeChange(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Unassigned --</option>
                {users.filter(u => u.role !== 'CLIENT').map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department} • {user.activeTicketsCount}/{user.maxCapacity} load)
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* AI Explainable Risk Diagnostics */}
          <RiskExplanation
            score={request.riskScore}
            level={request.riskLevel}
            explanation={request.riskExplanation}
            factors={request.riskFactors}
          />

          {/* Requester & SLA Metadata */}
          <Card variant="glass" className="p-5 space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Requester Profile
            </h4>
            <div className="flex items-center gap-3">
              <img
                src={request.requesterAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'}
                alt={request.requesterName}
                className="h-9 w-9 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h5 className="font-semibold text-white">{request.requesterName}</h5>
                <p className="text-[11px] text-slate-400">{request.requesterEmail}</p>
                <p className="text-[11px] text-indigo-400 font-medium">{request.requesterCompany}</p>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
