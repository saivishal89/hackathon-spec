// Central Configurable Risk Thresholds
import { RiskLevel, RiskThresholds } from './types';

export const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  LOW_MAX: 30,
  MEDIUM_MAX: 60,
  HIGH_MAX: 80,
  CRITICAL_MAX: 100,
};

/**
 * Classify a risk percentage into standard RiskLevel
 */
export function classifyRiskLevel(
  percentage: number, 
  thresholds: RiskThresholds = DEFAULT_RISK_THRESHOLDS
): RiskLevel {
  const p = Math.max(0, Math.min(100, Math.round(percentage)));
  if (p <= thresholds.LOW_MAX) return 'LOW';
  if (p <= thresholds.MEDIUM_MAX) return 'MEDIUM';
  if (p <= thresholds.HIGH_MAX) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Get display badge styling and colors for a RiskLevel
 */
export function getRiskLevelBadgeProps(level: RiskLevel): {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL',
        colorClass: 'text-rose-400',
        bgClass: 'bg-rose-500/10',
        borderClass: 'border-rose-500/30',
      };
    case 'HIGH':
      return {
        label: 'HIGH RISK',
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500/30',
      };
    case 'MEDIUM':
      return {
        label: 'MODERATE',
        colorClass: 'text-indigo-400',
        bgClass: 'bg-indigo-500/10',
        borderClass: 'border-indigo-500/30',
      };
    case 'LOW':
    default:
      return {
        label: 'LOW RISK',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500/30',
      };
  }
}
