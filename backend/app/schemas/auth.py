from typing import Optional, List
from pydantic import BaseModel, EmailStr

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

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    title: Optional[str] = None
    department: Optional[str] = None
    organization_id: Optional[str] = None
    company: Optional[str] = None
    avatar: Optional[str] = None
    mfa_enabled: bool = False

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: int
    user: UserResponse
    permissions: List[str]
    organization_id: str

class MfaVerifyRequest(BaseModel):
    email: EmailStr
    code: str
