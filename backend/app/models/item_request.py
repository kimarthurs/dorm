from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class ItemAccessRequest(Base):
    __tablename__ = "item_access_requests"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    access_type = Column(String, nullable=False)
    planned_time = Column(DateTime)
    reason = Column(String)
    status = Column(String, default="待审核") 
    
    submitted_at = Column(DateTime, server_default=func.now())
    reviewed_at = Column(DateTime, nullable=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    student = relationship("Student")
    reviewer = relationship("User")