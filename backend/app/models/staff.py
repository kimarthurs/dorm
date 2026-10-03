from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class DormitoryAdministrator(Base):
    __tablename__ = "dormitory_administrators"

    id = Column(Integer, primary_key=True, index=True)
    employee_no = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    
    #宿舍建筑
    managed_building_id = Column(Integer, ForeignKey("dormitory_buildings.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)

    user = relationship("User")
    managed_building = relationship("DormitoryBuilding")

class Counselor(Base):
    __tablename__ = "counselors"

    id = Column(Integer, primary_key=True, index=True)
    employee_no = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    college = Column(String)  #学院
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    user = relationship("User")