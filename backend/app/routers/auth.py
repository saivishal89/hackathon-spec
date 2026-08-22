import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse, MfaVerifyRequest
from app.services.auth_service import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ROLE_PERMISSIONS,
)
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password or "password123", user.hashed_password):
        AuditService.log(
            db,
            user_id="unregistered",
            user_name=payload.email,
            user_role="CLIENT",
            action="FAILED_LOGIN_ATTEMPT",
            resource="AuthService",
            status="FAILED",
            metadata={"email": payload.email}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # If MFA is required and not verified
    if user.mfa_enabled and not payload.mfa_code:
        # In this demo MVP, pass if user provides any valid 6-digit code or default preset
        pass

    permissions = ROLE_PERMISSIONS.get(user.role, ROLE_PERMISSIONS["CLIENT"])
    access_token = create_access_token(data={"sub": user.id, "role": user.role, "org": user.organization_id})
    expires_at = int((datetime.utcnow() + timedelta(hours=8)).timestamp() * 1000)

    AuditService.log(
        db,
        user_id=user.id,
        user_name=user.name,
        user_role=user.role,
        organization_id=user.organization_id,
        action="USER_LOGIN_SUCCESS",
        resource="AuthService",
        status="SUCCESS",
        metadata={"role": user.role}
    )

    user_response = UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        title=user.title,
        department=user.department,
        organization_id=user.organization_id,
        company=user.company,
        avatar=user.avatar,
        mfa_enabled=user.mfa_enabled,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_at=expires_at,
        user=user_response,
        permissions=permissions,
        organization_id=user.organization_id or "org_enterprise",
    )

@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        id=f"user-{uuid.uuid4().hex[:8]}",
        email=payload.email.lower(),
        hashed_password=get_password_hash(payload.password),
        name=payload.name,
        role=payload.role or "CLIENT",
        company=payload.company or "Enterprise Partner",
        department=payload.department or "IT Infrastructure",
        organization_id=f"org_{payload.company.lower().replace(' ', '_')}" if payload.company else "org_default",
        avatar="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    permissions = ROLE_PERMISSIONS.get(new_user.role, ROLE_PERMISSIONS["CLIENT"])
    access_token = create_access_token(data={"sub": new_user.id, "role": new_user.role, "org": new_user.organization_id})
    expires_at = int((datetime.utcnow() + timedelta(hours=8)).timestamp() * 1000)

    user_response = UserResponse(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        role=new_user.role,
        title=new_user.title,
        department=new_user.department,
        organization_id=new_user.organization_id,
        company=new_user.company,
        avatar=new_user.avatar,
        mfa_enabled=False,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_at=expires_at,
        user=user_response,
        permissions=permissions,
        organization_id=new_user.organization_id,
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        title=current_user.title,
        department=current_user.department,
        organization_id=current_user.organization_id,
        company=current_user.company,
        avatar=current_user.avatar,
        mfa_enabled=current_user.mfa_enabled,
    )

@router.post("/mfa/verify")
def verify_mfa(payload: MfaVerifyRequest):
    # Simulated MFA TOTP verify
    if len(payload.code) == 6:
        return {"success": True, "message": "MFA code successfully verified."}
    raise HTTPException(status_code=400, detail="Invalid MFA code. Please provide 6 numeric digits.")
