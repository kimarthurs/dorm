from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.dormitory import DormitoryBuilding, Room, Bed
from app.models.residence import ResidenceAssignment
from app.models.visitor import VisitorRecord
from app.models.item_request import ItemAccessRequest 

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])

@router.get("/summary")
def get_dormitory_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "dormAdmin", "counselor"]:
        raise HTTPException(status_code=403, detail="权限不足")

    total_students = db.query(ResidenceAssignment).filter(ResidenceAssignment.status == "有效入住").count()
    
    empty_beds = db.query(Bed).filter(Bed.status == "空闲").count()
    
    pending_requests = 0
    try:
        pending_requests = db.query(ItemAccessRequest).filter(ItemAccessRequest.status == "待审核").count()
    except Exception:
        pending_requests = 0

    current_visitors = db.query(VisitorRecord).filter(VisitorRecord.status == "在访").count()

    buildings = db.query(DormitoryBuilding).all()
    building_stats = []
    
    for b in buildings:
        room_count = len(b.rooms)
        occupied_beds = 0
        empty_b = 0
        
        for r in b.rooms:
            for bed in r.beds:
                if bed.status == "已占用":
                    occupied_beds += 1
                else:
                    empty_b += 1
                    
        building_stats.append({
            "building": b.building_name,
            "roomCount": room_count,
            "occupied": occupied_beds,
            "empty": empty_b
        })

    return {
        "summary": {
            "totalStudents": total_students,
            "emptyBeds": empty_beds,
            "pendingRequests": pending_requests,
            "currentVisitors": current_visitors
        },
        "buildingStats": building_stats
    }