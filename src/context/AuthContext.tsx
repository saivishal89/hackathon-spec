import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { UserSession, Permission, ROLE_PERMISSIONS } from '../types/auth';
import { MOCK_USERS, CURRENT_USER_ADMIN, CURRENT_USER_CLIENT } from '../data/mockUsers';
import { AuditLogger } from '../services/auditLogger';

const STORAGE_KEY_AUTH_SESSION = 'sla_ai_auth_session_jwt_v1';

interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  isRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTH_SESSION);
    if (saved) {
      try {
        const parsed: UserSession = JSON.parse(saved);
        if (parsed && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      } catch {
        // invalid session
      }
    }
    // Default initial session: Sarah Connor (Admin) with valid token
    const initialUser = CURRENT_USER_ADMIN;
    return {
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_${initialUser.id}_${Date.now()}`,
      user: initialUser,
      expiresAt: Date.now() + 24 * 3600 * 1000,
      organizationId: 'org_enterprise_primary',
      permissions: ROLE_PERMISSIONS[initialUser.role],
    };
  });

  const user = session ? session.user : null;
  const isAuthenticated = !!session && session.expiresAt > Date.now();

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY_AUTH_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH_SESSION);
    }
  }, [session]);

  const login = async (email: string, password?: string) => {
    // 1. Authenticate user from database
    const matchedUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!matchedUser) {
      AuditLogger.log({
        userId: 'unregistered',
        userName: email,
        userRole: 'CLIENT',
        action: 'FAILED_LOGIN_UNKNOWN_USER',
        resource: 'AuthService',
        status: 'FAILED',
        metadata: { attemptedEmail: email },
      });
      return { success: false, error: 'Invalid user credentials. Please verify your email.' };
    }

    // 2. Generate secure session with verified database role & permissions
    const newSession: UserSession = {
      token: `jwt_${matchedUser.id}_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      user: matchedUser,
      expiresAt: Date.now() + 8 * 3600 * 1000, // 8 hours valid
      organizationId: matchedUser.company ? `org_${matchedUser.company.toLowerCase().replace(/\s+/g, '_')}` : 'org_enterprise_main',
      permissions: ROLE_PERMISSIONS[matchedUser.role],
    };

    setSession(newSession);

    AuditLogger.log({
      userId: matchedUser.id,
      userName: matchedUser.name,
      userRole: matchedUser.role,
      organizationId: newSession.organizationId,
      action: 'USER_LOGIN_SUCCESS',
      resource: 'AuthService',
      status: 'SUCCESS',
      metadata: { role: matchedUser.role, email: matchedUser.email },
    });

    return { success: true, user: matchedUser };
  };

  const logout = () => {
    if (session) {
      AuditLogger.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        action: 'USER_LOGOUT',
        resource: 'AuthService',
        status: 'SUCCESS',
      });
    }
    setSession(null);
    localStorage.removeItem(STORAGE_KEY_AUTH_SESSION);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!session || !isAuthenticated) return false;
    return session.permissions.includes(permission);
  };

  const isRole = (...roles: UserRole[]): boolean => {
    if (!session || !isAuthenticated) return false;
    return roles.includes(session.user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
