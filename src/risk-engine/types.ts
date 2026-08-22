// Dedicated Risk Engine Types
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskFeatures {
  slaElapsedMinutes: number;
  slaTotalDurationMinutes: number;
  slaConsumedPercentage: number;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed' | 'breached';
  assignedEngineerWorkload?: number; // 0 to 100% queue saturation
  isUnassigned?: boolean;
  technicalComplexityScore?: number; // 1 to 10
  historicalCategoryBreachRate?: number; // 0 to 100%
  reassignmentCount?: number;
}

export interface RiskPredictionResult {
  riskPercentage: number; // 0 to 100
  riskLevel: RiskLevel;
  predictionReason: string;
  factorBreakdown: {
    workloadSaturation: number; // 0 to 40%
    timelineElapsed: number; // 0 to 25%
    historicalBreachRate: number; // 0 to 20%
    resourcingStatus: number; // 0 to 15%
  };
  modelVersion: string;
  calculatedAt: string;
}

export interface RiskThresholds {
  LOW_MAX: number;      // 30
  MEDIUM_MAX: number;   // 60
  HIGH_MAX: number;     // 80
  CRITICAL_MAX: number; // 100
}
