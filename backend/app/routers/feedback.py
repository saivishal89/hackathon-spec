import uuid
from datetime import datetime
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.request import ServiceRequest
from app.models.feedback import CustomerFeedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse, FeedbackStatsResponse
from app.services.auth_service import get_current_user
from app.services.audit_service import AuditService

router = APIRouter(prefix="/api/feedback", tags=["Customer Feedback Loop"])

def map_feedback_to_response(f: CustomerFeedback) -> FeedbackResponse:
    return FeedbackResponse(
        id=f.id,
        requestId=f.request_id,
        userId=f.user_id,
        userName=f.user_name,
        userEmail=f.user_email,
        rating=f.rating,
        responseQualityRating=f.response_quality_rating or 5,
        slaSatisfactionRating=f.sla_satisfaction_rating or 5,
        comment=f.comment or "",
        createdAt=f.created_at.isoformat() + "Z" if f.created_at else datetime.utcnow().isoformat() + "Z",
    )

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(ServiceRequest).filter(ServiceRequest.id == payload.requestId).first()
    if not req:
        raise HTTPException(status_code=404, detail="Incident request not found")

    feedback_id = f"fb-{uuid.uuid4().hex[:8]}"
    feedback = CustomerFeedback(
        id=feedback_id,
        request_id=payload.requestId,
        user_id=current_user.id,
        user_name=current_user.name,
        user_email=current_user.email,
        rating=payload.rating,
        response_quality_rating=payload.responseQualityRating or 5,
        sla_satisfaction_rating=payload.slaSatisfactionRating or 5,
        comment=payload.comment or "",
        created_at=datetime.utcnow(),
    )

    db.add(feedback)

    # Append to incident timeline
    timeline = list(req.timeline or [])
    timeline.append({
        "id": f"tl-{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "title": f"Customer Feedback Submitted ({payload.rating} ⭐)",
        "description": f"Requester rated resolution experience {payload.rating}/5 stars: \"{payload.comment or 'No comment provided'}\"",
        "actor": {"name": current_user.name, "role": current_user.role, "avatar": current_user.avatar},
        "type": "comment",
    })
    req.timeline = timeline

    db.commit()
    db.refresh(feedback)

    AuditService.log(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        user_role=current_user.role,
        organization_id=current_user.organization_id,
        action="SUBMIT_CUSTOMER_FEEDBACK",
        resource=f"Feedback/{feedback.id}",
        status="SUCCESS",
        metadata={"requestId": payload.requestId, "rating": payload.rating}
    )

    return map_feedback_to_response(feedback)

@router.get("", response_model=FeedbackStatsResponse)
def get_feedback_analytics(db: Session = Depends(get_db)):
    feedbacks = db.query(CustomerFeedback).order_by(CustomerFeedback.created_at.desc()).all()
    total = len(feedbacks)

    if total == 0:
        return FeedbackStatsResponse(
            averageCsat=4.8,
            totalFeedbacks=0,
            responseQualityPercentage=94.0,
            slaSatisfactionPercentage=91.0,
            ratingDistribution={5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
            recentFeedbacks=[]
        )

    avg_rating = sum(f.rating for f in feedbacks) / total
    avg_response_q = (sum(f.response_quality_rating or 5 for f in feedbacks) / (total * 5.0)) * 100.0
    avg_sla_sat = (sum(f.sla_satisfaction_rating or 5 for f in feedbacks) / (total * 5.0)) * 100.0

    distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    for f in feedbacks:
        distribution[f.rating] = distribution.get(f.rating, 0) + 1

    return FeedbackStatsResponse(
        averageCsat=round(avg_rating, 2),
        totalFeedbacks=total,
        responseQualityPercentage=round(avg_response_q, 1),
        slaSatisfactionPercentage=round(avg_sla_sat, 1),
        ratingDistribution=distribution,
        recentFeedbacks=[map_feedback_to_response(f) for f in feedbacks[:10]]
    )
