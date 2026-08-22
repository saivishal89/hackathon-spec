from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    requestId: str
    rating: int = Field(ge=1, le=5)  # 1 to 5 stars
    responseQualityRating: Optional[int] = Field(default=5, ge=1, le=5)
    slaSatisfactionRating: Optional[int] = Field(default=5, ge=1, le=5)
    comment: Optional[str] = ""

class FeedbackResponse(BaseModel):
    id: str
    requestId: str
    userId: str
    userName: str
    userEmail: Optional[str] = None
    rating: int
    responseQualityRating: int
    slaSatisfactionRating: int
    comment: Optional[str] = None
    createdAt: str

    class Config:
        from_attributes = True

class FeedbackStatsResponse(BaseModel):
    averageCsat: float
    totalFeedbacks: int
    responseQualityPercentage: float
    slaSatisfactionPercentage: float
    ratingDistribution: Dict[int, int]
    recentFeedbacks: List[FeedbackResponse]
