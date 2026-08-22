from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON
from app.core.database import Base

class SLAPolicy(Base):
    __tablename__ = "sla_policies"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    tier = Column(String(32), unique=True, index=True, nullable=False)  # PLATINUM, GOLD, SILVER, STANDARD
    description = Column(String(512), nullable=True)
    business_hours = Column(String(64), default="24x7")
    breach_penalty_enabled = Column(Boolean, default=True)
    breach_penalty_per_minute_usd = Column(Float, default=50.0)
    is_default = Column(Boolean, default=False)
    holidays = Column(JSON, default=list)
    targets = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
