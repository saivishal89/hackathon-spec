import uuid
import random
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.request import ServiceRequest
from app.schemas.request import (
    RequestCreate,
    RequestUpdate,
    RequestReassign,
    AddCommentRequest,
    ExecuteAiActionRequest,
    PreTriageRequest,
    PreTriageResponse,
    ServiceRequestResponse,
)
from app.services.auth_service import get_current_user, require_roles
from app.services.sla_engine import SLAEngine
from app.services.ai_engine import AIEngine
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/requests", tags=["Service Requests"])

def map_db_to_response(req: ServiceRequest) -> ServiceRequestResponse:
    return ServiceRequestResponse(
        id=req.id,
        ticketNumber=req.ticket_number,
        title=req.title,
        description=req.description,
        category=req.category or "General Support",
        department=req.department or "IT Infrastructure",
        priority=req.priority or "P3_MEDIUM",
        status=req.status or "SUBMITTED",
        requesterId=req.requester_id,
        requesterName=req.requester_name,
        requesterEmail=req.requester_email,
        requesterAvatar=req.requester_avatar,
        requesterCompany=req.requester_company,
        assigneeId=req.assignee_id,
        assigneeName=req.assignee_name,
        assigneeEmail=req.assignee_email,
        assigneeAvatar=req.assignee_avatar,
        coAssignees=req.co_assignees or [],
        createdAt=req.created_at.isoformat() + "Z" if req.created_at else datetime.utcnow().isoformat() + "Z",
        updatedAt=req.updated_at.isoformat() + "Z" if req.updated_at else datetime.utcnow().isoformat() + "Z",
        responseDueAt=req.response_due_at.isoformat() + "Z" if req.response_due_at else datetime.utcnow().isoformat() + "Z",
        respondedAt=req.responded_at.isoformat() + "Z" if req.responded_at else None,
        resolutionDueAt=req.resolution_due_at.isoformat() + "Z" if req.resolution_due_at else datetime.utcnow().isoformat() + "Z",
        resolvedAt=req.resolved_at.isoformat() + "Z" if req.resolved_at else None,
        slaTier=req.sla_tier or "PLATINUM",
        riskScore=float(req.risk_score or 20.0),
        riskLevel=req.risk_level or "LOW",
        riskTrend=req.risk_trend or "stable",
        riskExplanation=req.risk_explanation or "Evaluated by SLA AI Engine",
        riskFactors=req.risk_factors or [],
        recommendedActions=req.recommended_actions or [],
        complexityScore=int(req.complexity_score or 5),
        sentimentUrgency=req.sentiment_urgency or "moderate",
        tags=req.tags or [],
        timeline=req.timeline or [],
        attachments=req.attachments or [],
    )

@router.get("", response_model=List[ServiceRequestResponse])
def get_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role in ["ADMIN", "AGENT"]:
        requests = db.query(ServiceRequest).order_by(ServiceRequest.created_at.desc()).all()
    else:
        # Tenant Isolation for B2B Client
        requests = db.query(ServiceRequest).filter(
            (ServiceRequest.requester_id == current_user.id) |
            (ServiceRequest.requester_company == current_user.company)
        ).order_by(ServiceRequest.created_at.desc()).all()

    return [map_db_to_response(r) for r in requests]

@router.post("/pre-triage", response_model=PreTriageResponse)
def pre_triage_request(payload: PreTriageRequest):
    return AIEngine.pre_triage_text(payload.title, payload.description, payload.category or "General Support")

