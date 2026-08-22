import { ServiceRequest } from '../types/request';
import { SLAProgress, SLAStatus } from '../types/sla';

/**
 * Calculates real-time SLA metrics for a service request
 */
export function calculateSLAProgress(
  request: ServiceRequest,
  referenceDate: Date = new Date()
): SLAProgress {
  const createdAt = new Date(request.createdAt).getTime();
  const resolutionDueAt = new Date(request.resolutionDueAt).getTime();
  const now = referenceDate.getTime();

  // If request is resolved, calculate based on resolvedAt
  const effectiveEnd = request.resolvedAt ? new Date(request.resolvedAt).getTime() : now;
  
  const totalDurationMs = resolutionDueAt - createdAt;
  const elapsedMs = Math.max(0, effectiveEnd - createdAt);
  const remainingMs = resolutionDueAt - now;

  const totalDurationMinutes = Math.max(1, Math.round(totalDurationMs / (1000 * 60)));
  const elapsedMinutes = Math.round(elapsedMs / (1000 * 60));
  const minutesRemaining = Math.round(remainingMs / (1000 * 60));

  const percentageElapsed = Math.min(
    200,
    Math.round((elapsedMs / (totalDurationMs || 1)) * 100)
  );

  const isBreached = minutesRemaining <= 0 && request.status !== 'RESOLVED' && request.status !== 'CLOSED';
  const isResolvedMet = (request.status === 'RESOLVED' || request.status === 'CLOSED') &&
    (request.resolvedAt ? new Date(request.resolvedAt).getTime() <= resolutionDueAt : true);

  let status: SLAStatus = 'ON_TRACK';

  if (request.status === 'RESOLVED' || request.status === 'CLOSED') {
    status = isResolvedMet ? 'MET' : 'BREACHED';
  } else if (isBreached) {
    status = 'BREACHED';
  } else if (percentageElapsed >= 85 || request.riskScore >= 75) {
    status = 'AT_RISK';
  } else if (percentageElapsed >= 65 || request.riskScore >= 50) {
    status = 'WARNING';
  } else {
    status = 'ON_TRACK';
  }

  // Format remaining time readable
  const formattedRemaining = formatRemainingTime(minutesRemaining, isBreached, request.status);

  return {
    status,
    percentageElapsed,
    minutesRemaining,
    formattedRemaining,
    isBreached,
    totalDurationMinutes,
    elapsedMinutes,
  };
}

function formatRemainingTime(minutes: number, isBreached: boolean, status: string): string {
  if (status === 'RESOLVED' || status === 'CLOSED') {
    return 'Completed';
  }

  if (isBreached || minutes <= 0) {
    const overdueMins = Math.abs(minutes);
    if (overdueMins < 60) return `${overdueMins}m overdue`;
    const hours = Math.floor(overdueMins / 60);
    const mins = overdueMins % 60;
    return `${hours}h ${mins}m overdue`;
  }

  if (minutes < 60) {
    return `${minutes}m remaining`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (hours < 24) {
    return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''} remaining`;
  }
  const days = Math.floor(hours / 24);
  const leftoverHours = hours % 24;
  return `${days}d ${leftoverHours}h remaining`;
}

/**
 * Calculates response SLA metrics (initial reply)
 */
export function calculateResponseSLAMetrics(request: ServiceRequest): {
  isResponded: boolean;
  isResponseBreached: boolean;
  minutesRemaining: number;
  formattedTime: string;
} {
  const createdAt = new Date(request.createdAt).getTime();
  const responseDueAt = new Date(request.responseDueAt).getTime();
  const now = Date.now();

  const isResponded = !!request.respondedAt;
  const targetEnd = request.respondedAt ? new Date(request.respondedAt).getTime() : now;
  const isResponseBreached = targetEnd > responseDueAt;
  const minutesRemaining = Math.round((responseDueAt - now) / (1000 * 60));

  let formattedTime = '';
  if (isResponded) {
    const diff = Math.round((new Date(request.respondedAt!).getTime() - createdAt) / (1000 * 60));
    formattedTime = `Responded in ${diff}m`;
  } else if (minutesRemaining <= 0) {
    formattedTime = `${Math.abs(minutesRemaining)}m overdue`;
  } else {
    formattedTime = `${minutesRemaining}m to respond`;
  }

  return {
    isResponded,
    isResponseBreached,
    minutesRemaining,
    formattedTime,
  };
}
