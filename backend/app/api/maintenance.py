from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.maintenance import MaintenanceRequest
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse, MaintenanceUpdate

router = APIRouter(prefix="/api/maintenance", tags=["Maintenance"])

@router.post("/request", response_model=MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_maintenance_request(request_in: MaintenanceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit maintenance requests")
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    
    new_request = MaintenanceRequest(
        device_type=request_in.device_type,
        description=request_in.description,
        status="待处理",
        student_id=student.id
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.patch("/{request_id}/handle", response_model=MaintenanceResponse)
def handle_maintenance_request(request_id: int, update_in: MaintenanceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req.status = update_in.status
    req.handler_id = current_user.id
    if update_in.status == "已处理":
        req.completed_at = datetime.now()
        
    db.commit()
    db.refresh(req)
    return req