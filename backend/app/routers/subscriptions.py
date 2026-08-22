from typing import List, Dict, Any
from fastapi import APIRouter

router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions & Usage Limits"])

PLANS = [
    {
        "id": "plan_free",
        "name": "Free Starter",
        "priceMonthlyUsd": 0,
        "maxUsers": 3,
        "maxRequestsPerMonth": 50,
        "aiPredictionsPerMonth": 25,
        "slaTracking": "Basic",
        "features": [
            "1 Organization",
            "3 Team Members",
            "50 Monthly SLA Requests",
            "Rule-Based SLA Tracking",
            "Basic Client Portal",
            "Community Support",
        ]
    },
    {
        "id": "plan_pro",
        "name": "Pro Growth",
        "priceMonthlyUsd": 499,
        "maxUsers": 15,
        "maxRequestsPerMonth": 1000,
        "aiPredictionsPerMonth": 500,
        "slaTracking": "Autonomous Real-Time",
        "isPopular": True,
        "features": [
            "Up to 15 Team Members",
            "1,000 Monthly SLA Requests",
            "500 AI Risk Predictions",
            "1-Click Auto-Remediation Playbooks",
            "Real-Time Countdown Timers",
            "Post-Resolution Customer Feedback Loop",
            "Priority Slack & Email Support",
        ]
    },
    {
        "id": "plan_business",
        "name": "Business Scale",
        "priceMonthlyUsd": 1299,
        "maxUsers": 50,
        "maxRequestsPerMonth": 5000,
        "aiPredictionsPerMonth": 2500,
        "slaTracking": "Enterprise Multi-Tier",
        "features": [
            "Up to 50 Team Members",
            "5,000 Monthly SLA Requests",
            "2,500 AI Risk Predictions",
            "Custom SLA Policies & Penalty Ledger",
            "Role-Based Access Control (RBAC)",
            "Compliance Audit Logs",
            "Executive Analytics Studio",
            "Dedicated Support Engineer",
        ]
    },
    {
        "id": "plan_enterprise",
        "name": "Enterprise Custom",
        "priceMonthlyUsd": 3499,
        "maxUsers": 999,
        "maxRequestsPerMonth": 99999,
        "aiPredictionsPerMonth": 50000,
        "slaTracking": "Dedicated Infrastructure",
        "features": [
            "Unlimited Team Members & Organizations",
            "Unlimited SLA Requests",
            "Dedicated LLM & Fine-Tuned Risk Models",
            "Custom Contract Penalty Disbursal Accounting",
            "SAML / SSO & Enterprise MFA",
            "SOC2 & HIPAA Compliant Audit Logs",
            "24x7 15-Minute Guaranteed SLA",
            "Dedicated Customer Success Manager",
        ]
    }
]

@router.get("/plans")
def get_subscription_plans() -> List[Dict[str, Any]]:
    return PLANS

@router.get("/usage")
def get_current_usage() -> Dict[str, Any]:
    return {
        "currentPlan": "plan_pro",
        "planName": "Pro Growth",
        "billingPeriodEnd": "2026-09-30T23:59:59Z",
        "usage": {
            "users": {"current": 6, "limit": 15, "percentage": 40.0},
            "monthlyRequests": {"current": 218, "limit": 1000, "percentage": 21.8},
            "aiPredictions": {"current": 84, "limit": 500, "percentage": 16.8},
        },
        "limitsExceeded": False,
    }
