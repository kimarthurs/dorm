from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.visitor import VisitorRecord
from app.models.student import Student

router = APIRouter(prefix="/api/visitors", tags=["Visitors"])

class VisitorRegisterRequest(BaseModel):
    visitor_name: str
    id_number: str
    phone: str
    visit_time: datetime
    student_no: str

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_visitor(req: VisitorRegisterRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "dormAdmin"]:
        raise HTTPException(status_code=403, detail="权限不足")
        
    student = db.query(Student).filter(Student.student_no == req.student_no).first()
    if not student:
        raise HTTPException(status_code=404, detail="未找到该学生")

    new_visitor = VisitorRecord(
        visitor_name=req.visitor_name,
        id_number=req.id_number,
        phone=req.phone,
        visit_time=req.visit_time,
        status="在访",
        student_id=student.id,
        registered_by_id=current_user.id
    )
    db.add(new_visitor)
    db.commit()
    db.refresh(new_visitor)
    return {"message": "登记成功", "id": new_visitor.id}

@router.patch("/{record_id}/leave")
def record_visitor_departure(record_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "dormAdmin"]:
        raise HTTPException(status_code=403, detail="权限不足")
        
    record = db.query(VisitorRecord).filter(VisitorRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="未找到记录")
        
    record.status = "已离开"
    record.leave_time = datetime.now()
    
    db.commit()
    db.refresh(record)
    return {"message": "已登记离开"}

@router.get("")
def get_visitors(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "dormAdmin"]:
        raise HTTPException(status_code=403, detail="权限不足")
        
    records = db.query(VisitorRecord).order_by(VisitorRecord.visit_time.desc()).all()
    result = []
    
    for r in records:
        student_name = r.student.name if hasattr(r, 'student') and r.student else ""
        student_no = r.student.student_no if hasattr(r, 'student') and r.student else ""
        
        result.append({
            "id": r.id,
            "visitor_name": r.visitor_name,
            "phone": r.phone,
            "student_name": student_name,
            "student_no": student_no,
            "visit_time": r.visit_time.strftime("%Y-%m-%d %H:%M") if r.visit_time else "",
            "leave_time": r.leave_time.strftime("%Y-%m-%d %H:%M") if r.leave_time else "",
            "status": r.status
        })
        
    return result