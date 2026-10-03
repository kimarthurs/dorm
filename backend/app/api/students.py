from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.student import Student
from app.models.user import User
from app.schemas.student import StudentCreate, StudentResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/students", tags=["Students"])

@router.post("/profile", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student_profile(
    student_in: StudentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 이 부분 덕분에 토큰이 없으면 접근 불가!
):
    """
    현재 로그인한 계정에 학생 상세 프로필을 연결하여 생성합니다.
    """
    # 1. 권한 체크 (학생 권한인 유저만 프로필 생성 가능)
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can create a student profile")
        
    # 2. 이미 프로필이 있는지 중복 체크
    existing_profile = db.query(Student).filter(Student.user_id == current_user.id).first()
    if existing_profile:
        raise HTTPException(status_code=400, detail="Profile already exists for this user")

    # 3. 중복 학번 체크
    existing_student_no = db.query(Student).filter(Student.student_no == student_in.student_no).first()
    if existing_student_no:
        raise HTTPException(status_code=400, detail="Student number already registered")

    # 4. DB에 학생 정보 저장 (현재 유저 ID 맵핑)
    new_student = Student(
        student_no=student_in.student_no,
        name=student_in.name,
        gender=student_in.gender,
        phone=student_in.phone,
        college=student_in.college,
        user_id=current_user.id
    )
    
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return new_student