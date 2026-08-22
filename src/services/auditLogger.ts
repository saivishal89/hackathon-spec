import { AuditLogEntry } from '../types/auth';
import { User, UserRole } from '../types/user';

const STORAGE_KEY_AUDIT = 'sla_ai_audit_logs_v1';

export class AuditLogger {
  private static logs: AuditLogEntry[] = (() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  })();

  public static log(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.104 (Authenticated VPN)',
      ...entry,
    };

    this.logs = [fullEntry, ...this.logs.slice(0, 199)]; // Keep latest 200 logs
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.logs));
    } catch {
      // Storage quota safety
    }

    if (entry.status === 'FORBIDDEN') {
      console.warn(`[SECURITY AUDIT - 403 FORBIDDEN] User ${entry.userName} (${entry.userRole}) attempted unauthorized action: ${entry.action} on ${entry.resource}`);
    } else {
      console.info(`[SECURITY AUDIT - ${entry.status}] User ${entry.userName} (${entry.userRole}): ${entry.action} on ${entry.resource}`);
    }

    return fullEntry;
  }

  public static getLogs(user?: User): AuditLogEntry[] {
    // Only Admin can view full audit logs
    if (user && user.role !== 'ADMIN') {
      this.log({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'UNAUTHORIZED_VIEW_AUDIT_LOGS',
        resource: 'AuditLogs',
        status: 'FORBIDDEN',
      });
      return [];
    }
    return this.logs;
  }
}
