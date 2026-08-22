from typing import Dict, Any, List

class RiskModel:
    @staticmethod
    def evaluate_multi_factor_risk(
        elapsed_percentage: float,
        complexity_score: int,
        assignee_name: str = None,
        co_assignee_count: int = 0,
        priority: str = "P3_MEDIUM"
    ) -> Dict[str, Any]:
        # Weights: Time (40%), Complexity (20%), Queue/Workload (25%), Team/Backups (15%)
        time_factor = (elapsed_percentage / 100.0) * 40.0
        complexity_factor = (complexity_score / 10.0) * 20.0
        workload_factor = 25.0 if not assignee_name else 14.0
        resource_factor = 2.0 if co_assignee_count > 0 else 12.0

        total_risk = round(min(99.0, max(5.0, time_factor + complexity_factor + workload_factor + resource_factor)), 1)

        if total_risk >= 80.0:
            risk_level = "CRITICAL"
            trend = "increasing"
            explanation = f"Imminent breach: {round(elapsed_percentage, 1)}% SLA elapsed with high technical complexity ({complexity_score}/10). Immediate intervention required."
        elif total_risk >= 60.0:
            risk_level = "HIGH"
            trend = "increasing"
            explanation = f"Elevated risk: queue workload and pending rollback verification requires proactive monitoring."
        elif total_risk >= 35.0:
            risk_level = "MEDIUM"
            trend = "stable"
            explanation = f"Moderate risk: progress is currently monitored against {priority} SLA resolution target."
        else:
            risk_level = "LOW"
            trend = "stable"
            explanation = "On track: incident progress is within normal SLA target thresholds."

        # Risk Factors
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
                "description": "Auto-reassign ticket to Elena Rostova (Staff DBA/DevOps) with 15% current queue utilization.",
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

        return {
            "risk_score": total_risk,
            "risk_level": risk_level,
            "risk_trend": trend,
            "risk_explanation": explanation,
            "risk_factors": risk_factors,
            "recommended_actions": recommended_actions,
        }
