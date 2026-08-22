import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Sparkles, 
  AlertTriangle, 
  Send,
  User as UserIcon,
  ShieldAlert
} from 'lucide-react';
import { TimelineEvent } from '../../types/request';
import { formatDateTime, formatTimeAgo } from '../../utils/formatters';
import { Button } from '../ui/Button';

export interface RequestTimelineProps {
  events: TimelineEvent[];
  onAddComment?: (message: string) => void;
  canComment?: boolean;
}

export function RequestTimeline({ events, onAddComment, canComment = true }: RequestTimelineProps) {
  const [commentText, setCommentText] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onAddComment) return;
    onAddComment(commentText);
    setCommentText('');
  };

  const getEventIcon = (event: TimelineEvent) => {
    if (event.actor.isAi) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
          <Sparkles className="h-4 w-4" />
        </div>
      );
    }

    switch (event.type) {
      case 'status_change':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        );
      case 'comment':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <MessageSquare className="h-4 w-4" />
          </div>
        );
      case 'sla_warning':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <ShieldAlert className="h-4 w-4" />
          </div>
        );
      case 'ai_remediation':
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Sparkles className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
            <Clock className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Event Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {events.map((event, index) => (
          <div key={event.id || index} className="relative flex items-start gap-4 group">
            
            {/* Circle Node on Timeline */}
            <div className="absolute -left-6 transform -translate-x-1/2">
              {getEventIcon(event)}
            </div>

            {/* Event Box Content */}
            <div className="flex-1 rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 shadow-sm group-hover:border-slate-700 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">{event.actor.name}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                    {event.actor.role}
                  </span>
                  {event.actor.isAi && (
                    <span className="text-[10px] font-bold font-mono text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                      AI COPILOT
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {formatDateTime(event.timestamp)} ({formatTimeAgo(event.timestamp)})
                </div>
              </div>

              <h5 className="text-xs font-bold text-slate-200">{event.title}</h5>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap font-normal">
                {event.description}
              </p>
            </div>

          </div>
        ))}
      </div>

      {/* Add New Message / Comment Box */}
      {canComment && onAddComment && (
        <form onSubmit={handlePostComment} className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Type an update or comment on this ticket..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!commentText.trim()}
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Post Note
            </Button>
          </div>
        </form>
      )}

    </div>
  );
}
