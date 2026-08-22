from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["Users & Team Management"])

class UserUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None
    avatar: Optional[str] = None

@router.get("")
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "title": u.title,
            "department": u.department,
            "company": u.company,
            "avatar": u.avatar,
            "isActive": u.is_active,
        }
        for u in users
    ]

@router.patch("/{user_id}")
def update_user(
    user_id: str,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "ADMIN" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden: You can only update your own profile.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.name: user.name = payload.name
    if payload.title: user.title = payload.title
    if payload.department: user.department = payload.department
    if payload.avatar: user.avatar = payload.avatar

    db.commit()
    db.refresh(user)
    return user
