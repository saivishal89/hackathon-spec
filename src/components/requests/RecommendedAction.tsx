import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, UserPlus, ArrowUpCircle, Clock, PlayCircle } from 'lucide-react';
import { RecommendedAction as ActionType } from '../../types/request';
import { Button } from '../ui/Button';

export interface RecommendedActionProps {
  action: ActionType;
  onExecute: (actionId: string) => void;
  isLoading?: boolean;
}

export function RecommendedAction({ action, onExecute, isLoading = false }: RecommendedActionProps) {
  const [justExecuted, setJustExecuted] = useState(false);

  const getActionIcon = () => {
    switch (action.type) {
      case 'reassign':
        return <UserPlus className="h-4 w-4 text-indigo-400" />;
      case 'escalate_priority':
        return <ArrowUpCircle className="h-4 w-4 text-rose-400" />;
      case 'add_co_assignee':
        return <UserPlus className="h-4 w-4 text-purple-400" />;
      case 'extend_grace':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'trigger_playbook':
        return <PlayCircle className="h-4 w-4 text-emerald-400" />;
    }
  };

  const handleExecute = () => {
    onExecute(action.id);
    setJustExecuted(true);
  };

  const isCompleted = action.isExecuted || justExecuted;

  return (
    <div
      className={`relative p-4 rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
          : 'bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 border-indigo-500/30 hover:border-indigo-500/60 shadow-lg'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Left: Icon and Action Details */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 mt-0.5">
            {getActionIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-bold text-white tracking-tight">{action.title}</h5>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="h-2.5 w-2.5" />
                -{action.predictedRiskReduction}% Risk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{action.description}</p>
          </div>
        </div>

        {/* Right: Execute Button */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30">
              <Check className="h-4 w-4" />
              <span>Applied</span>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ai-glow"
              onClick={handleExecute}
              isLoading={isLoading}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              className="w-full sm:w-auto text-xs"
            >
              Apply AI Action
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
