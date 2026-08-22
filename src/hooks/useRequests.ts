import React, { useState, useEffect, useMemo, createContext, useContext, ReactNode } from 'react';
import { ServiceRequest, RequestStatus, Priority, Department, RiskLevel, RecommendedAction, TimelineEvent } from '../types/request';
import { User } from '../types/user';
import { SLAPolicy } from '../types/sla';
import { MOCK_REQUESTS } from '../data/mockRequests';
import { MOCK_USERS } from '../data/mockUsers';
import { MOCK_SLA_POLICIES } from '../data/mockSLA';
import { calculateSLAProgress } from '../utils/slaCalculator';
import { calculateDynamicRisk } from '../utils/riskCalculator';
import { ApiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AuditLogger } from '../services/auditLogger';

export interface FilterOptions {
  search: string;
  department: string;
  priority: string;
  status: string;
  riskLevel: string;
}

interface RequestsContextType {
  requests: ServiceRequest[];
  currentUser: User;
  users: User[];
  policies: SLAPolicy[];
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  filteredRequests: ServiceRequest[];
  atRiskRequests: ServiceRequest[];
  
  // User Actions
  createRequest: (newReq: Partial<ServiceRequest>) => Promise<ServiceRequest>;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => void;
  reassignRequest: (id: string, newAssigneeId: string) => Promise<boolean>;
  executeRecommendedAction: (requestId: string, actionId: string) => Promise<boolean>;
  addComment: (requestId: string, message: string) => void;
  updatePolicy: (policy: SLAPolicy) => Promise<boolean>;
  resetToMockData: () => void;
  
