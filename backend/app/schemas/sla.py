from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class SLATargetSchema(BaseModel):
    priority: str
    targetResponseMinutes: int
    targetResolutionHours: int
    escalationThresholdMinutes: int

class SLAPolicySchema(BaseModel):
    id: str
    name: str
    tier: str  # PLATINUM, GOLD, SILVER, STANDARD
    description: Optional[str] = None
    businessHours: str = "24x7"
    breachPenaltyEnabled: bool = True
    breachPenaltyPerMinuteUsd: float = 50.0
    isDefault: bool = False
    targets: List[Dict[str, Any]] = Field(default_factory=list)

    class Config:
        from_attributes = True

class SLAPolicyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    businessHours: Optional[str] = None
    breachPenaltyEnabled: Optional[bool] = None
    breachPenaltyPerMinuteUsd: Optional[float] = None
    isDefault: Optional[bool] = None
    targets: Optional[List[Dict[str, Any]]] = None
