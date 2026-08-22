from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class RiskFactorSchema(BaseModel):
    id: str
    label: str
    weight: float
    impact: str  # low, medium, high, critical
    description: str
    mitigationTip: Optional[str] = None

class RecommendedActionSchema(BaseModel):
    id: str
    type: str  # reassign, escalate_priority, add_co_assignee, extend_grace, trigger_playbook
    title: str
    description: str
    predictedRiskReduction: int
    targetAssigneeId: Optional[str] = None
    targetAssigneeName: Optional[str] = None
    isExecuted: Optional[bool] = False

class TimelineEventSchema(BaseModel):
    id: str
    timestamp: str
    title: str
    description: str
    actor: Dict[str, Any]
    type: str

class RequestCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = "General Support"
    department: Optional[str] = "IT Infrastructure"
    priority: Optional[str] = "P3_MEDIUM"
    slaTier: Optional[str] = "PLATINUM"
    complexityScore: Optional[int] = 5
    sentimentUrgency: Optional[str] = "moderate"
    tags: Optional[List[str]] = Field(default_factory=list)
    attachments: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    department: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigneeId: Optional[str] = None
    slaTier: Optional[str] = None
    riskScore: Optional[float] = None
    riskLevel: Optional[str] = None
    riskTrend: Optional[str] = None
    lastAiActionId: Optional[str] = None

class RequestReassign(BaseModel):
    assigneeId: str

class AddCommentRequest(BaseModel):
    message: str

class ExecuteAiActionRequest(BaseModel):
    actionId: str

class PreTriageRequest(BaseModel):
    title: str
    description: str
    category: Optional[str] = "General Support"

class PreTriageResponse(BaseModel):
    suggestedPriority: str
    estimatedResolutionHours: float
    complexityScore: int
    sentimentUrgency: str
    predictedBreachRisk: float
    detectedKeywords: List[str]
    suggestedDepartment: str

class ServiceRequestResponse(BaseModel):
    id: str
    ticketNumber: str
    title: str
    description: str
    category: str
    department: str
    priority: str
    status: str
    
    requesterId: str
    requesterName: str
    requesterEmail: str
    requesterAvatar: Optional[str] = None
    requesterCompany: Optional[str] = None
    
    assigneeId: Optional[str] = None
    assigneeName: Optional[str] = None
    assigneeEmail: Optional[str] = None
    assigneeAvatar: Optional[str] = None
    coAssignees: Optional[List[str]] = None
    
    createdAt: str
    updatedAt: str
    responseDueAt: str
    respondedAt: Optional[str] = None
    resolutionDueAt: str
    resolvedAt: Optional[str] = None
    slaTier: str
    
    riskScore: float
    riskLevel: str
    riskTrend: str
    riskExplanation: str
    riskFactors: List[Dict[str, Any]] = Field(default_factory=list)
    recommendedActions: List[Dict[str, Any]] = Field(default_factory=list)
    
    complexityScore: int
    sentimentUrgency: str
    tags: List[str] = Field(default_factory=list)
    timeline: List[Dict[str, Any]] = Field(default_factory=list)
    attachments: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

    class Config:
        from_attributes = True
