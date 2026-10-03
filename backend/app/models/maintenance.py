from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    device_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="待处理") 
    
    submitted_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    handler_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    student = relationship("Student")
    handler = relationship("User")