@router.post("", response_model=ServiceRequestResponse, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: RequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    tier = payload.slaTier or "PLATINUM"
    priority = payload.priority or "P3_MEDIUM"

    response_due_at, resolution_due_at = SLAEngine.calculate_due_dates(tier, priority, now)
    
    # Calculate initial risk assessment
    risk_data = AIEngine.calculate_risk(
        elapsed_percentage=0.0,
        complexity_score=payload.complexityScore or 5,
        assignee_name=None,
        priority=priority
    )

    ticket_number = f"SLA-{random.randint(1000, 9999)}"
    request_id = f"req-{uuid.uuid4().hex[:8]}"

    initial_timeline = [
        {
            "id": f"tl-{uuid.uuid4().hex[:8]}",
            "timestamp": now.isoformat() + "Z",
            "title": "Request Created & SLA Engine Initialized",
            "description": f"Created by {current_user.name} ({current_user.role}). SLA target set to {tier} tier.",
            "actor": {"name": current_user.name, "role": current_user.role, "avatar": current_user.avatar},
            "type": "status_change",
        }
    ]

    new_req = ServiceRequest(
        id=request_id,
        ticket_number=ticket_number,
        title=payload.title,
        description=payload.description,
        category=payload.category or "General Support",
        department=payload.department or "IT Infrastructure",
        priority=priority,
        status="SUBMITTED",
        requester_id=current_user.id,
        requester_name=current_user.name,
        requester_email=current_user.email,
        requester_avatar=current_user.avatar,
        requester_company=current_user.company or "Enterprise Partner",
        created_at=now,
        updated_at=now,
        response_due_at=response_due_at,
        resolution_due_at=resolution_due_at,
        sla_tier=tier,
        risk_score=risk_data["risk_score"],
        risk_level=risk_data["risk_level"],
        risk_trend=risk_data["risk_trend"],
        risk_explanation=risk_data["risk_explanation"],
        risk_factors=risk_data["risk_factors"],
        recommended_actions=risk_data["recommended_actions"],
        complexity_score=payload.complexityScore or 5,
        sentiment_urgency=payload.sentimentUrgency or "moderate",
        tags=payload.tags or ["API_Submitted"],
        timeline=initial_timeline,
        attachments=payload.attachments or [],
    )

    db.add(new_req)
    db.commit()
    db.refresh(new_req)

    AuditService.log(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        user_role=current_user.role,
        organization_id=current_user.organization_id,
        action="CREATE_REQUEST",
        resource=f"Request/{new_req.id}",
        resource_id=new_req.id,
        status="SUCCESS",
        metadata={"priority": priority, "tier": tier, "ticketNumber": ticket_number}
    )

    return map_db_to_response(new_req)

@router.get("/{request_id}", response_model=ServiceRequestResponse)
def get_request_by_id(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # Tenant check if client
    if current_user.role == "CLIENT":
        is_owner = req.requester_id == current_user.id or (current_user.company and req.requester_company == current_user.company)
        if not is_owner:
            AuditService.log(
                db,
                user_id=current_user.id,
                user_name=current_user.name,
                user_role=current_user.role,
                action="CROSS_TENANT_ACCESS_ATTEMPT",
                resource=f"Request/{request_id}",
                status="FORBIDDEN"
            )
            raise HTTPException(status_code=403, detail="Forbidden: You do not have permission to view this ticket.")

    return map_db_to_response(req)

@router.patch("/{request_id}", response_model=ServiceRequestResponse)
def update_request(
    request_id: str,
    payload: RequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # Only Admin or Agent can change status/assignees; Client can only close their own ticket
    if current_user.role == "CLIENT" and payload.status and payload.status != "CLOSED":
        raise HTTPException(status_code=403, detail="Clients are only permitted to close their own tickets.")

    now = datetime.utcnow()
    timeline = list(req.timeline or [])

    if payload.status and payload.status != req.status:
        old_status = req.status
        req.status = payload.status
        if payload.status in ["RESOLVED", "CLOSED"]:
            req.resolved_at = now
        timeline.append({
            "id": f"tl-{uuid.uuid4().hex[:8]}",
            "timestamp": now.isoformat() + "Z",
            "title": f"Status Transition: {old_status} ➔ {payload.status}",
            "description": f"Updated by {current_user.name} ({current_user.role})",
            "actor": {"name": current_user.name, "role": current_user.role, "avatar": current_user.avatar},
            "type": "status_change",
        })

    if payload.title: req.title = payload.title
    if payload.description: req.description = payload.description
    if payload.priority: req.priority = payload.priority
    if payload.department: req.department = payload.department
    if payload.category: req.category = payload.category
    if payload.slaTier: req.sla_tier = payload.slaTier
    if payload.riskScore is not None: req.risk_score = payload.riskScore
    if payload.riskLevel: req.risk_level = payload.riskLevel
    if payload.riskTrend: req.risk_trend = payload.riskTrend

    req.updated_at = now
    req.timeline = timeline

    db.commit()
    db.refresh(req)

    return map_db_to_response(req)

@router.post("/{request_id}/reassign", response_model=ServiceRequestResponse)
def reassign_request(
    request_id: str,
    payload: RequestReassign,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "AGENT"))
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    target_user = db.query(User).filter(User.id == payload.assigneeId).first()
    if not target_user:
        raise HTTPException(status_code=400, detail="Target engineer not found")

    now = datetime.utcnow()
    req.assignee_id = target_user.id
    req.assignee_name = target_user.name
    req.assignee_email = target_user.email
    req.assignee_avatar = target_user.avatar
    req.updated_at = now

    timeline = list(req.timeline or [])
    timeline.append({
        "id": f"tl-{uuid.uuid4().hex[:8]}",
        "timestamp": now.isoformat() + "Z",
        "title": "Engineer Reassigned",
        "description": f"Reassigned to {target_user.name} ({target_user.department}) by {current_user.name}",
        "actor": {"name": current_user.name, "role": current_user.role, "avatar": current_user.avatar},
        "type": "status_change",
    })
    req.timeline = timeline

    db.commit()
    db.refresh(req)

    AuditService.log(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        user_role=current_user.role,
        action="REASSIGN_ENGINEER",
        resource=f"Request/{request_id}",
        status="SUCCESS",
        metadata={"newAssignee": target_user.name}
    )

    return map_db_to_response(req)

@router.post("/{request_id}/execute-ai-action", response_model=ServiceRequestResponse)
def execute_ai_action(
    request_id: str,
    payload: ExecuteAiActionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("ADMIN", "AGENT"))
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    now = datetime.utcnow()
    # Mark action as executed and lower risk score
    actions = list(req.recommended_actions or [])
    action_title = "AI Remediation Playbook"
    for act in actions:
        if act.get("id") == payload.actionId:
            act["isExecuted"] = True
            action_title = act.get("title", action_title)
            # Rebalance assignee if action specifies targetAssigneeId
            if act.get("targetAssigneeId"):
                target_user = db.query(User).filter(User.id == act["targetAssigneeId"]).first()
                if target_user:
                    req.assignee_id = target_user.id
                    req.assignee_name = target_user.name
                    req.assignee_email = target_user.email
                    req.assignee_avatar = target_user.avatar

    # Reduce risk score
    req.risk_score = max(15.0, (req.risk_score or 50.0) - 35.0)
    req.risk_level = "LOW" if req.risk_score < 35 else "MEDIUM"
    req.risk_trend = "decreasing"
    req.risk_explanation = f"Risk reduced post 1-click execution of '{action_title}'."
    req.recommended_actions = actions
    req.updated_at = now

    timeline = list(req.timeline or [])
    timeline.append({
        "id": f"tl-{uuid.uuid4().hex[:8]}",
        "timestamp": now.isoformat() + "Z",
        "title": f"1-Click AI Auto-Remediation Executed: {action_title}",
        "description": f"Triggered by {current_user.name}. Risk dropped by 35%.",
        "actor": {"name": "SLA AI Autonomous Copilot", "role": "AI Engine", "isAi": True},
        "type": "ai_remediation",
    })
    req.timeline = timeline

    db.commit()
    db.refresh(req)

    AuditService.log(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        user_role=current_user.role,
        action="EXECUTE_AI_REMEDIATION",
        resource=f"Request/{request_id}",
        status="SUCCESS",
        metadata={"actionId": payload.actionId, "actionTitle": action_title}
    )

    return map_db_to_response(req)

@router.post("/{request_id}/comments", response_model=ServiceRequestResponse)
def add_comment(
    request_id: str,
    payload: AddCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    now = datetime.utcnow()
    timeline = list(req.timeline or [])
    timeline.append({
        "id": f"tl-{uuid.uuid4().hex[:8]}",
        "timestamp": now.isoformat() + "Z",
        "title": f"Comment added by {current_user.name}",
        "description": payload.message,
        "actor": {"name": current_user.name, "role": current_user.role, "avatar": current_user.avatar},
        "type": "comment",
    })

    req.timeline = timeline
    req.updated_at = now
    db.commit()
    db.refresh(req)

    return map_db_to_response(req)
