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

  /**
   * Helper to verify if session has a specific permission
   */
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

  /**
   * GET /api/requests
   * Admins/Agents get all tickets.
   * Clients ONLY get tickets belonging to their user account / organization.
   */
  public static async getRequests(session: UserSession | null): Promise<ApiResponse<ServiceRequest[]>> {
    if (!session) {
      return { status: 401, error: 'Unauthorized' };
    }

    if (session.user.role === 'ADMIN' || session.user.role === 'AGENT') {
      AuditLogger.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        action: 'FETCH_ALL_REQUESTS',
        resource: 'RequestsQueue',
        status: 'SUCCESS',
      });
      return { status: 200, data: [...this.requestsStore] };
    }

    // Client: STRICT TENANT ISOLATION
    const clientRequests = this.requestsStore.filter(
      r => r.requesterId === session.user.id || (session.user.company && r.requesterCompany === session.user.company)
    );

    AuditLogger.log({
      userId: session.user.id,
      userName: session.user.name,
      userRole: session.user.role,
      organizationId: session.organizationId,
      action: 'FETCH_SCOPED_CLIENT_REQUESTS',
      resource: 'ClientRequestsQueue',
      status: 'SUCCESS',
      metadata: { returnedCount: clientRequests.length },
    });

    return { status: 200, data: clientRequests };
  }

  /**
   * GET /api/requests/:id
   */
  public static async getRequestById(session: UserSession | null, id: string): Promise<ApiResponse<ServiceRequest>> {
    if (!session) return { status: 401, error: 'Unauthorized' };

    const req = this.requestsStore.find(r => r.id === id);
    if (!req) return { status: 404, error: 'Request not found' };

    // Tenant check if client
    if (session.user.role === 'CLIENT') {
      const isOwner = req.requesterId === session.user.id || (session.user.company && req.requesterCompany === session.user.company);
      if (!isOwner) {
        AuditLogger.log({
          userId: session.user.id,
          userName: session.user.name,
          userRole: session.user.role,
          action: 'CROSS_TENANT_READ_ATTEMPT',
          resource: `Request/${id}`,
          resourceId: id,
          status: 'FORBIDDEN',
        });
        return { status: 403, error: 'Forbidden: You do not have access to view tickets outside your organization.' };
      }
    }

    return { status: 200, data: req };
  }

  /**
   * POST /api/requests
   */
  public static async createRequest(session: UserSession | null, requestData: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    const permCheck = this.verifyPermission(session, 'CREATE_REQUEST', 'CreateRequest');
    if (permCheck) return permCheck as any;

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

    AuditLogger.log({
      userId: session!.user.id,
      userName: session!.user.name,
      userRole: session!.user.role,
      action: 'CREATE_REQUEST',
      resource: `Request/${newTicket.id}`,
      resourceId: newTicket.id,
      status: 'SUCCESS',
    });

    return { status: 201, data: newTicket };
  }

  /**
   * POST /api/admin/reassign
   * Protected: Admin / Agent only
   */
  public static async reassignRequest(session: UserSession | null, requestId: string, assigneeId: string): Promise<ApiResponse<ServiceRequest>> {
    const permCheck = this.verifyPermission(session, 'REASSIGN_REQUEST', `ReassignRequest/${requestId}`);
    if (permCheck) return permCheck as any;

    const targetUser = MOCK_USERS.find(u => u.id === assigneeId);
    if (!targetUser) return { status: 400, error: 'Target assignee not found' };

    const req = this.requestsStore.find(r => r.id === requestId);
    if (!req) return { status: 404, error: 'Request not found' };

    req.assigneeId = targetUser.id;
    req.assigneeName = targetUser.name;
    req.assigneeEmail = targetUser.email;
    req.assigneeAvatar = targetUser.avatar;
    req.updatedAt = new Date().toISOString();

    AuditLogger.log({
      userId: session!.user.id,
      userName: session!.user.name,
      userRole: session!.user.role,
      action: 'REASSIGN_ENGINEER',
      resource: `Request/${requestId}`,
      resourceId: requestId,
      status: 'SUCCESS',
      metadata: { newAssignee: targetUser.name },
    });

    localStorage.setItem('sla_ai_requests_v1', JSON.stringify(this.requestsStore));
    return { status: 200, data: req };
  }

  /**
   * PUT /api/admin/sla-policies
   * Protected: Admin only
   */
  public static async updateSLAPolicy(session: UserSession | null, policy: SLAPolicy): Promise<ApiResponse<SLAPolicy>> {
    const permCheck = this.verifyPermission(session, 'MANAGE_SLA_POLICIES', `SLAPolicy/${policy.id}`);
    if (permCheck) return permCheck as any;

    this.policiesStore = this.policiesStore.map(p => (p.id === policy.id ? policy : p));
    localStorage.setItem('sla_ai_policies_v1', JSON.stringify(this.policiesStore));

    AuditLogger.log({
      userId: session!.user.id,
      userName: session!.user.name,
      userRole: session!.user.role,
      action: 'UPDATE_SLA_POLICY',
      resource: `SLAPolicy/${policy.id}`,
      resourceId: policy.id,
      status: 'SUCCESS',
      metadata: { tier: policy.tier, name: policy.name },
    });

    return { status: 200, data: policy };
  }

  /**
   * POST /api/admin/execute-ai-action
   * Protected: Admin / Agent only
   */
  public static async executeAiAction(session: UserSession | null, requestId: string, actionId: string): Promise<ApiResponse<ServiceRequest>> {
    const permCheck = this.verifyPermission(session, 'EXECUTE_AI_REMEDIATION', `ExecuteAiAction/${requestId}`);
    if (permCheck) return permCheck as any;

    const req = this.requestsStore.find(r => r.id === requestId);
    if (!req) return { status: 404, error: 'Request not found' };

    AuditLogger.log({
      userId: session!.user.id,
      userName: session!.user.name,
      userRole: session!.user.role,
      action: 'EXECUTE_AI_AUTO_REMEDIATION',
      resource: `Request/${requestId}`,
      resourceId: requestId,
      status: 'SUCCESS',
      metadata: { actionId },
    });

    return { status: 200, data: req };
  }
}
