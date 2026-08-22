import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Paperclip, 
  Send,
  User,
  Calendar,
  AlertCircle,
  Star,
  HeartHandshake
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { ServiceRequest, RequestStatus } from '../../types/request';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { RiskBadge } from '../../components/requests/RiskBadge';
import { RequestTimeline } from '../../components/requests/RequestTimeline';
import { CustomerFeedbackModal } from '../../components/requests/CustomerFeedbackModal';
import { calculateSLAProgress, calculateResponseSLAMetrics } from '../../utils/slaCalculator';
import { getPriorityBadge, getStatusBadge, formatDateTime, formatTimeAgo } from '../../utils/formatters';

export interface ClientRequestDetailsProps {
  request: ServiceRequest;
  onNavigate: (path: string) => void;
}

export function ClientRequestDetails({ request, onNavigate }: ClientRequestDetailsProps) {
  const { addComment, submitFeedback } = useRequests();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const sla = calculateSLAProgress(request);
  const responseSla = calculateResponseSLAMetrics(request);
  const priorityMeta = getPriorityBadge(request.priority);
  const statusMeta = getStatusBadge(request.status);

  const isResolved = request.status === 'RESOLVED' || request.status === 'CLOSED';

  // Stepper milestones
  const steps: Array<{ status: RequestStatus; label: string }> = [
    { status: 'SUBMITTED', label: 'Submitted' },
    { status: 'TRIAGED', label: 'Triaged' },
    { status: 'IN_PROGRESS', label: 'In Progress' },
    { status: 'UNDER_REVIEW', label: 'Under Review' },
    { status: 'RESOLVED', label: 'Resolved' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === request.status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Back Button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/client')}
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

        <div className="flex items-center gap-3">
          {isResolved && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFeedbackOpen(true)}
              className="text-xs bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 shadow-sm"
            >
              <Star className="h-3.5 w-3.5 mr-1 fill-amber-400 text-amber-400" />
              <span>Rate Resolution Experience</span>
            </Button>
          )}
          <RiskBadge score={request.riskScore} level={request.riskLevel} size="md" />
        </div>
      </div>

      {/* Resolved Feedback Prompt Callout Banner */}
      {isResolved && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">This request has been marked as Resolved</h4>
              <p className="text-xs text-slate-400">
                Did our engineering team meet your expected SLA turnaround and quality standards?
              </p>
            </div>
          </div>
          <Button
            variant="ai-glow"
            size="sm"
            onClick={() => setIsFeedbackOpen(true)}
            className="text-xs whitespace-nowrap"
          >
            <Star className="h-3.5 w-3.5 mr-1.5 fill-amber-400 text-amber-400" />
            Give SLA Feedback
          </Button>
        </div>
      )}

      {/* SLA Progress Countdown Hero Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#111A2E] via-slate-900 to-slate-900 border border-indigo-500/30 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Resolution SLA Countdown */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>Resolution SLA Deadline</span>
          </span>
          <div className="text-2xl font-extrabold text-white font-mono">
            {sla.formattedRemaining}
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                sla.isBreached ? 'bg-rose-500 animate-pulse' : sla.status === 'AT_RISK' ? 'bg-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, sla.percentageElapsed)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Target Due: {formatDateTime(request.resolutionDueAt)}
          </p>
        </div>

        {/* Metric 2: Response SLA */}
        <div className="space-y-2 md:border-l border-slate-800 md:pl-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            First Response SLA
          </span>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono">
            {responseSla.formattedTime}
          </div>
          <p className="text-[11px] text-slate-400">
            Target: 15m Response Guarantee
          </p>
        </div>

        {/* Metric 3: Contract SLA Tier */}
        <div className="space-y-2 md:border-l border-slate-800 md:pl-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Contract Policy Tier
          </span>
          <div className="text-xl font-bold text-purple-300">
            {request.slaTier} (24x7 Dedicated)
          </div>
          <p className="text-[11px] text-slate-400">
            99.9% Uptime Commitment
          </p>
        </div>

      </div>

      {/* Interactive Milestone Stepper */}
      <Card variant="glass" className="p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Lifecycle Progress Tracker
        </h4>
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
          
          {steps.map((step, idx) => {
            const isCompleted = idx <= (currentStepIndex === -1 ? 0 : currentStepIndex);
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  } ${isCurrent ? 'ring-4 ring-indigo-500/20 scale-110' : ''}`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Content: Description and Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Description & Audit Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Request Description
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {request.description}
            </p>

            {request.attachments && request.attachments.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-400">Attached Files:</span>
                <div className="flex flex-wrap gap-2">
                  {request.attachments.map((att, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700">
                      <Paperclip className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{att.name}</span>
                      <span className="text-slate-500">({att.size})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Timeline & Conversation */}
          <Card variant="glass" className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Resolution Audit Trail & Support Thread
            </h4>
            <RequestTimeline
              events={request.timeline}
              onAddComment={msg => addComment(request.id, msg)}
              canComment={true}
            />
          </Card>
        </div>

        {/* Right 1 Col: Ticket Metadata Sidebar */}
        <div className="space-y-5">
          <Card variant="glass" className="p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Assignment & SLA Metadata
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Handling Engineer:</span>
                {request.assigneeName ? (
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700">
                    <img
                      src={request.assigneeAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80'}
                      alt={request.assigneeName}
                      className="h-8 w-8 rounded-full object-cover border border-indigo-500/40"
                    />
                    <div>
                      <h5 className="font-semibold text-white">{request.assigneeName}</h5>
                      <p className="text-[11px] text-slate-400">{request.assigneeEmail}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700 text-slate-400 italic">
                    Currently in triage assignment queue
                  </div>
                )}
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-200">{request.department}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold text-slate-200">{request.category}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Submitted:</span>
                <span className="font-mono text-slate-200">{formatDateTime(request.createdAt)}</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Last Update:</span>
                <span className="font-mono text-slate-200">{formatTimeAgo(request.updatedAt)}</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Customer Feedback Modal */}
      <CustomerFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        requestId={request.id}
        ticketNumber={request.ticketNumber}
        onSubmitFeedback={async (fbData) => {
          await submitFeedback(fbData);
        }}
      />

    </div>
  );
}
