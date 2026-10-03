from pydantic import BaseModel
from typing import Optional

#建筑schema
class BuildingCreate(BaseModel):
    building_code: str
    building_name: str
    campus: Optional[str] = None
    gender_limit: Optional[str] = "无限制"

class BuildingResponse(BuildingCreate):
    id: int
    class Config:
        from_attributes = True

#房间schema
class RoomCreate(BaseModel):
    room_no: str
    floor: int
    capacity: int = 4
    building_id: int

class RoomResponse(RoomCreate):
    id: int
    status: Optional[str] = "可用"
    class Config:
        from_attributes = True

#床schema
class BedCreate(BaseModel):
    bed_no: str
    room_id: int

class BedResponse(BedCreate):
    id: int
    status: Optional[str] = "空闲"
    class Config:
        from_attributes = True