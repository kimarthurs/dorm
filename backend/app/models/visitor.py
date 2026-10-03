from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class VisitorRecord(Base):
    __tablename__ = "visitor_records"

    id = Column(Integer, primary_key=True, index=True)
    visitor_name = Column(String, nullable=False)
    id_number = Column(String, nullable=False) #身份证号
    phone = Column(String)
    visit_time = Column(DateTime, nullable=False)
    leave_time = Column(DateTime, nullable=True)
    status = Column(String, default="在访") 
    
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    registered_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    student = relationship("Student")
    registrar = relationship("User")