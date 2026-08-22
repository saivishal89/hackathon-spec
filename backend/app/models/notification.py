from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text, JSON
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), index=True, nullable=True)
    organization_id = Column(String(64), index=True, nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(32), default="SLA_WARNING")  # SLA_WARNING, BREACH_ALERT, ESCALATION, SYSTEM
    severity = Column(String(32), default="MEDIUM")   # LOW, MEDIUM, HIGH, CRITICAL
    request_id = Column(String(64), index=True, nullable=True)
    is_read = Column(Boolean, default=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
