from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.dormitory import Bed
from app.models.residence import ResidenceAssignment
from app.schemas.residence import ResidenceCreate, ResidenceResponse

router = APIRouter(prefix="/api/residences", tags=["Residences"])

@router.post("/assign", response_model=ResidenceResponse, status_code=status.HTTP_201_CREATED)
def assign_bed(
    residence_in: ResidenceCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")

    student = db.query(Student).filter(Student.id == residence_in.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    bed = db.query(Bed).filter(Bed.id == residence_in.bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")
    if bed.status != "空闲":
        raise HTTPException(status_code=400, detail="Bed is not available")

    new_assignment = ResidenceAssignment(
        check_in_date=residence_in.check_in_date,
        check_out_date=residence_in.check_out_date,
        status="有效入住",  
        student_id=residence_in.student_id,
        bed_id=residence_in.bed_id,
        handled_by_id=current_user.id
    )

    bed.status = "已占用" 

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return new_assignment