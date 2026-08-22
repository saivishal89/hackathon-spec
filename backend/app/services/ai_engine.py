from typing import Dict, Any, List
from app.config import settings

class AIEngine:
    @staticmethod
    def pre_triage_text(
        title: str,
        description: str,
        category: str = "General Support"
    ) -> Dict[str, Any]:
        combined = f"{title} {description} {category}".lower()

        critical_keywords = ["outage", "down", "production", "data loss", "security breach", "vulnerability", "p0", "blocked all users", "crash"]
        high_keywords = ["urgent", "error", "failed", "timeout", "database", "slow", "cannot deploy", "billing error", "payment", "revenue"]
        medium_keywords = ["bug", "issue", "glitch", "feature", "configuration", "upgrade", "access", "permission", "sync"]

        found_critical = [k for k in critical_keywords if k in combined]
        found_high = [k for k in high_keywords if k in combined]
        found_medium = [k for k in medium_keywords if k in combined]

        if found_critical:
            suggested_priority = "P1_CRITICAL"
            sentiment_urgency = "critical"
            complexity_score = min(10, 7 + len(found_critical))
            estimated_resolution_hours = 2.0
            predicted_breach_risk = 68.0
        elif found_high or len(combined) > 400:
            suggested_priority = "P2_HIGH"
            sentiment_urgency = "high"
            complexity_score = min(8, 5 + len(found_high))
            estimated_resolution_hours = 5.0
            predicted_breach_risk = 44.0
        elif found_medium:
            suggested_priority = "P3_MEDIUM"
            sentiment_urgency = "moderate"
            complexity_score = 4
            estimated_resolution_hours = 12.0
            predicted_breach_risk = 18.0
        else:
            suggested_priority = "P4_LOW"
            sentiment_urgency = "low"
            complexity_score = 2
            estimated_resolution_hours = 24.0
            predicted_breach_risk = 8.0

        # Suggested department
        suggested_department = "IT Infrastructure"
        if any(w in combined for w in ["deploy", "k8s", "cloud", "aws", "pipeline", "ingress"]):
            suggested_department = "DevOps & Cloud"
        elif any(w in combined for w in ["security", "vulnerability", "auth", "cert", "compliance", "mfa"]):
            suggested_department = "Cybersecurity"
        elif any(w in combined for w in ["invoice", "refund", "credit card", "billing", "subscription", "price"]):
            suggested_department = "Billing & Finance"
        elif any(w in combined for w in ["api", "backend", "frontend", "database", "sql", "code"]):
            suggested_department = "Core Engineering"
        elif any(w in combined for w in ["account", "onboarding", "client", "user"]):
            suggested_department = "Customer Operations"

        detected_keywords = list(dict.fromkeys(found_critical + found_high + found_medium))[:6]

        return {
            "suggestedPriority": suggested_priority,
            "estimatedResolutionHours": estimated_resolution_hours,
            "complexityScore": complexity_score,
            "sentimentUrgency": sentiment_urgency,
            "predictedBreachRisk": predicted_breach_risk,
            "detectedKeywords": detected_keywords,
            "suggestedDepartment": suggested_department,
        }

    @staticmethod
    def calculate_risk(
        elapsed_percentage: float,
        complexity_score: int,
        assignee_name: str = None,
        co_assignee_count: int = 0,
        priority: str = "P3_MEDIUM"
    ) -> Dict[str, Any]:
        # 1. Elapsed SLA time factor (40% weight)
        time_factor = (elapsed_percentage / 100.0) * 40.0

        # 2. Complexity factor (20% weight)
        complexity_factor = (complexity_score / 10.0) * 20.0

        # 3. Workload / Engineer queue factor (25% weight)
        if not assignee_name:
            workload_factor = 25.0  # High risk if unassigned
        else:
            workload_factor = 14.0

        # 4. Mitigation / Co-responder factor (15% weight)
        if co_assignee_count > 0:
            resource_factor = 2.0  # Low risk when backed by team
        else:
            resource_factor = 12.0

        total_risk = round(min(99.0, max(5.0, time_factor + complexity_factor + workload_factor + resource_factor)), 1)

        # Risk Level
        if total_risk >= 80.0:
            risk_level = "CRITICAL"
        elif total_risk >= 60.0:
            risk_level = "HIGH"
        elif total_risk >= 35.0:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Explainable Root-Cause Breakdown
        risk_factors: List[Dict[str, Any]] = [
            {
                "id": "rf-time",
                "label": "SLA Timeline Elapsed",
                "weight": 0.40,
                "impact": "critical" if elapsed_percentage > 75 else "high" if elapsed_percentage > 50 else "low",
                "description": f"{round(elapsed_percentage, 1)}% of contracted SLA window has passed.",
                "mitigationTip": "Expedite current phase or request maintenance extension.",
            },
            {
                "id": "rf-complexity",
                "label": "System Complexity Index",
                "weight": 0.20,
                "impact": "high" if complexity_score >= 7 else "medium",
                "description": f"Architectural complexity scored at {complexity_score}/10 based on diagnostic heuristics.",
                "mitigationTip": "Pair with domain senior specialist.",
            },
            {
                "id": "rf-workload",
                "label": "Engineer Queue Saturation",
                "weight": 0.25,
                "impact": "critical" if not assignee_name else "medium",
                "description": f"{assignee_name or 'Unassigned queue'} active load index is high.",
                "mitigationTip": "Reassign to engineer with lowest concurrent active P1/P2 tickets.",
            },
            {
                "id": "rf-resource",
                "label": "Resourcing & Co-Responders",
                "weight": 0.15,
                "impact": "medium" if co_assignee_count == 0 else "low",
                "description": f"{co_assignee_count} backup engineer(s) actively assigned.",
                "mitigationTip": "Attach secondary incident coordinator.",
            }
        ]

        # 1-Click AI Auto-Remediation Playbooks
        recommended_actions: List[Dict[str, Any]] = [
            {
                "id": "act-reassign-sre",
                "type": "reassign",
                "title": "Smart Rebalance to Available SRE",
                "description": "Auto-reassign ticket to Elena Rostova (DevOps Lead) with 15% current queue utilization.",
                "predictedRiskReduction": 38,
                "targetAssigneeId": "user-agent-3",
                "targetAssigneeName": "Elena Rostova",
                "isExecuted": False,
            },
            {
                "id": "act-pair-senior",
                "type": "add_co_assignee",
                "title": "Pair Senior Principal SRE Co-Responder",
                "description": "Attach David Kim as second responder to accelerate database diagnostics.",
                "predictedRiskReduction": 25,
                "targetAssigneeId": "user-agent-1",
                "targetAssigneeName": "David Kim",
                "isExecuted": False,
            },
            {
                "id": "act-grace-extension",
                "type": "extend_grace",
                "title": "Request 1-Hour SLA Grace Window",
                "description": "Trigger client SLA maintenance extension protocol based on third-party upstream dependency.",
                "predictedRiskReduction": 45,
                "isExecuted": False,
            }
        ]

        if total_risk >= 75.0:
            risk_explanation = f"Imminent breach: {round(elapsed_percentage, 1)}% SLA elapsed with high technical complexity ({complexity_score}/10). Immediate intervention required."
        elif total_risk >= 50.0:
            risk_explanation = f"Elevated risk: queue workload and pending canary rollback verification requires proactive monitoring."
        else:
            risk_explanation = "On track: incident progress is within normal SLA target thresholds."

        return {
            "risk_score": total_risk,
            "risk_level": risk_level,
            "risk_trend": "increasing" if total_risk > 60 else "stable",
            "risk_explanation": risk_explanation,
            "risk_factors": risk_factors,
            "recommended_actions": recommended_actions,
        }
