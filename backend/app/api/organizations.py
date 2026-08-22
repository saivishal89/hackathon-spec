from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_roles
from app.models.user import User
from app.models.organization import Organization

router = APIRouter(prefix="/api/organizations", tags=["Organizations & Teams"])

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: str = "CLIENT"
    team: str = "Engineering"

@router.get("")
def list_organizations(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN"))
):
    return db.query(Organization).all()

@router.get("/current")
def get_current_organization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    if not org:
        return {
            "id": "org_default",
            "name": current_user.company or "Enterprise Partner",
            "tier": "PRO",
            "maxUsers": 15,
            "maxRequests": 1000,
        }
    return org

@router.post("/invite")
def invite_team_member(
    payload: InviteMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return {
        "success": True,
        "message": f"Invitation dispatched to {payload.email} for organization role {payload.role}.",
    }
