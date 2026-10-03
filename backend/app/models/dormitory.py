from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class DormitoryBuilding(Base):
    __tablename__ = "dormitory_buildings"

    id = Column(Integer, primary_key=True, index=True)
    building_code = Column(String, unique=True, index=True, nullable=False)
    building_name = Column(String, nullable=False)
    campus = Column(String)
    gender_limit = Column(String) 

    #设定关系 (1:N)
    rooms = relationship("Room", back_populates="building", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_no = Column(String, nullable=False)
    floor = Column(Integer)
    capacity = Column(Integer, default=4)
    status = Column(String)  
    
    building_id = Column(Integer, ForeignKey("dormitory_buildings.id"), nullable=False)

    #设定关系
    building = relationship("DormitoryBuilding", back_populates="rooms")
    beds = relationship("Bed", back_populates="room", cascade="all, delete-orphan")


class Bed(Base):
    __tablename__ = "beds"

    id = Column(Integer, primary_key=True, index=True)
    bed_no = Column(String, nullable=False)
    status = Column(String, default="空闲")  
    
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)

    #设定关系
    room = relationship("Room", back_populates="beds")