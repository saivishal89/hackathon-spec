from app.routers.auth import router as auth_router
from app.routers.requests import router as requests_router
from app.routers.policies import router as policies_router
from app.routers.feedback import router as feedback_router
from app.routers.analytics import router as analytics_router
from app.routers.subscriptions import router as subscriptions_router
from app.routers.health import router as health_router

__all__ = [
    "auth_router",
    "requests_router",
    "policies_router",
    "feedback_router",
    "analytics_router",
    "subscriptions_router",
    "health_router",
]
