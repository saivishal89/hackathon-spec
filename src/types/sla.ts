import { Priority } from './request';

export type SLATier = 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD';

export interface PriorityTarget {
  priority: Priority;
  responseTimeMinutes: number;
  resolutionTimeHours: number;
  escalationWarningMinutes: number;
}

export interface SLAPolicy {
  id: string;
  name: string;
  tier: SLATier;
  description: string;
  businessHours: '24x7' | '9-to-5' | 'Custom';
  targets: PriorityTarget[];
  breachPenaltyEnabled: boolean;
  breachPenaltyPerMinuteUsd?: number;
  departmentId?: string;
  isDefault?: boolean;
}

export type SLAStatus = 'MET' | 'ON_TRACK' | 'WARNING' | 'AT_RISK' | 'BREACHED';

export interface SLAProgress {
  status: SLAStatus;
  percentageElapsed: number; // 0 to 100+
  minutesRemaining: number;
  formattedRemaining: string;
  isBreached: boolean;
  totalDurationMinutes: number;
  elapsedMinutes: number;
}

export interface DepartmentPerformance {
  department: string;
  totalRequests: number;
  metSlaCount: number;
  breachedCount: number;
  atRiskCount: number;
  complianceRate: number; // 0 to 100
  avgResolutionHours: number;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}
