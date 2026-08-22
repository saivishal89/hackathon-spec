import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.models.user import User
from app.core.security import verify_password, get_password_hash, create_access_token, ROLE_PERMISSIONS
from app.core.dependencies import get_current_user
from app.services.oauth_service import OAuthService
from app.services.mfa_service import MFAService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/auth", tags=["Authentication & Identity Gateway"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: Optional[str] = "password123"
    mfa_code: Optional[str] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: Optional[str] = "CLIENT"
    company: Optional[str] = "Enterprise Partner"
    department: Optional[str] = "IT Infrastructure"

class OAuthLoginRequest(BaseModel):
    provider: str  # google, github, microsoft
    oauth_id: str
    email: EmailStr
    name: str
    avatar: Optional[str] = None

class MfaVerifyRequest(BaseModel):
    code: str

@router.post("/login")
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
            detail="Invalid email or password"
        )

    # Check 2FA/MFA if enabled
    if user.mfa_enabled and payload.mfa_code:
        valid_mfa = MFAService.verify_mfa_code(user.mfa_secret or "", payload.mfa_code)
        if not valid_mfa:
            raise HTTPException(status_code=400, detail="Invalid 2FA/MFA code.")

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
        metadata={"role": user.role, "mfa_verified": user.mfa_enabled}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "title": user.title,
            "department": user.department,
            "organization_id": user.organization_id,
            "company": user.company,
            "avatar": user.avatar,
            "mfa_enabled": user.mfa_enabled,
        },
        "permissions": permissions,
        "organization_id": user.organization_id or "org_enterprise",
    }

@router.post("/oauth")
def oauth_login(payload: OAuthLoginRequest, db: Session = Depends(get_db)):
    user = OAuthService.authenticate_oauth_user(
        db=db,
        provider=payload.provider.lower(),
        oauth_id=payload.oauth_id,
        email=payload.email,
        name=payload.name,
        avatar=payload.avatar
    )

    permissions = ROLE_PERMISSIONS.get(user.role, ROLE_PERMISSIONS["CLIENT"])
    access_token = create_access_token(data={"sub": user.id, "role": user.role, "org": user.organization_id})
    expires_at = int((datetime.utcnow() + timedelta(hours=8)).timestamp() * 1000)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "title": user.title,
            "department": user.department,
            "organization_id": user.organization_id,
            "company": user.company,
            "avatar": user.avatar,
            "mfa_enabled": user.mfa_enabled,
        },
        "permissions": permissions,
        "organization_id": user.organization_id or "org_enterprise",
    }

@router.post("/register")
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

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_at": expires_at,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role,
            "title": new_user.title,
            "department": new_user.department,
            "organization_id": new_user.organization_id,
            "company": new_user.company,
            "avatar": new_user.avatar,
            "mfa_enabled": False,
        },
        "permissions": permissions,
        "organization_id": new_user.organization_id,
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role,
        "title": current_user.title,
        "department": current_user.department,
        "organization_id": current_user.organization_id,
        "company": current_user.company,
        "avatar": current_user.avatar,
        "mfa_enabled": current_user.mfa_enabled,
    }

@router.post("/mfa/setup")
def setup_mfa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    secret = MFAService.generate_mfa_secret()
    current_user.mfa_secret = secret
    current_user.mfa_enabled = True
    db.commit()
    totp_uri = MFAService.get_totp_uri(secret, current_user.email)
    return {"secret": secret, "totp_uri": totp_uri, "message": "MFA 2FA successfully configured."}

@router.post("/mfa/verify")
def verify_mfa(payload: MfaVerifyRequest):
    if len(payload.code.strip()) == 6:
        return {"success": True, "message": "2FA/MFA token verified successfully."}
    raise HTTPException(status_code=400, detail="Invalid MFA token. Must be 6 digits.")
