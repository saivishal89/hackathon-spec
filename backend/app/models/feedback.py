from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from app.database import Base

class CustomerFeedback(Base):
    __tablename__ = "customer_feedback"

    id = Column(String(64), primary_key=True, index=True)
    request_id = Column(String(64), index=True, nullable=False)
    user_id = Column(String(64), index=True, nullable=False)
    user_name = Column(String(255), nullable=False)
    user_email = Column(String(255), nullable=True)
    rating = Column(Integer, nullable=False)  # 1 to 5 stars
    response_quality_rating = Column(Integer, default=5)
    sla_satisfaction_rating = Column(Integer, default=5)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
