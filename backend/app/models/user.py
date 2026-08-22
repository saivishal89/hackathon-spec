from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(32), default="CLIENT", index=True)  # ADMIN, AGENT, CLIENT
    title = Column(String(255), nullable=True)
    department = Column(String(255), default="IT Infrastructure")
    organization_id = Column(String(64), default="org_default", index=True)
    company = Column(String(255), default="Enterprise")
    avatar = Column(String(512), nullable=True)
    
    # 2FA / MFA
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(64), nullable=True)

    # OAuth Providers
    google_id = Column(String(128), nullable=True, index=True)
    github_id = Column(String(128), nullable=True, index=True)
    microsoft_id = Column(String(128), nullable=True, index=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
