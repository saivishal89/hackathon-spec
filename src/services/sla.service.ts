// Dedicated SLA Calculation Engine
export interface SLACalculationResult {
  totalMinutes: number;
  elapsedMinutes: number;
  remainingMinutes: number;
  consumedPercentage: number;
  isBreached: boolean;
  isWarning: boolean;
  formattedRemainingTime: string;
}

export class SLAService {
  /**
   * Calculates SLA deadline from creation time and policy duration (in minutes)
   */
  static calculateDeadline(createdAt: string | Date, durationMinutes: number): Date {
    const start = new Date(createdAt).getTime();
    return new Date(start + durationMinutes * 60 * 1000);
  }

  /**
   * Evaluates real-time SLA metrics for a request
   */
  static evaluateSLA(
    createdAt: string | Date,
    deadlineAt: string | Date,
    warningThresholdPercentage: number = 70
  ): SLACalculationResult {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const deadline = new Date(deadlineAt).getTime();

    const totalMinutes = Math.max(1, Math.round((deadline - created) / 60000));
    const elapsedMinutes = Math.max(0, Math.round((now - created) / 60000));
    const remainingMinutes = Math.round((deadline - now) / 60000);

    const consumedPercentage = Math.min(100, Math.max(0, (elapsedMinutes / totalMinutes) * 100));
    const isBreached = now >= deadline;
    const isWarning = consumedPercentage >= warningThresholdPercentage && !isBreached;

    let formattedRemainingTime = '';
    if (isBreached) {
      const overdueMinutes = Math.abs(remainingMinutes);
      const h = Math.floor(overdueMinutes / 60);
      const m = overdueMinutes % 60;
      formattedRemainingTime = `Breached by ${h > 0 ? `${h}h ` : ''}${m}m`;
    } else {
      const h = Math.floor(remainingMinutes / 60);
      const m = remainingMinutes % 60;
      formattedRemainingTime = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m remaining`;
    }

    return {
      totalMinutes,
      elapsedMinutes,
      remainingMinutes,
      consumedPercentage: Math.round(consumedPercentage),
      isBreached,
      isWarning,
      formattedRemainingTime,
    };
  }
}
