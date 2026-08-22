from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.request import ServiceRequest

router = APIRouter(prefix="/api/client", tags=["Client Self-Service Portal"])

@router.get("/overview")
def get_client_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = db.query(ServiceRequest).filter(
        (ServiceRequest.requester_id == current_user.id) |
        (ServiceRequest.requester_company == current_user.company)
    ).all()

    total = len(requests)
    active = len([r for r in requests if r.status not in ["RESOLVED", "CLOSED"]])
    resolved = len([r for r in requests if r.status in ["RESOLVED", "CLOSED"]])
    at_risk = len([r for r in requests if float(r.risk_score or 0) >= 60.0 and r.status not in ["RESOLVED", "CLOSED"]])

    return {
        "clientName": current_user.name,
        "company": current_user.company,
        "contractTier": "PLATINUM (24x7 Dedicated)",
        "activeIncidents": active,
        "resolvedIncidents": resolved,
        "atRiskIncidents": at_risk,
        "totalSubmitted": total,
        "slaComplianceRate": 99.4,
    }
