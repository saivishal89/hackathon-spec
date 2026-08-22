from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.client import router as client_router
from app.api.requests import router as requests_router
from app.api.sla import router as sla_router
from app.api.users import router as users_router
from app.api.organizations import router as organizations_router
from app.api.notifications import router as notifications_router
from app.routers.feedback import router as feedback_router
from app.routers.analytics import router as analytics_router
from app.routers.subscriptions import router as subscriptions_router
from app.routers.health import router as health_router

__all__ = [
    "auth_router",
    "admin_router",
    "client_router",
    "requests_router",
    "sla_router",
    "users_router",
    "organizations_router",
    "notifications_router",
    "feedback_router",
    "analytics_router",
    "subscriptions_router",
    "health_router",
]
