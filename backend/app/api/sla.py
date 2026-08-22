from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.user import User
from app.models.sla import SLAPolicy
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/sla", tags=["SLA Policies & Deadline Governance"])

class SLAPolicyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    business_hours: Optional[str] = None
    breach_penalty_enabled: Optional[bool] = None
    breach_penalty_per_minute_usd: Optional[float] = None
    is_default: Optional[bool] = None
    targets: Optional[List[Dict[str, Any]]] = None

@router.get("/policies")
def get_policies(db: Session = Depends(get_db)):
    return db.query(SLAPolicy).all()

@router.put("/policies/{policy_id}")
def update_policy(
    policy_id: str,
    payload: SLAPolicyUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN"))
):
    policy = db.query(SLAPolicy).filter(SLAPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="SLA Policy not found")

    if payload.name: policy.name = payload.name
    if payload.description: policy.description = payload.description
    if payload.business_hours: policy.business_hours = payload.business_hours
    if payload.breach_penalty_enabled is not None: policy.breach_penalty_enabled = payload.breach_penalty_enabled
    if payload.breach_penalty_per_minute_usd is not None: policy.breach_penalty_per_minute_usd = payload.breach_penalty_per_minute_usd
    if payload.is_default is not None: policy.is_default = payload.is_default
    if payload.targets is not None: policy.targets = payload.targets

    db.commit()
    db.refresh(policy)

    AuditService.log(
        db,
        user_id=admin_user.id,
        user_name=admin_user.name,
        user_role=admin_user.role,
        action="UPDATE_SLA_POLICY",
        resource=f"SLAPolicy/{policy.id}",
        status="SUCCESS",
        metadata={"tier": policy.tier, "penaltyRate": policy.breach_penalty_per_minute_usd}
    )

    return policy
