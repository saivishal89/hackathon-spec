import React from 'react';
import { RiskLevel } from '../../types/request';

export interface CircularGaugeProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  level?: RiskLevel;
}

export function CircularGauge({
  value,
  size = 110,
  strokeWidth = 9,
  label = 'Breach Probability',
  level,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const getGradientId = () => {
    if (clampedValue >= 80) return 'criticalGradient';
    if (clampedValue >= 60) return 'highGradient';
    if (clampedValue >= 35) return 'mediumGradient';
    return 'lowGradient';
  };

  const getTextColor = () => {
    if (clampedValue >= 80) return 'text-rose-400';
    if (clampedValue >= 60) return 'text-orange-400';
    if (clampedValue >= 35) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getGlowStyle = () => {
    if (clampedValue >= 80) return 'drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]';
    if (clampedValue >= 60) return 'drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]';
    if (clampedValue >= 35) return 'drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    return 'drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]';
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className={`transform -rotate-90 ${getGlowStyle()}`}>
        <defs>
          <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-40"
        />

        {/* Animated Progress Stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId()})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Centered Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-2xl font-extrabold font-mono tracking-tight leading-none ${getTextColor()}`}>
          {clampedValue}%
        </span>
        <span className="text-[9px] uppercase font-bold text-slate-400 mt-1 tracking-wider">
          {level || (clampedValue >= 80 ? 'CRITICAL' : clampedValue >= 60 ? 'HIGH' : clampedValue >= 35 ? 'MEDIUM' : 'LOW')}
        </span>
      </div>

      {label && <span className="text-[11px] font-semibold text-slate-400 mt-2">{label}</span>}
    </div>
  );
}
