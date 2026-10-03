from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.dormitory import DormitoryBuilding, Room, Bed
from app.schemas.dormitory import BuildingCreate, BuildingResponse, RoomCreate, RoomResponse, BedCreate, BedResponse

router = APIRouter(prefix="/api/dormitories", tags=["Dormitories"])

def verify_admin(current_user: User):
    """管理者权限帮助函数"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")

@router.post("/buildings", response_model=BuildingResponse, status_code=status.HTTP_201_CREATED)
def create_building(building_in: BuildingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    verify_admin(current_user)
    
    new_building = DormitoryBuilding(**building_in.model_dump())
    db.add(new_building)
    db.commit()
    db.refresh(new_building)
    return new_building

@router.post("/rooms", response_model=RoomResponse, status_code=status.HTTP_201_CREATED)
def create_room(room_in: RoomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    verify_admin(current_user)
    
    new_room = Room(**room_in.model_dump(), status="可用")
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room

@router.post("/beds", response_model=BedResponse, status_code=status.HTTP_201_CREATED)
def create_bed(bed_in: BedCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    verify_admin(current_user)
    
    new_bed = Bed(**bed_in.model_dump(), status="空闲")
    db.add(new_bed)
    db.commit()
    db.refresh(new_bed)
    return new_bed