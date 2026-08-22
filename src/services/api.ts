import { UserSession, Permission } from '../types/auth';
import { ServiceRequest, RequestStatus } from '../types/request';
import { SLAPolicy } from '../types/sla';
import { User } from '../types/user';
import { AuditLogger } from './auditLogger';
import { MOCK_REQUESTS } from '../data/mockRequests';
import { MOCK_SLA_POLICIES } from '../data/mockSLA';
import { MOCK_USERS } from '../data/mockUsers';

export interface ApiResponse<T> {
  status: 200 | 201 | 400 | 401 | 403 | 404 | 500;
  data?: T;
  error?: string;
}

export interface CustomerFeedbackData {
  requestId: string;
  rating: number;
  responseQualityRating: number;
  slaSatisfactionRating: number;
  comment: string;
}

export interface FeedbackStats {
  averageCsat: number;
  totalFeedbacks: number;
  responseQualityPercentage: number;
  slaSatisfactionPercentage: number;
  ratingDistribution: Record<number, number>;
  recentFeedbacks: any[];
}

export class ApiClient {
  private static requestsStore: ServiceRequest[] = (() => {
    const saved = localStorage.getItem('sla_ai_requests_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch { return MOCK_REQUESTS; }
    }
    return MOCK_REQUESTS;
  })();

  private static policiesStore: SLAPolicy[] = (() => {
    const saved = localStorage.getItem('sla_ai_policies_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch { return MOCK_SLA_POLICIES; }
    }
    return MOCK_SLA_POLICIES;
  })();

  private static headers(session: UserSession | null): HeadersInit {
    const hdrs: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (session?.user.id) {
      hdrs['X-User-Id'] = session.user.id;
    }
    if (session?.token) {
      hdrs['Authorization'] = `Bearer ${session.token}`;
    }
    return hdrs;
  }

