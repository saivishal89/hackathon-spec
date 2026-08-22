from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
def health_check():
    return {
        "ok": True,
        "service": "sla-ai-platform-backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "engine": "FastAPI + SQLAlchemy + SLA Proactive Prediction",
    }