  // Computed Stats
  stats: {
    total: number;
    active: number;
    atRisk: number;
    breached: number;
    metSla: number;
    complianceRate: number;
    avgResolutionTimeHours: number;
    criticalPending: number;
  };
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const { session, user: authUser } = useAuth();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [users] = useState<User[]>(MOCK_USERS);
  const [policies, setPolicies] = useState<SLAPolicy[]>(() => {
    const saved = localStorage.getItem('sla_ai_policies_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch { return MOCK_SLA_POLICIES; }
    }
    return MOCK_SLA_POLICIES;
  });

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    department: 'ALL',
    priority: 'ALL',
    status: 'ALL',
    riskLevel: 'ALL',
  });

  // Fetch scoped requests via secure ApiClient on session change
  useEffect(() => {
    const fetchScopedData = async () => {
      const response = await ApiClient.getRequests(session);
      if (response.status === 200 && response.data) {
        setRequests(response.data);
      }
    };
    fetchScopedData();
  }, [session]);

  // SLA Live Interval Tick (Updates calculated progress every 15s)
  useEffect(() => {
    const timer = setInterval(() => {
      setRequests(prev => [...prev]);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const resetFilters = () => {
    setFilters({
      search: '',
      department: 'ALL',
      priority: 'ALL',
      status: 'ALL',
      riskLevel: 'ALL',
    });
  };

  const resetToMockData = () => {
    localStorage.removeItem('sla_ai_requests_v1');
    localStorage.removeItem('sla_ai_policies_v1');
    window.location.reload();
  };

  // Create Request through secure API
  const createRequest = async (newReq: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    const response = await ApiClient.createRequest(session, newReq);
    if (response.status === 201 && response.data) {
      setRequests(prev => [response.data!, ...prev]);
      return response.data;
    }
    throw new Error(response.error || 'Failed to create request');
  };

  // Update Request Status
  const updateRequestStatus = (id: string, status: RequestStatus, note?: string) => {
    const nowIso = new Date().toISOString();
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== id) return req;
        const resolvedAt = (status === 'RESOLVED' || status === 'CLOSED') ? (req.resolvedAt || nowIso) : undefined;
        
        const newTimelineEvent: TimelineEvent = {
          id: `tl-${Date.now()}`,
          timestamp: nowIso,
          title: `Status Changed to ${status.replace('_', ' ')}`,
          description: note || `Updated by ${authUser?.name || 'Authorized User'}`,
          actor: { name: authUser?.name || 'User', role: authUser?.role || 'CLIENT' },
          type: 'status_change',
        };

        return {
          ...req,
          status,
          updatedAt: nowIso,
          resolvedAt,
          timeline: [newTimelineEvent, ...req.timeline],
        };
      })
    );
  };

  // Reassign Request through secure API (RBAC protected)
  const reassignRequest = async (id: string, newAssigneeId: string): Promise<boolean> => {
    const response = await ApiClient.reassignRequest(session, id, newAssigneeId);
    if (response.status === 200 && response.data) {
      const targetUser = users.find(u => u.id === newAssigneeId);
      if (targetUser) {
        setRequests(prev =>
          prev.map(req => {
            if (req.id !== id) return req;
            const nowIso = new Date().toISOString();
            const progress = calculateSLAProgress(req);
            const { riskScore, riskLevel, riskFactors, riskExplanation } = calculateDynamicRisk(
              progress.percentageElapsed,
              req.complexityScore,
              targetUser,
              req.coAssignees?.length || 0
            );

            const event: TimelineEvent = {
              id: `tl-${Date.now()}`,
              timestamp: nowIso,
              title: `Ticket Reassigned to ${targetUser.name}`,
              description: `Workload redistributed by ${authUser?.name}. New breach risk calculated at ${riskScore}%.`,
              actor: { name: authUser?.name || 'Admin', role: authUser?.role || 'ADMIN' },
              type: 'status_change',
            };

            return {
              ...req,
              assigneeId: targetUser.id,
              assigneeName: targetUser.name,
              assigneeEmail: targetUser.email,
              assigneeAvatar: targetUser.avatar,
              updatedAt: nowIso,
              riskScore,
              riskLevel,
              riskFactors,
              riskExplanation,
              riskTrend: 'decreasing',
              timeline: [event, ...req.timeline],
            };
          })
        );
      }
      return true;
    }
    return false;
  };

  // Execute AI Recommended Action (RBAC protected)
  const executeRecommendedAction = async (requestId: string, actionId: string): Promise<boolean> => {
    const response = await ApiClient.executeAiAction(session, requestId, actionId);
    if (response.status === 200) {
      setRequests(prev =>
        prev.map(req => {
          if (req.id !== requestId) return req;
          const action = req.recommendedActions.find(a => a.id === actionId);
          if (!action) return req;

          const nowIso = new Date().toISOString();
          const reduction = action.predictedRiskReduction || 30;
          const newRiskScore = Math.max(8, req.riskScore - reduction);
          const newRiskLevel: RiskLevel = newRiskScore >= 80 ? 'CRITICAL' : newRiskScore >= 60 ? 'HIGH' : newRiskScore >= 35 ? 'MEDIUM' : 'LOW';

          let updatedAssigneeId = req.assigneeId;
          let updatedAssigneeName = req.assigneeName;
          let updatedAssigneeEmail = req.assigneeEmail;
          let updatedAssigneeAvatar = req.assigneeAvatar;

          if (action.targetAssigneeId) {
            const targetUser = users.find(u => u.id === action.targetAssigneeId);
            if (targetUser) {
              updatedAssigneeId = targetUser.id;
              updatedAssigneeName = targetUser.name;
              updatedAssigneeEmail = targetUser.email;
              updatedAssigneeAvatar = targetUser.avatar;
            }
          }

          const event: TimelineEvent = {
            id: `tl-${Date.now()}`,
            timestamp: nowIso,
            title: `AI Remediation Executed: ${action.title}`,
            description: `${action.description} Risk score lowered from ${req.riskScore}% to ${newRiskScore}%.`,
            actor: { name: 'SLA AI Engine', role: 'Automated Copilot', isAi: true },
            type: 'ai_remediation',
          };

          const updatedActions = req.recommendedActions.map(a => 
            a.id === actionId ? { ...a, isExecuted: true } : a
          );

          return {
            ...req,
            assigneeId: updatedAssigneeId,
            assigneeName: updatedAssigneeName,
            assigneeEmail: updatedAssigneeEmail,
            assigneeAvatar: updatedAssigneeAvatar,
            riskScore: newRiskScore,
            riskLevel: newRiskLevel,
            riskTrend: 'decreasing',
            updatedAt: nowIso,
            recommendedActions: updatedActions,
            timeline: [event, ...req.timeline],
          };
        })
      );
      return true;
    }
    return false;
  };

  // Add Comment
  const addComment = (requestId: string, message: string) => {
    if (!message.trim() || !authUser) return;
    setRequests(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        const nowIso = new Date().toISOString();
        const event: TimelineEvent = {
          id: `tl-${Date.now()}`,
          timestamp: nowIso,
          title: 'New Message',
          description: message,
          actor: { name: authUser.name, role: authUser.role, avatar: authUser.avatar },
          type: 'comment',
        };
        return {
          ...req,
          updatedAt: nowIso,
          timeline: [event, ...req.timeline],
        };
      })
    );
  };

  // Update SLA Policy (RBAC protected)
  const updatePolicy = async (updatedPolicy: SLAPolicy): Promise<boolean> => {
    const response = await ApiClient.updateSLAPolicy(session, updatedPolicy);
    if (response.status === 200) {
      setPolicies(prev =>
        prev.map(p => (p.id === updatedPolicy.id ? updatedPolicy : p))
      );
      return true;
    }
    return false;
  };

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          req.ticketNumber.toLowerCase().includes(q) ||
          req.title.toLowerCase().includes(q) ||
          req.description.toLowerCase().includes(q) ||
          req.department.toLowerCase().includes(q) ||
          (req.assigneeName && req.assigneeName.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Department
      if (filters.department !== 'ALL' && req.department !== filters.department) {
        return false;
      }

      // Priority
      if (filters.priority !== 'ALL' && req.priority !== filters.priority) {
        return false;
      }

      // Status
      if (filters.status !== 'ALL') {
        if (filters.status === 'ACTIVE' && (req.status === 'RESOLVED' || req.status === 'CLOSED')) return false;
        if (filters.status !== 'ACTIVE' && req.status !== filters.status) return false;
      }

      // Risk Level
      if (filters.riskLevel !== 'ALL' && req.riskLevel !== filters.riskLevel) {
        return false;
      }

      return true;
    });
  }, [requests, filters]);

  // At-Risk Requests
  const atRiskRequests = useMemo(() => {
    return requests.filter(req => {
      if (req.status === 'RESOLVED' || req.status === 'CLOSED') return false;
      const prog = calculateSLAProgress(req);
      return req.riskScore >= 60 || prog.isBreached || prog.status === 'AT_RISK' || prog.status === 'BREACHED';
    }).sort((a, b) => b.riskScore - a.riskScore);
  }, [requests]);

  // Computed Stats
  const stats = useMemo(() => {
    const total = requests.length;
    const active = requests.filter(r => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
    
    let metSla = 0;
    let breached = 0;
    let atRisk = 0;
    let criticalPending = 0;

    requests.forEach(r => {
      const prog = calculateSLAProgress(r);
      if (r.status === 'RESOLVED' || r.status === 'CLOSED') {
        if (prog.status === 'MET') metSla++;
        else breached++;
      } else {
        if (prog.isBreached || prog.status === 'BREACHED') breached++;
        else if (r.riskScore >= 60 || prog.status === 'AT_RISK') atRisk++;
        
        if (r.priority === 'P1_CRITICAL') criticalPending++;
      }
    });

    const evaluatedTickets = metSla + breached;
    const complianceRate = evaluatedTickets > 0 
      ? Math.round((metSla / evaluatedTickets) * 1000) / 10 
      : 96.8;

    return {
      total,
      active,
      atRisk,
      breached,
      metSla,
      complianceRate,
      avgResolutionTimeHours: 3.4,
      criticalPending,
    };
  }, [requests]);

  return React.createElement(
    RequestsContext.Provider,
    {
      value: {
        requests,
        currentUser: authUser || MOCK_USERS[0],
        users,
        policies,
        filters,
        setFilters,
        resetFilters,
        filteredRequests,
        atRiskRequests,
        createRequest,
        updateRequestStatus,
        reassignRequest,
        executeRecommendedAction,
        addComment,
        updatePolicy,
        resetToMockData,
        stats,
      },
    },
    children
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
}
