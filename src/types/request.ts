export type Priority = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';

export type RequestStatus = 
  | 'SUBMITTED' 
  | 'TRIAGED' 
  | 'IN_PROGRESS' 
  | 'UNDER_REVIEW' 
  | 'RESOLVED' 
  | 'CLOSED';

export type Department = 
  | 'DevOps & Cloud' 
  | 'IT Infrastructure' 
  | 'Core Engineering' 
  | 'Cybersecurity' 
  | 'Billing & Finance' 
  | 'Customer Operations';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SLAMilestoneStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'BREACHED';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: {
    name: string;
    role: string;
    avatar?: string;
    isAi?: boolean;
  };
  type: 'status_change' | 'comment' | 'ai_remediation' | 'escalation' | 'sla_warning' | 'attachment';
}

export interface RiskFactor {
  id: string;
  label: string;
  weight: number; // 0 to 1
  impact: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigationTip?: string;
}

export interface RecommendedAction {
  id: string;
  type: 'reassign' | 'escalate_priority' | 'add_co_assignee' | 'extend_grace' | 'trigger_playbook';
  title: string;
  description: string;
  predictedRiskReduction: number; // e.g. 45 for dropping risk by 45%
  targetAssigneeId?: string;
  targetAssigneeName?: string;
  isExecuted?: boolean;
}

export interface ServiceRequest {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  department: Department;
  priority: Priority;
  status: RequestStatus;
  
  // Requester
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatar?: string;
  requesterCompany?: string;
  
  // Assignee
  assigneeId?: string;
  assigneeName?: string;
  assigneeEmail?: string;
  assigneeAvatar?: string;
  coAssignees?: string[];

  // SLA Timings (ISO Strings)
  createdAt: string;
  updatedAt: string;
  responseDueAt: string;
  respondedAt?: string;
  resolutionDueAt: string;
  resolvedAt?: string;
  slaTier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD';
  
  // AI Risk Intelligence
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  riskTrend: 'increasing' | 'stable' | 'decreasing';
  riskExplanation: string;
  riskFactors: RiskFactor[];
  recommendedActions: RecommendedAction[];
  
  // Complexity & Sentiment
  complexityScore: number; // 1 to 10
  sentimentUrgency: 'low' | 'moderate' | 'high' | 'critical';
  tags: string[];
  
  // History & Audit
  timeline: TimelineEvent[];
  customFields?: Record<string, string>;
  attachments?: Array<{ name: string; size: string; url?: string }>;
}
