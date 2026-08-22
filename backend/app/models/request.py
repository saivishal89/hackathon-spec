from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON
from app.database import Base

class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(String(64), primary_key=True, index=True)
    ticket_number = Column(String(32), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(128), default="General Support")
    department = Column(String(128), default="IT Infrastructure")
    priority = Column(String(32), default="P3_MEDIUM", index=True)  # P1_CRITICAL, P2_HIGH, P3_MEDIUM, P4_LOW
    status = Column(String(32), default="SUBMITTED", index=True)    # SUBMITTED, TRIAGED, IN_PROGRESS, UNDER_REVIEW, RESOLVED, CLOSED

    # Requester
    requester_id = Column(String(64), index=True, nullable=False)
    requester_name = Column(String(255), nullable=False)
    requester_email = Column(String(255), nullable=False)
    requester_avatar = Column(String(512), nullable=True)
    requester_company = Column(String(255), default="Enterprise Partner", index=True)

    # Assignee
    assignee_id = Column(String(64), index=True, nullable=True)
    assignee_name = Column(String(255), nullable=True)
    assignee_email = Column(String(255), nullable=True)
    assignee_avatar = Column(String(512), nullable=True)
    co_assignees = Column(JSON, default=list)

    # SLA Timings (UTC datetimes)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    response_due_at = Column(DateTime, nullable=False)
    responded_at = Column(DateTime, nullable=True)
    resolution_due_at = Column(DateTime, nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    sla_tier = Column(String(32), default="PLATINUM", index=True)  # PLATINUM, GOLD, SILVER, STANDARD

    # AI Risk Intelligence
    risk_score = Column(Float, default=20.0)
    risk_level = Column(String(32), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    risk_trend = Column(String(32), default="stable")  # increasing, stable, decreasing
    risk_explanation = Column(Text, default="Automated risk score evaluation.")
    risk_factors = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)

    # Complexity & Urgency
    complexity_score = Column(Integer, default=5)
    sentiment_urgency = Column(String(32), default="moderate")  # low, moderate, high, critical
    tags = Column(JSON, default=list)
    timeline = Column(JSON, default=list)
    attachments = Column(JSON, default=list)
