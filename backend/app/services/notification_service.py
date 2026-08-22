import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from app.models.notification import Notification

class NotificationService:
    @staticmethod
    def create_notification(
        db: Session,
        title: str,
        message: str,
        type: str = "SLA_WARNING",
        severity: str = "HIGH",
        user_id: Optional[str] = None,
        organization_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Notification:
        notif = Notification(
            id=f"notif-{uuid.uuid4().hex[:8]}",
            user_id=user_id,
            organization_id=organization_id,
            title=title,
            message=message,
            type=type,
            severity=severity,
            request_id=request_id,
            is_read=False,
            metadata_json=metadata or {},
            created_at=datetime.utcnow(),
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)
        return notif

    @staticmethod
    def get_unread_notifications(db: Session, user_id: Optional[str] = None) -> List[Notification]:
        query = db.query(Notification).filter(Notification.is_read == False)
        if user_id:
            query = query.filter((Notification.user_id == user_id) | (Notification.user_id == None))
        return query.order_by(Notification.created_at.desc()).limit(20).all()

    @staticmethod
    def mark_as_read(db: Session, notification_id: str):
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if notif:
            notif.is_read = True
            db.commit()
