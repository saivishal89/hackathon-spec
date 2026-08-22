// Feature Extraction for SLA Risk Engine
import { RiskFeatures } from './types';

/**
 * Extract numerical & contextual risk features from request metadata
 */
export function extractRiskFeatures(params: {
  createdAt: string | Date;
  deadlineAt: string | Date;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed' | 'breached';
  assignedEngineerQueueCount?: number;
  maxEngineerCapacity?: number;
  hasAssignee?: boolean;
  category?: string;
}): RiskFeatures {
  const now = Date.now();
  const createdTime = new Date(params.createdAt).getTime();
  const deadlineTime = new Date(params.deadlineAt).getTime();

  const totalDurationMinutes = Math.max(1, Math.round((deadlineTime - createdTime) / 60000));
  const elapsedMinutes = Math.max(0, Math.round((now - createdTime) / 60000));
  
  const consumedPercentage = Math.min(100, Math.max(0, (elapsedMinutes / totalDurationMinutes) * 100));

  const queueCount = params.assignedEngineerQueueCount ?? 0;
  const maxCap = Math.max(1, params.maxEngineerCapacity ?? 5);
  const queueSaturation = Math.min(100, Math.round((queueCount / maxCap) * 100));

  // Category historical baseline breach estimates
  let historicalCategoryBreachRate = 15;
  if (params.category?.toLowerCase().includes('infrastructure') || params.category?.toLowerCase().includes('database')) {
    historicalCategoryBreachRate = 35;
  } else if (params.category?.toLowerCase().includes('security') || params.category?.toLowerCase().includes('auth')) {
    historicalCategoryBreachRate = 28;
  }

  // Priority base complexity index
  let complexityScore = 5;
  if (params.priority === 'P1_CRITICAL') complexityScore = 9;
  else if (params.priority === 'P2_HIGH') complexityScore = 7;
  else if (params.priority === 'P3_MEDIUM') complexityScore = 5;
  else complexityScore = 3;

  return {
    slaElapsedMinutes: elapsedMinutes,
    slaTotalDurationMinutes: totalDurationMinutes,
    slaConsumedPercentage: consumedPercentage,
    priority: params.priority,
    status: params.status,
    assignedEngineerWorkload: queueSaturation,
    isUnassigned: !params.hasAssignee,
    technicalComplexityScore: complexityScore,
    historicalCategoryBreachRate,
    reassignmentCount: 0,
  };
}
