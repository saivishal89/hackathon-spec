import React from 'react';
import { Sparkles, Info, Activity, AlertCircle, TrendingDown } from 'lucide-react';
import { RiskFactor, RiskLevel } from '../../types/request';
import { getRiskLevelMeta } from '../../utils/formatters';
import { CircularGauge } from '../ui/CircularGauge';

export interface RiskExplanationProps {
  score: number;
  level: RiskLevel;
  explanation: string;
  factors: RiskFactor[];
}

export function RiskExplanation({ score, level, explanation, factors }: RiskExplanationProps) {
  const meta = getRiskLevelMeta(level);

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-5 shadow-xl">
      
      {/* Header with Circular Radial Gauge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mt-0.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">AI Breach Risk Diagnostics</h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${meta.bg} ${meta.text} ${meta.border}`}>
                {meta.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Explainable ML Multi-Factor Assessment Engine</p>
          </div>
        </div>

        {/* Circular Animated Radial Meter */}
        <div className="flex-shrink-0">
          <CircularGauge value={score} level={level} size={88} strokeWidth={7} label="" />
        </div>
      </div>

      {/* Main Plain-English Diagnostic Summary */}
      <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-start gap-3">
        <Info className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-200 leading-relaxed font-medium">{explanation}</p>
      </div>

      {/* Factor Breakdown Bars */}
      {factors && factors.length > 0 && (
        <div className="space-y-3 pt-1">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-indigo-400" />
            <span>Weighted Risk Drivers</span>
          </h5>

          <div className="space-y-2.5">
            {factors.map(factor => {
              const impactColors = {
                critical: 'bg-rose-500 text-rose-400',
                high: 'bg-orange-500 text-orange-400',
                medium: 'bg-amber-500 text-amber-400',
                low: 'bg-emerald-500 text-emerald-400',
              };

              const percentage = Math.round(factor.weight * 100);

              return (
                <div key={factor.id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{factor.label}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        Weight: {percentage}%
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold uppercase ${impactColors[factor.impact].split(' ')[1]}`}>
                      {factor.impact}
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${impactColors[factor.impact].split(' ')[0]}`}
                      style={{ width: `${percentage * 2}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">{factor.description}</p>
                  {factor.mitigationTip && (
                    <p className="text-[11px] text-indigo-300 mt-1 font-medium flex items-center gap-1">
                      <span>💡 Mitigation:</span> {factor.mitigationTip}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
