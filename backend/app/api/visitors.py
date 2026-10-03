from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.visitor import VisitorRecord
from app.schemas.visitor import VisitorCreate, VisitorResponse

router = APIRouter(prefix="/api/visitors", tags=["Visitors"])

@router.post("/register", response_model=VisitorResponse, status_code=status.HTTP_201_CREATED)
def register_visitor(visitor_in: VisitorCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
        
    new_visitor = VisitorRecord(
        visitor_name=visitor_in.visitor_name,
        id_number=visitor_in.id_number,
        phone=visitor_in.phone,
        visit_time=visitor_in.visit_time,
        status="在访",
        student_id=visitor_in.student_id,
        registered_by_id=current_user.id
    )
    db.add(new_visitor)
    db.commit()
    db.refresh(new_visitor)
    return new_visitor

@router.patch("/{record_id}/leave", response_model=VisitorResponse)
def record_visitor_departure(record_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
        
    record = db.query(VisitorRecord).filter(VisitorRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    record.status = "已离开"
    record.leave_time = datetime.now()
    
    db.commit()
    db.refresh(record)
    return record