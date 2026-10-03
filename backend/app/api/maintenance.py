from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.maintenance import MaintenanceRequest

router = APIRouter(prefix="/api/maintenance", tags=["Maintenance"])

class MaintenanceCreate(BaseModel):
    device_type: str
    description: str

class MaintenanceUpdate(BaseModel):
    status: str

@router.post("/request", status_code=status.HTTP_201_CREATED)
def create_maintenance_request(request_in: MaintenanceCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="仅限学生提交报修")
    
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="未找到学生档案")
    
    new_request = MaintenanceRequest(
        device_type=request_in.device_type,
        description=request_in.description,
        status="待处理",
        student_id=student.id
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return {"message": "提交成功", "id": new_request.id}

@router.get("")
def get_maintenance_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "student":
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if not student:
            return []
        requests = db.query(MaintenanceRequest).filter(MaintenanceRequest.student_id == student.id).all()
    elif current_user.role in ["admin", "dormAdmin"]:
        requests = db.query(MaintenanceRequest).all()
    else:
        raise HTTPException(status_code=403, detail="权限不足")

    result = []
    for r in requests:
        student_name = r.student.name if r.student else ""
        student_no = r.student.student_no if r.student else ""
        result.append({
            "id": r.id,
            "device_type": r.device_type,
            "description": r.description,
            "status": r.status,
            "student_name": student_name,
            "student_no": student_no,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M") if hasattr(r, 'created_at') and r.created_at else "",
            "completed_at": r.completed_at.strftime("%Y-%m-%d %H:%M") if r.completed_at else ""
        })
    return result

@router.patch("/{request_id}/handle")
def handle_maintenance_request(request_id: int, update_in: MaintenanceUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "dormAdmin"]:
        raise HTTPException(status_code=403, detail="仅限管理员处理")
    
    req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="未找到报修记录")
        
    req.status = update_in.status
    if update_in.status == "已处理":
        req.completed_at = datetime.now()
        
    db.commit()
    db.refresh(req)
    return {"message": "处理成功"}