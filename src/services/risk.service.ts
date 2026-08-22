// Risk Management & Prediction Service
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  extractRiskFeatures, 
  calculateRiskScore, 
  RiskPredictionResult, 
  RiskLevel 
} from '../risk-engine';

export class RiskService {
  /**
   * Evaluates and updates the risk prediction for a specific service request
   */
  static async evaluateRequestRisk(params: {
    requestId: string;
    createdAt: string | Date;
    deadlineAt: string | Date;
    priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
    status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed' | 'breached';
    assignedEngineerQueueCount?: number;
    maxEngineerCapacity?: number;
    hasAssignee?: boolean;
    category?: string;
  }): Promise<RiskPredictionResult> {
    // 1. Extract numerical features
    const features = extractRiskFeatures(params);

    // 2. Compute deterministic risk score
    const prediction = calculateRiskScore(features);

    // 3. Persist prediction to Supabase if connected
    if (isSupabaseConfigured() && params.requestId) {
      try {
        await supabase.from('risk_predictions').insert({
          request_id: params.requestId,
          risk_percentage: prediction.riskPercentage,
          risk_level: prediction.riskLevel,
          prediction_reason: prediction.predictionReason,
          features: prediction.factorBreakdown,
          model_version: prediction.modelVersion,
        });

        await supabase.from('requests').update({
          current_risk_percentage: prediction.riskPercentage,
          current_risk_level: prediction.riskLevel,
          prediction_reason: prediction.predictionReason,
          updated_at: new Date().toISOString(),
        }).eq('id', params.requestId);
      } catch (err) {
        console.warn('[RiskService] Supabase persistence fallback:', err);
      }
    }

    return prediction;
  }
}
