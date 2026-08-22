import { Priority, RequestStatus, RiskLevel } from '../types/request';
import { SLAStatus, SLATier } from '../types/sla';

/**
 * Format ISO date string into human readable date time
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  if (!isoString) return '';
  const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function getPriorityBadge(priority: Priority): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (priority) {
    case 'P1_CRITICAL':
      return {
        label: 'P1 Critical',
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
      };
    case 'P2_HIGH':
      return {
        label: 'P2 High',
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        dot: 'bg-orange-500',
      };
    case 'P3_MEDIUM':
      return {
        label: 'P3 Medium',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
      };
    case 'P4_LOW':
      return {
        label: 'P4 Low',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
  }
}

export function getStatusBadge(status: RequestStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'SUBMITTED':
      return { label: 'Submitted', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'TRIAGED':
      return { label: 'Triaged', bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' };
    case 'IN_PROGRESS':
      return { label: 'In Progress', bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' };
    case 'UNDER_REVIEW':
      return { label: 'Under Review', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'RESOLVED':
      return { label: 'Resolved', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'CLOSED':
      return { label: 'Closed', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
  }
}

export function getRiskLevelMeta(level: RiskLevel): {
  label: string;
  bg: string;
  text: string;
  border: string;
  ring: string;
  glow: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        label: 'Critical Risk',
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        ring: 'ring-rose-500/30',
        glow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]',
      };
    case 'HIGH':
      return {
        label: 'High Risk',
        bg: 'bg-orange-500/15',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
        ring: 'ring-orange-500/30',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.35)]',
      };
    case 'MEDIUM':
      return {
        label: 'Medium Risk',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
        ring: 'ring-amber-500/30',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      };
    case 'LOW':
      return {
        label: 'Low Risk',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        ring: 'ring-emerald-500/30',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      };
  }
}

export function getSLATierMeta(tier: SLATier): {
  label: string;
  badgeClass: string;
  iconName: string;
} {
  switch (tier) {
    case 'PLATINUM':
      return { label: 'Enterprise Platinum (99.9%)', badgeClass: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40', iconName: 'Crown' };
    case 'GOLD':
      return { label: 'Gold Tier (99.5%)', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40', iconName: 'Star' };
    case 'SILVER':
      return { label: 'Silver Tier (98.0%)', badgeClass: 'bg-slate-400/20 text-slate-300 border-slate-400/40', iconName: 'Shield' };
    case 'STANDARD':
      return { label: 'Standard Tier (95.0%)', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40', iconName: 'Clock' };
  }
}

export function getSLAStatusBadge(status: SLAStatus): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'MET':
      return { label: 'SLA Met', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'ON_TRACK':
      return { label: 'On Track', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'WARNING':
      return { label: 'SLA Warning', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'AT_RISK':
      return { label: 'At Risk', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
    case 'BREACHED':
      return { label: 'SLA Breached', bg: 'bg-rose-500/15', text: 'text-rose-400 font-semibold', border: 'border-rose-500/40' };
  }
}
