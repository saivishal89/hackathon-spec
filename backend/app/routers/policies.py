import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.sla_policy import SLAPolicy
from app.models.user import User
from app.schemas.sla import SLAPolicySchema, SLAPolicyUpdate
from app.services.auth_service import get_current_user, require_roles
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/policies", tags=["SLA Policies"])

def map_policy_to_schema(policy: SLAPolicy) -> SLAPolicySchema:
    return SLAPolicySchema(
        id=policy.id,
        name=policy.name,
        tier=policy.tier,
        description=policy.description,
        businessHours=policy.business_hours or "24x7",
        breachPenaltyEnabled=bool(policy.breach_penalty_enabled),
        breachPenaltyPerMinuteUsd=float(policy.breach_penalty_per_minute_usd or 0.0),
        isDefault=bool(policy.is_default),
        targets=policy.targets or [],
    )

@router.get("", response_model=List[SLAPolicySchema])
def get_policies(db: Session = Depends(get_db)):
    policies = db.query(SLAPolicy).all()
    return [map_policy_to_schema(p) for p in policies]

@router.put("/{policy_id}", response_model=SLAPolicySchema)
def update_policy(
    policy_id: str,
    payload: SLAPolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN"))
):
    policy = db.query(SLAPolicy).filter(SLAPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="SLA Policy not found")

    if payload.name: policy.name = payload.name
    if payload.description: policy.description = payload.description
    if payload.businessHours: policy.business_hours = payload.businessHours
    if payload.breachPenaltyEnabled is not None: policy.breach_penalty_enabled = payload.breachPenaltyEnabled
    if payload.breachPenaltyPerMinuteUsd is not None: policy.breach_penalty_per_minute_usd = payload.breachPenaltyPerMinuteUsd
    if payload.isDefault is not None: policy.is_default = payload.isDefault
    if payload.targets is not None: policy.targets = payload.targets

    db.commit()
    db.refresh(policy)

    AuditService.log(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        user_role=current_user.role,
        action="UPDATE_SLA_POLICY",
        resource=f"SLAPolicy/{policy.id}",
        status="SUCCESS",
        metadata={"tier": policy.tier, "penaltyRate": policy.breach_penalty_per_minute_usd}
    )

    return map_policy_to_schema(policy)
