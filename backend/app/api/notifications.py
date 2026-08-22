from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/notifications", tags=["Notifications & Real-Time Alerts"])

@router.get("")
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifs = db.query(Notification).filter(
        (Notification.user_id == current_user.id) |
        (Notification.user_id.is_(None)) |
        (Notification.organization_id == current_user.organization_id)
    ).order_by(Notification.created_at.desc()).limit(20).all()
    
    return notifs

@router.post("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    NotificationService.mark_as_read(db, notification_id)
    return {"success": True}
