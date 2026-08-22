from datetime import datetime, timedelta
from typing import Dict, Any, Tuple

# Default SLA targets matrix: Tier -> Priority -> (ResponseMinutes, ResolutionHours)
SLA_TARGET_MATRIX = {
    "PLATINUM": {
        "P1_CRITICAL": (15, 2),     # 15 min response, 2 hours resolution
        "P2_HIGH": (30, 4),         # 30 min response, 4 hours resolution
        "P3_MEDIUM": (60, 12),      # 1 hr response, 12 hours resolution
        "P4_LOW": (120, 24),        # 2 hrs response, 24 hours resolution
    },
    "GOLD": {
        "P1_CRITICAL": (30, 4),
        "P2_HIGH": (60, 8),
        "P3_MEDIUM": (120, 24),
        "P4_LOW": (240, 48),
    },
    "SILVER": {
        "P1_CRITICAL": (60, 8),
        "P2_HIGH": (120, 16),
        "P3_MEDIUM": (240, 48),
        "P4_LOW": (480, 72),
    },
    "STANDARD": {
        "P1_CRITICAL": (120, 12),
        "P2_HIGH": (240, 24),
        "P3_MEDIUM": (480, 72),
        "P4_LOW": (960, 120),
    }
}

PENALTY_RATES_PER_MIN_USD = {
    "PLATINUM": 150.0,
    "GOLD": 50.0,
    "SILVER": 0.0,
    "STANDARD": 0.0,
}

class SLAEngine:
    @staticmethod
    def calculate_due_dates(
        tier: str,
        priority: str,
        start_time: datetime = None
    ) -> Tuple[datetime, datetime]:
        if start_time is None:
            start_time = datetime.utcnow()

        tier_upper = tier.upper() if tier else "PLATINUM"
        priority_upper = priority.upper() if priority else "P3_MEDIUM"

        tier_matrix = SLA_TARGET_MATRIX.get(tier_upper, SLA_TARGET_MATRIX["PLATINUM"])
        target = tier_matrix.get(priority_upper, (60, 12))

        response_minutes, resolution_hours = target

        response_due_at = start_time + timedelta(minutes=response_minutes)
        resolution_due_at = start_time + timedelta(hours=resolution_hours)

        return response_due_at, resolution_due_at

    @staticmethod
    def evaluate_sla_progress(
        created_at: datetime,
        resolution_due_at: datetime,
        status: str,
        resolved_at: datetime = None,
        now: datetime = None
    ) -> Dict[str, Any]:
        if now is None:
            now = datetime.utcnow()

        total_duration = (resolution_due_at - created_at).total_seconds()
        if total_duration <= 0:
            total_duration = 1

        is_resolved = status in ["RESOLVED", "CLOSED"]

        if is_resolved and resolved_at:
            elapsed_seconds = (resolved_at - created_at).total_seconds()
            remaining_seconds = (resolution_due_at - resolved_at).total_seconds()
        else:
            elapsed_seconds = (now - created_at).total_seconds()
            remaining_seconds = (resolution_due_at - now).total_seconds()

        percentage_elapsed = min(100.0, max(0.0, (elapsed_seconds / total_duration) * 100.0))
        is_breached = remaining_seconds < 0

        # State evaluation
        if is_resolved:
            sla_status = "MET" if not is_breached else "BREACHED"
        elif is_breached:
            sla_status = "BREACHED"
        elif percentage_elapsed >= 75.0:
            sla_status = "AT_RISK"
        elif percentage_elapsed >= 50.0:
            sla_status = "WARNING"
        else:
            sla_status = "ON_TRACK"

        # Format countdown
        abs_remaining = abs(remaining_seconds)
        hours = int(abs_remaining // 3600)
        minutes = int((abs_remaining % 3600) // 60)
        seconds = int(abs_remaining % 60)

        if is_breached:
            formatted_remaining = f"-{hours}h {minutes}m {seconds}s (BREACHED)"
        else:
            formatted_remaining = f"{hours}h {minutes}m {seconds}s remaining"

        return {
            "percentage_elapsed": round(percentage_elapsed, 1),
            "remaining_seconds": int(remaining_seconds),
            "formatted_remaining": formatted_remaining,
            "is_breached": is_breached,
            "status": sla_status,
            "total_duration_hours": round(total_duration / 3600.0, 1),
            "elapsed_hours": round(elapsed_seconds / 3600.0, 1),
        }

    @staticmethod
    def calculate_penalty_liability(
        tier: str,
        breached_minutes: float
    ) -> float:
        if breached_minutes <= 0:
            return 0.0
        rate = PENALTY_RATES_PER_MIN_USD.get(tier.upper(), 0.0)
        return round(rate * breached_minutes, 2)
