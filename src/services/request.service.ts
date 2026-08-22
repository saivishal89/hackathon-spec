// Service Request Management Layer
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SLAService } from './sla.service';
import { RiskService } from './risk.service';
import { NotificationService } from './notification.service';
import { ServiceRequest } from '../types/request';

export class RequestService {
  /**
   * Creates a new service request, calculates SLA deadline, and runs initial risk prediction
   */
  static async createRequest(params: {
    title: string;
    description: string;
    priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
    category?: string;
    department?: string;
    clientId: string;
    requesterName: string;
    requesterEmail: string;
    requesterCompany?: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    const now = new Date();

    // 1. Determine SLA resolution duration
    let durationMinutes = 480; // Default P3: 8 hours
    if (params.priority === 'P1_CRITICAL') durationMinutes = 120; // 2 hours
    else if (params.priority === 'P2_HIGH') durationMinutes = 240; // 4 hours
    else if (params.priority === 'P4_LOW') durationMinutes = 1440; // 24 hours

    // 2. Calculate SLA deadline
    const deadline = SLAService.calculateDeadline(now, durationMinutes);

    // 3. Initial Risk Prediction
    const initialRisk = await RiskService.evaluateRequestRisk({
      requestId: '',
      createdAt: now,
      deadlineAt: deadline,
      priority: params.priority,
      status: 'open',
      hasAssignee: false,
      category: params.category,
    });

    const ticketNumber = `SLA-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRequest = {
      ticketNumber,
      title: params.title,
      description: params.description,
      priority: params.priority,
      status: 'SUBMITTED',
      category: params.category || 'Infrastructure',
      department: params.department || 'Core Engineering',
      createdAt: now.toISOString(),
      slaDeadline: deadline.toISOString(),
      responseDueAt: new Date(now.getTime() + 30 * 60000).toISOString(),
      resolutionDueAt: deadline.toISOString(),
      riskScore: initialRisk.riskPercentage,
      riskLevel: initialRisk.riskLevel,
      riskExplanation: initialRisk.predictionReason,
      requesterId: params.clientId,
      requesterName: params.requesterName,
      requesterEmail: params.requesterEmail,
      requesterCompany: params.requesterCompany || 'Enterprise Partner',
    };

    // 4. Persist to Supabase if connected
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('requests').insert({
          client_id: params.clientId,
          ticket_number: ticketNumber,
          title: params.title,
          description: params.description,
          priority: params.priority,
          status: 'open',
          category: params.category || 'Infrastructure',
          department: params.department || 'Core Engineering',
          sla_deadline: deadline.toISOString(),
          current_risk_percentage: initialRisk.riskPercentage,
          current_risk_level: initialRisk.riskLevel,
          prediction_reason: initialRisk.predictionReason,
        }).select().single();

        if (!error && data) {
          // Record timeline event
          await supabase.from('request_events').insert({
            request_id: data.id,
            event_type: 'request_created',
            event_data: { title: params.title, priority: params.priority },
            created_by: params.clientId,
            actor_name: params.requesterName,
            actor_role: 'CLIENT',
          });

          return { success: true, data: { ...newRequest, id: data.id } };
        }
      } catch (err: any) {
        console.warn('[RequestService] Supabase insert failed, returning local model:', err);
      }
    }

    return { success: true, data: { ...newRequest, id: `req_${Date.now()}` } };
  }
}
