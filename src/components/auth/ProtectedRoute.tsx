import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import { Permission } from '../../types/auth';
import { ForbiddenPage } from '../../pages/ForbiddenPage';
import { AuditLogger } from '../../services/auditLogger';

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function ProtectedRoute({
  children,
  allowedRoles = ['ADMIN', 'AGENT', 'CLIENT'],
  requiredPermission,
  currentPath,
  onNavigate,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, hasPermission } = useAuth();

  // 1. Unauthenticated -> Redirect to Login
  if (!isAuthenticated || !user) {
    onNavigate('/login');
    return null;
  }

  // 2. Role Check
  const isRoleAllowed = allowedRoles.includes(user.role);

  // 3. Granular Permission Check
  const isPermissionAllowed = requiredPermission ? hasPermission(requiredPermission) : true;

  if (!isRoleAllowed || !isPermissionAllowed) {
    // Log security violation to immutable audit logger
    AuditLogger.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'UNAUTHORIZED_ROUTE_NAVIGATION',
      resource: currentPath,
      status: 'FORBIDDEN',
      metadata: { attemptedPath: currentPath, allowedRoles, requiredPermission },
    });

    return (
      <ForbiddenPage
        attemptedPath={currentPath}
        requiredRole={allowedRoles.join(' or ')}
        onNavigate={onNavigate}
      />
    );
  }

  return <>{children}</>;
}