  private static async backend<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(path, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...(init.headers || {}),
        },
      });
      const data = await response.json();
      return response.ok
        ? { status: response.status as ApiResponse<T>['status'], data }
        : { status: response.status as ApiResponse<T>['status'], error: data.detail || data.error || 'Backend request failed' };
    } catch {
      return { status: 500, error: 'Backend unreachable. Using client-side store.' };
    }
  }

  private static verifyPermission(session: UserSession | null, permission: Permission, resource: string): ApiResponse<null> | null {
    if (!session || !session.token) {
      AuditLogger.log({
        userId: 'anonymous',
        userName: 'Anonymous / Unauthenticated',
        userRole: 'CLIENT',
        action: 'UNAUTHENTICATED_ACCESS_ATTEMPT',
        resource,
        status: 'FORBIDDEN',
      });
      return { status: 401, error: 'Authentication Required. Please log in.' };
    }

    if (Date.now() > session.expiresAt) {
      return { status: 401, error: 'Session Expired. Please log in again.' };
    }

    if (!session.permissions.includes(permission)) {
      AuditLogger.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        organizationId: session.organizationId,
        action: `FORBIDDEN_ATTEMPT_${permission}`,
        resource,
        status: 'FORBIDDEN',
      });
      return { 
        status: 403, 
        error: `Access Denied: Role '${session.user.role}' lacks permission '${permission}' to access '${resource}'.` 
      };
    }

    return null;
  }

  // ==========================================
  // REQUEST / INCIDENT ENDPOINTS
  // ==========================================

  public static async getRequests(session: UserSession | null): Promise<ApiResponse<ServiceRequest[]>> {
    if (!session) return { status: 401, error: 'Unauthorized' };

    const backendResponse = await this.backend<ServiceRequest[]>('/api/requests', {
      headers: this.headers(session),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.requestsStore = backendResponse.data;
      localStorage.setItem('sla_ai_requests_v1', JSON.stringify(backendResponse.data));
      return backendResponse;
    }

    // Fallback to local store
    if (session.user.role === 'ADMIN' || session.user.role === 'AGENT') {
      return { status: 200, data: [...this.requestsStore] };
    }

    const clientRequests = this.requestsStore.filter(
      r => r.requesterId === session.user.id || (session.user.company && r.requesterCompany === session.user.company)
    );
    return { status: 200, data: clientRequests };
  }

  public static async getRequestById(session: UserSession | null, id: string): Promise<ApiResponse<ServiceRequest>> {
    if (!session) return { status: 401, error: 'Unauthorized' };

    const backendResponse = await this.backend<ServiceRequest>(`/api/requests/${id}`, {
      headers: this.headers(session),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      return backendResponse;
    }

    const req = this.requestsStore.find(r => r.id === id);
    if (!req) return { status: 404, error: 'Request not found' };

    if (session.user.role === 'CLIENT') {
      const isOwner = req.requesterId === session.user.id || (session.user.company && req.requesterCompany === session.user.company);
      if (!isOwner) return { status: 403, error: 'Forbidden: Organization access denied.' };
    }

    return { status: 200, data: req };
  }

  public static async createRequest(session: UserSession | null, requestData: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    const permCheck = this.verifyPermission(session, 'CREATE_REQUEST', 'CreateRequest');
    if (permCheck) return permCheck as any;

    const backendResponse = await this.backend<ServiceRequest>('/api/requests', {
      method: 'POST',
      headers: this.headers(session),
      body: JSON.stringify(requestData),
    });
    if (backendResponse.status === 201 && backendResponse.data) {
      this.requestsStore = [backendResponse.data, ...this.requestsStore];
      localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
      return backendResponse;
    }

    // Client fallback creation
    const newTicket: ServiceRequest = {
      id: `req-${Date.now()}`,
      ticketNumber: `SLA-${Math.floor(1000 + Math.random() * 9000)}`,
      title: requestData.title || 'Untitled Request',
      description: requestData.description || '',
      category: requestData.category || 'General Support',
      department: requestData.department || 'IT Infrastructure',
      priority: requestData.priority || 'P3_MEDIUM',
      status: 'SUBMITTED',
      requesterId: session!.user.id,
      requesterName: session!.user.name,
      requesterEmail: session!.user.email,
      requesterAvatar: session!.user.avatar,
      requesterCompany: session!.user.company || 'Enterprise Partner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseDueAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      resolutionDueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      slaTier: requestData.slaTier || 'PLATINUM',
      riskScore: requestData.riskScore || 20,
      riskLevel: (requestData.riskScore || 20) > 60 ? 'HIGH' : 'LOW',
      riskTrend: 'stable',
      riskExplanation: 'Ticket initialized through authenticated RBAC endpoint.',
      riskFactors: [],
      recommendedActions: [],
      complexityScore: requestData.complexityScore || 4,
      sentimentUrgency: requestData.sentimentUrgency || 'moderate',
      tags: requestData.tags || ['API_Submitted'],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Request Created (Authenticated)',
          description: `Created by ${session!.user.name} (${session!.user.role})`,
          actor: { name: session!.user.name, role: session!.user.role },
          type: 'status_change',
        }
      ]
    };

    this.requestsStore = [newTicket, ...this.requestsStore];
    localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
    return { status: 201, data: newTicket };
  }

  public static async updateRequestStatus(session: UserSession | null, requestId: string, status: RequestStatus, note?: string): Promise<ApiResponse<ServiceRequest>> {
    const backendResponse = await this.backend<ServiceRequest>(`/api/requests/${requestId}`, {
      method: 'PATCH',
      headers: this.headers(session),
      body: JSON.stringify({ status }),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.requestsStore = this.requestsStore.map(r => r.id === requestId ? backendResponse.data! : r);
      localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
      return backendResponse;
    }

    const req = this.requestsStore.find(r => r.id === requestId);
    if (!req) return { status: 404, error: 'Request not found' };

    req.status = status;
    req.updatedAt = new Date().toISOString();
    if (status === 'RESOLVED' || status === 'CLOSED') {
      req.resolvedAt = new Date().toISOString();
    }
    req.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `Status: ${status}`,
      description: note || `Updated by ${session?.user.name}`,
      actor: { name: session?.user.name || 'Admin', role: session?.user.role || 'ADMIN' },
      type: 'status_change',
    });

    localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
    return { status: 200, data: req };
  }

  public static async reassignRequest(session: UserSession | null, requestId: string, assigneeId: string): Promise<ApiResponse<ServiceRequest>> {
    const permCheck = this.verifyPermission(session, 'REASSIGN_REQUEST', `ReassignRequest/${requestId}`);
    if (permCheck) return permCheck as any;

    const backendResponse = await this.backend<ServiceRequest>(`/api/requests/${requestId}/reassign`, {
      method: 'POST',
      headers: this.headers(session),
      body: JSON.stringify({ assigneeId }),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.requestsStore = this.requestsStore.map(r => r.id === requestId ? backendResponse.data! : r);
      localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
      return backendResponse;
    }

    const targetUser = MOCK_USERS.find(u => u.id === assigneeId);
    if (!targetUser) return { status: 400, error: 'Target assignee not found' };

    const req = this.requestsStore.find(r => r.id === requestId);
    if (!req) return { status: 404, error: 'Request not found' };

    req.assigneeId = targetUser.id;
    req.assigneeName = targetUser.name;
    req.assigneeEmail = targetUser.email;
    req.assigneeAvatar = targetUser.avatar;
    req.updatedAt = new Date().toISOString();

    localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
    return { status: 200, data: req };
  }

  public static async executeAiAction(session: UserSession | null, requestId: string, actionId: string): Promise<ApiResponse<ServiceRequest>> {
    const permCheck = this.verifyPermission(session, 'EXECUTE_AI_REMEDIATION', `ExecuteAiAction/${requestId}`);
    if (permCheck) return permCheck as any;

    const backendResponse = await this.backend<ServiceRequest>(`/api/requests/${requestId}/execute-ai-action`, {
      method: 'POST',
      headers: this.headers(session),
      body: JSON.stringify({ actionId }),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.requestsStore = this.requestsStore.map(r => r.id === requestId ? backendResponse.data! : r);
      localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
      return backendResponse;
    }

    const req = this.requestsStore.find(r => r.id === requestId);
    if (!req) return { status: 404, error: 'Request not found' };

    req.riskScore = Math.max(15, (req.riskScore || 50) - 35);
    req.riskLevel = req.riskScore < 35 ? 'LOW' : 'MEDIUM';
    req.riskTrend = 'decreasing';
    req.updatedAt = new Date().toISOString();

    localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
    return { status: 200, data: req };
  }

  public static async addComment(session: UserSession | null, requestId: string, message: string): Promise<ApiResponse<ServiceRequest>> {
    const backendResponse = await this.backend<ServiceRequest>(`/api/requests/${requestId}/comments`, {
      method: 'POST',
      headers: this.headers(session),
      body: JSON.stringify({ message }),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.requestsStore = this.requestsStore.map(r => r.id === requestId ? backendResponse.data! : r);
      localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
      return backendResponse;
    }

    const req = this.requestsStore.find(r => r.id === requestId);
    if (!req) return { status: 404, error: 'Request not found' };

    req.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: `Comment from ${session?.user.name}`,
      description: message,
      actor: { name: session?.user.name || 'User', role: session?.user.role || 'CLIENT' },
      type: 'comment',
    });

    localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
    return { status: 200, data: req };
  }

  // ==========================================
  // CUSTOMER FEEDBACK LOOP ENDPOINTS
  // ==========================================

  public static async submitFeedback(session: UserSession | null, feedback: CustomerFeedbackData): Promise<ApiResponse<any>> {
    const backendResponse = await this.backend<any>('/api/feedback', {
      method: 'POST',
      headers: this.headers(session),
      body: JSON.stringify(feedback),
    });
    if (backendResponse.status === 201) {
      return backendResponse;
    }

    // Local fallback
    const saved = localStorage.getItem('sla_ai_feedbacks_v1') || '[]';
    const list = JSON.parse(saved);
    list.unshift({ ...feedback, id: `fb-${Date.now()}`, createdAt: new Date().toISOString() });
    localStorage.setItem('sla_ai_feedbacks_v1', JSON.stringify(list));

    return { status: 201, data: { success: true } };
  }

  public static async getFeedbackStats(session: UserSession | null): Promise<ApiResponse<FeedbackStats>> {
    const backendResponse = await this.backend<FeedbackStats>('/api/feedback', {
      headers: this.headers(session),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      return backendResponse;
    }

    return {
      status: 200,
      data: {
        averageCsat: 4.8,
        totalFeedbacks: 12,
        responseQualityPercentage: 94.0,
        slaSatisfactionPercentage: 91.0,
        ratingDistribution: { 5: 9, 4: 2, 3: 1, 2: 0, 1: 0 },
        recentFeedbacks: [
          {
            id: 'fb-001',
            requestId: 'req-103',
            userName: 'Alex Morgan',
            rating: 5,
            responseQualityRating: 5,
            slaSatisfactionRating: 5,
            comment: 'Outstanding response time! Elena renewed the cert without any downtime to our login services.',
            createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
          }
        ]
      }
    };
  }

  // ==========================================
  // SLA POLICY ENDPOINTS
  // ==========================================

  public static async getPolicies(session: UserSession | null): Promise<ApiResponse<SLAPolicy[]>> {
    const backendResponse = await this.backend<SLAPolicy[]>('/api/policies', {
      headers: this.headers(session),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.policiesStore = backendResponse.data;
      return backendResponse;
    }
    return { status: 200, data: [...this.policiesStore] };
  }

  public static async updateSLAPolicy(session: UserSession | null, policy: SLAPolicy): Promise<ApiResponse<SLAPolicy>> {
    const permCheck = this.verifyPermission(session, 'MANAGE_SLA_POLICIES', `SLAPolicy/${policy.id}`);
    if (permCheck) return permCheck as any;

    const backendResponse = await this.backend<SLAPolicy>(`/api/policies/${policy.id}`, {
      method: 'PUT',
      headers: this.headers(session),
      body: JSON.stringify(policy),
    });
    if (backendResponse.status === 200 && backendResponse.data) {
      this.policiesStore = this.policiesStore.map(p => p.id === policy.id ? backendResponse.data! : p);
      return backendResponse;
    }

    this.policiesStore = this.policiesStore.map(p => (p.id === policy.id ? policy : p));
    localStorage.setItem('sla_ai_policies_v1', JSON.stringify(this.policiesStore));
    return { status: 200, data: policy };
  }
}
