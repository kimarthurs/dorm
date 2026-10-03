from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ResidenceAssignment(Base):
    __tablename__ = "residence_assignments"

    id = Column(Integer, primary_key=True, index=True)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=True)
    status = Column(String, nullable=False) 

    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    bed_id = Column(Integer, ForeignKey("beds.id"), nullable=False)
    handled_by_id = Column(Integer, ForeignKey("users.id"), nullable=False) 

    student = relationship("Student")
    bed = relationship("Bed")
    handler = relationship("User")