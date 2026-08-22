import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    def log(
        db: Session,
        user_id: str,
        user_name: str,
        user_role: str,
        action: str,
        resource: str,
        resource_id: Optional[str] = None,
        organization_id: Optional[str] = None,
        status: str = "SUCCESS",
        ip_address: str = "127.0.0.1",
        metadata: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        log_entry = AuditLog(
            id=f"audit-{uuid.uuid4().hex[:12]}",
            timestamp=datetime.utcnow(),
            user_id=user_id,
            user_name=user_name,
            user_role=user_role,
            organization_id=organization_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            status=status,
            ip_address=ip_address,
            metadata_json=metadata or {},
        )
        try:
            db.add(log_entry)
            db.commit()
        except Exception:
            db.rollback()
        return log_entry
