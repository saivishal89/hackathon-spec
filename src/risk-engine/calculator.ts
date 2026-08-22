// Deterministic Multi-Factor Risk Calculation Algorithm
import { RiskFeatures, RiskPredictionResult } from './types';
import { classifyRiskLevel } from './thresholds';

/**
 * Calculates a 0-100% breach probability and explainability narrative
 * based on 4 weighted operational factors:
 * 1. Queue Saturation & Workload (40% Weight)
 * 2. SLA Timeline Elapsed (25% Weight)
 * 3. Historical Category Breach Rate (20% Weight)
 * 4. Resourcing & Assignment Status (15% Weight)
 */
export function calculateRiskScore(features: RiskFeatures): RiskPredictionResult {
  // If already resolved or closed, risk is zero
  if (features.status === 'resolved' || features.status === 'closed') {
    return {
      riskPercentage: 0,
      riskLevel: 'LOW',
      predictionReason: 'Request is marked resolved. SLA breach risk eliminated.',
      factorBreakdown: {
        workloadSaturation: 0,
        timelineElapsed: 0,
        historicalBreachRate: 0,
        resourcingStatus: 0,
      },
      modelVersion: 'v2.0-deterministic',
      calculatedAt: new Date().toISOString(),
    };
  }

  // If already breached
  if (features.status === 'breached' || features.slaConsumedPercentage >= 100) {
    return {
      riskPercentage: 100,
      riskLevel: 'CRITICAL',
      predictionReason: 'Contractual SLA deadline has expired. Incident breached.',
      factorBreakdown: {
        workloadSaturation: 40,
        timelineElapsed: 25,
        historicalBreachRate: 20,
        resourcingStatus: 15,
      },
      modelVersion: 'v2.0-deterministic',
      calculatedAt: new Date().toISOString(),
    };
  }

  // 1. Workload Factor (Max 40 pts)
  const workload = features.assignedEngineerWorkload ?? 50;
  const workloadScore = (workload / 100) * 40;

  // 2. Timeline Elapsed Factor (Max 25 pts)
  const timelineScore = (features.slaConsumedPercentage / 100) * 25;

  // 3. Historical Category & Complexity Factor (Max 20 pts)
  const historicalScore = ((features.historicalCategoryBreachRate ?? 20) / 100) * 20;

  // 4. Assignment & Priority Factor (Max 15 pts)
  let resourcingScore = 0;
  if (features.isUnassigned) {
    resourcingScore += 10;
  }
  if (features.priority === 'P1_CRITICAL') {
    resourcingScore += 5;
  } else if (features.priority === 'P2_HIGH') {
    resourcingScore += 3;
  }

  const rawScore = workloadScore + timelineScore + historicalScore + resourcingScore;
  const finalPercentage = Math.min(99, Math.max(1, Math.round(rawScore)));
  const level = classifyRiskLevel(finalPercentage);

  // Generate clear human-readable narrative
  let reason = '';
  if (finalPercentage >= 80) {
    reason = `Critical risk: Consumed ${Math.round(features.slaConsumedPercentage)}% of SLA window with ${workload}% assigned queue saturation.`;
  } else if (finalPercentage >= 60) {
    reason = `High risk: High workload load and ${features.isUnassigned ? 'unassigned status' : 'tight SLA deadline remaining'}.`;
  } else if (finalPercentage >= 31) {
    reason = `Moderate risk: Active progress tracking with ${Math.round(100 - features.slaConsumedPercentage)}% SLA buffer remaining.`;
  } else {
    reason = `Low risk: Normal progression within operational SLA boundaries.`;
  }

  return {
    riskPercentage: finalPercentage,
    riskLevel: level,
    predictionReason: reason,
    factorBreakdown: {
      workloadSaturation: Math.round(workloadScore),
      timelineElapsed: Math.round(timelineScore),
      historicalBreachRate: Math.round(historicalScore),
      resourcingStatus: Math.round(resourcingScore),
    },
    modelVersion: 'v2.0-deterministic',
    calculatedAt: new Date().toISOString(),
  };
}
