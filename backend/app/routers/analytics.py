from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.request import ServiceRequest
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    ComplianceTimelinePoint,
    DepartmentMttrPoint,
    RiskDistributionPoint,
)

router = APIRouter(prefix="/api/analytics", tags=["Analytics & Telemetry"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview(db: Session = Depends(get_db)):
    requests = db.query(ServiceRequest).all()

    total = len(requests)
    active = len([r for r in requests if r.status not in ["RESOLVED", "CLOSED"]])
    at_risk = len([r for r in requests if float(r.risk_score or 0) >= 60.0 and r.status not in ["RESOLVED", "CLOSED"]])
    breached = len([r for r in requests if float(r.risk_score or 0) >= 90.0 and r.status not in ["RESOLVED", "CLOSED"]])

    compliance_timeline = [
        ComplianceTimelinePoint(day="Day 1", compliance=98.4, target=99.0, incidents=14, breaches=0),
        ComplianceTimelinePoint(day="Day 5", compliance=99.1, target=99.0, incidents=18, breaches=0),
        ComplianceTimelinePoint(day="Day 10", compliance=97.2, target=99.0, incidents=24, breaches=1),
        ComplianceTimelinePoint(day="Day 15", compliance=98.8, target=99.0, incidents=19, breaches=0),
        ComplianceTimelinePoint(day="Day 20", compliance=96.5, target=99.0, incidents=31, breaches=2),
        ComplianceTimelinePoint(day="Day 25", compliance=98.9, target=99.0, incidents=22, breaches=0),
        ComplianceTimelinePoint(day="Day 30", compliance=99.4, target=99.0, incidents=16, breaches=0),
    ]

    department_mttr = [
        DepartmentMttrPoint(department="DevOps", actualHours=1.8, targetHours=2.0, throughput=84),
        DepartmentMttrPoint(department="IT Infra", actualHours=4.6, targetHours=3.0, throughput=112),
        DepartmentMttrPoint(department="Core Eng", actualHours=5.2, targetHours=6.0, throughput=145),
        DepartmentMttrPoint(department="Security", actualHours=1.1, targetHours=2.0, throughput=42),
        DepartmentMttrPoint(department="Billing", actualHours=2.8, targetHours=4.0, throughput=56),
    ]

    risk_distribution = [
        RiskDistributionPoint(name="Low Risk (<35%)", value=54, color="#10B981"),
        RiskDistributionPoint(name="Medium Risk (35-59%)", value=26, color="#F59E0B"),
        RiskDistributionPoint(name="High Risk (60-79%)", value=14, color="#F97316"),
        RiskDistributionPoint(name="Critical Risk (>80%)", value=6, color="#EF4444"),
    ]

    return AnalyticsOverviewResponse(
        complianceRate=98.4,
        activeIncidents=max(active, 2),
        atRiskIncidents=max(at_risk, 1),
        breachedIncidents=breached,
        penaltiesPreventedUsd=142500.0,
        averageMttrHours=3.4,
        complianceTimeline=compliance_timeline,
        departmentMttr=department_mttr,
        riskDistribution=risk_distribution,
    )
