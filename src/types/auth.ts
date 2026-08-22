import { User, UserRole } from './user';

export type Permission = 
  | 'VIEW_ALL_REQUESTS'
  | 'VIEW_OWN_REQUESTS'
  | 'CREATE_REQUEST'
  | 'MANAGE_SLA_POLICIES'
  | 'REASSIGN_REQUEST'
  | 'EXECUTE_AI_REMEDIATION'
  | 'VIEW_ADMIN_ANALYTICS'
  | 'VIEW_FINANCIAL_PENALTIES'
  | 'VIEW_AUDIT_LOGS'
  | 'CLOSE_REQUEST';

export interface UserSession {
  token: string;
  user: User;
  expiresAt: number;
  organizationId: string;
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'VIEW_ALL_REQUESTS',
    'VIEW_OWN_REQUESTS',
    'CREATE_REQUEST',
    'MANAGE_SLA_POLICIES',
    'REASSIGN_REQUEST',
    'EXECUTE_AI_REMEDIATION',
    'VIEW_ADMIN_ANALYTICS',
    'VIEW_FINANCIAL_PENALTIES',
    'VIEW_AUDIT_LOGS',
    'CLOSE_REQUEST',
  ],
  AGENT: [
    'VIEW_ALL_REQUESTS',
    'VIEW_OWN_REQUESTS',
    'CREATE_REQUEST',
    'REASSIGN_REQUEST',
    'EXECUTE_AI_REMEDIATION',
    'VIEW_ADMIN_ANALYTICS',
    'CLOSE_REQUEST',
  ],
  CLIENT: [
    'VIEW_OWN_REQUESTS',
    'CREATE_REQUEST',
    'CLOSE_REQUEST',
  ],
};

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FORBIDDEN' | 'FAILED';
  ipAddress: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}
