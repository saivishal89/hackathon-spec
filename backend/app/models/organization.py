from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, JSON
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True)
    tier = Column(String(32), default="PRO")  # FREE, PRO, BUSINESS, ENTERPRISE
    monthly_contract_value_usd = Column(Float, default=0.0)
    
    # Quotas & Limits
    max_users = Column(Integer, default=10)
    max_requests_per_month = Column(Integer, default=500)
    ai_limit_per_month = Column(Integer, default=200)
    
    teams = Column(JSON, default=list)
    invitations = Column(JSON, default=list)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
