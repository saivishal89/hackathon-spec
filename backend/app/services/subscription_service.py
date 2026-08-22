from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.models.subscription import Subscription

PLAN_QUOTAS = {
    "FREE": {
        "max_users": 3,
        "max_requests": 50,
        "max_ai": 25,
        "price_usd": 0,
    },
    "PRO": {
        "max_users": 15,
        "max_requests": 1000,
        "max_ai": 500,
        "price_usd": 499,
    },
    "BUSINESS": {
        "max_users": 50,
        "max_requests": 5000,
        "max_ai": 2500,
        "price_usd": 1299,
    },
    "ENTERPRISE": {
        "max_users": 999,
        "max_requests": 99999,
        "max_ai": 50000,
        "price_usd": 3499,
    }
}

class SubscriptionService:
    @staticmethod
    def check_request_quota(db: Session, organization_id: str) -> bool:
        org = db.query(Organization).filter(Organization.id == organization_id).first()
        if not org:
            return True  # default permit
        
        sub = db.query(Subscription).filter(Subscription.organization_id == organization_id).first()
        if not sub:
            return True
            
        tier = org.tier.upper() if org.tier else "PRO"
        quota = PLAN_QUOTAS.get(tier, PLAN_QUOTAS["PRO"])
        
        return (sub.current_month_requests_count or 0) < quota["max_requests"]

    @staticmethod
    def increment_request_usage(db: Session, organization_id: str):
        sub = db.query(Subscription).filter(Subscription.organization_id == organization_id).first()
        if sub:
            sub.current_month_requests_count = (sub.current_month_requests_count or 0) + 1
            db.commit()

    @staticmethod
    def increment_ai_usage(db: Session, organization_id: str):
        sub = db.query(Subscription).filter(Subscription.organization_id == organization_id).first()
        if sub:
            sub.current_month_ai_predictions_count = (sub.current_month_ai_predictions_count or 0) + 1
            db.commit()
