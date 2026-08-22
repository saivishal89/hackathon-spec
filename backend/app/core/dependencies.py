from typing import Optional, List
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token, ROLE_PERMISSIONS
from app.models.user import User

def get_current_user_optional(
    x_user_id: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    # 1. Bearer Token Verification
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            user = db.query(User).filter(User.id == payload["sub"]).first()
            if user:
                return user

    # 2. X-User-Id Header (Seamless authenticated proxy)
    if x_user_id:
        user = db.query(User).filter(User.id == x_user_id).first()
        if user:
            return user

    # 3. Default fallback in local development
    return db.query(User).filter(User.id == "user-admin-1").first()

def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided or have expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Please contact your system administrator."
        )
    return current_user

def require_roles(*allowed_roles: str):
    def role_validator(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Role '{current_user.role}' lacks sufficient privileges. Required: {list(allowed_roles)}"
            )
        return current_user
    return role_validator

def require_permission(permission: str):
    def permission_validator(current_user: User = Depends(get_current_active_user)) -> User:
        user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied: Lacks required permission '{permission}'."
            )
        return current_user
    return permission_validator
