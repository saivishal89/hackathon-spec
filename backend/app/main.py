from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.api import (
    auth_router,
    admin_router,
    client_router,
    requests_router,
    sla_router,
    users_router,
    organizations_router,
    notifications_router,
    feedback_router,
    analytics_router,
    subscriptions_router,
    health_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize relational tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="SLA AI Platform API",
    description="Autonomous B2B SaaS Platform for Predictive SLA Management, Risk Forecasting, and Customer Feedback Governance.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(client_router)
app.include_router(requests_router)
app.include_router(sla_router)
app.include_router(users_router)
app.include_router(organizations_router)
app.include_router(notifications_router)
app.include_router(feedback_router)
app.include_router(analytics_router)
app.include_router(subscriptions_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to SLA AI Platform API ⚡",
        "docs": "/docs",
        "health": "/api/health",
        "version": "1.0.0",
        "tagline": "Predict -> Prevent -> Resolve -> Learn",
    }
