from typing import List, Dict, Any
from pydantic import BaseModel

class ComplianceTimelinePoint(BaseModel):
    day: str
    compliance: float
    target: float
    incidents: int
    breaches: int

class DepartmentMttrPoint(BaseModel):
    department: str
    actualHours: float
    targetHours: float
    throughput: int

class RiskDistributionPoint(BaseModel):
    name: str
    value: int
    color: str

class AnalyticsOverviewResponse(BaseModel):
    complianceRate: float
    activeIncidents: int
    atRiskIncidents: int
    breachedIncidents: int
    penaltiesPreventedUsd: float
    averageMttrHours: float
    complianceTimeline: List[ComplianceTimelinePoint]
    departmentMttr: List[DepartmentMttrPoint]
    riskDistribution: List[RiskDistributionPoint]
