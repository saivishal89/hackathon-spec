import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { RiskLevel } from '../../types/request';
import { getRiskLevelMeta } from '../../utils/formatters';

export interface RiskBadgeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function RiskBadge({ score, level, size = 'md', showLabel = true }: RiskBadgeProps) {
  const meta = getRiskLevelMeta(level);

  const icons = {
    CRITICAL: <ShieldAlert className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />,
    HIGH: <AlertTriangle className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />,
    MEDIUM: <Zap className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />,
    LOW: <ShieldCheck className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />,
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border font-mono font-bold transition-all ${meta.bg} ${meta.text} ${meta.border} ${meta.glow} ${sizeClasses[size]}`}
    >
      {icons[level]}
      <span>{score}%</span>
      {showLabel && (
        <span className="font-sans font-medium text-[10px] uppercase opacity-90 tracking-wider">
          {meta.label}
        </span>
      )}
    </div>
  );
}
