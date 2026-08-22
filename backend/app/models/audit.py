from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(String(64), index=True, nullable=False)
    user_name = Column(String(255), nullable=False)
    user_role = Column(String(32), nullable=False)
    organization_id = Column(String(64), nullable=True)
    action = Column(String(128), nullable=False)
    resource = Column(String(128), nullable=False)
    resource_id = Column(String(64), nullable=True)
    status = Column(String(32), default="SUCCESS")  # SUCCESS, FORBIDDEN, FAILED
    ip_address = Column(String(64), default="127.0.0.1")
    metadata_json = Column(JSON, default=dict)
