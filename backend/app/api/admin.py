from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.user import User
from app.models.request import ServiceRequest
from app.models.audit import AuditLog
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/admin", tags=["Admin Operations Command Center"])

class FinancialActionRequest(BaseModel):
    ledgerId: str
    notes: str = ""

@router.get("/at-risk")
def get_at_risk_requests(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN", "AGENT"))
):
    requests = db.query(ServiceRequest).filter(
        ServiceRequest.status.notin_(["RESOLVED", "CLOSED"]),
        ServiceRequest.risk_score >= 50.0
    ).order_by(ServiceRequest.risk_score.desc()).all()
    
    return requests

@router.get("/audit-logs")
def get_audit_logs(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN"))
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
    return logs

@router.get("/financials")
def get_financial_ledger(
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN"))
):
    return {
        "grossContractRevenueUsd": 182400.0,
        "accruedPenaltiesUsd": 3750.0,
        "penaltiesPreventedUsd": 142500.0,
        "netRealizedRevenueUsd": 178650.0,
        "ledger": [
            {
                "id": "led-01",
                "ticketNumber": "SLA-8941",
                "clientCompany": "FinTech Global Systems",
                "slaTier": "PLATINUM",
                "breachDurationMinutes": 25,
                "penaltyRatePerMinUsd": 150.0,
                "calculatedCreditUsd": 3750.0,
                "status": "PENDING_APPROVAL",
                "createdAt": "2026-08-22T20:30:00Z"
            }
        ]
    }

@router.post("/financials/approve")
def approve_sla_credit(
    payload: FinancialActionRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN"))
):
    AuditService.log(
        db,
        user_id=admin_user.id,
        user_name=admin_user.name,
        user_role=admin_user.role,
        action="APPROVE_SLA_PENALTY_CREDIT",
        resource=f"Ledger/{payload.ledgerId}",
        status="SUCCESS",
        metadata={"notes": payload.notes}
    )
    return {"success": True, "message": "SLA penalty credit approved for client invoice deduction."}

@router.post("/financials/waive")
def waive_sla_credit(
    payload: FinancialActionRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_roles("ADMIN"))
):
    AuditService.log(
        db,
        user_id=admin_user.id,
        user_name=admin_user.name,
        user_role=admin_user.role,
        action="WAIVE_SLA_PENALTY_CREDIT",
        resource=f"Ledger/{payload.ledgerId}",
        status="SUCCESS",
        metadata={"notes": payload.notes, "protocol": "Maintenance Grace Protocol"}
    )
    return {"success": True, "message": "SLA penalty credit waived under maintenance protocol."}
