from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON
from app.core.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(64), primary_key=True, index=True)
    organization_id = Column(String(64), unique=True, index=True, nullable=False)
    plan_tier = Column(String(32), default="PRO")  # FREE, PRO, BUSINESS, ENTERPRISE
    status = Column(String(32), default="ACTIVE")   # ACTIVE, PAST_DUE, CANCELLED
    monthly_price_usd = Column(Float, default=499.0)
    
    # Quota counters
    current_month_requests_count = Column(Integer, default=0)
    current_month_ai_predictions_count = Column(Integer, default=0)
    
    billing_period_start = Column(DateTime, default=datetime.utcnow)
    billing_period_end = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
