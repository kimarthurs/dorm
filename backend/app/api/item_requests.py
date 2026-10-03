from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.student import Student
from app.models.item_request import ItemAccessRequest
from app.schemas.item_request import ItemRequestCreate, ItemRequestResponse, ItemRequestReview
from datetime import datetime

router = APIRouter(prefix="/api/items", tags=["Item Requests"])

@router.post("/request", response_model=ItemRequestResponse, status_code=status.HTTP_201_CREATED)
def create_item_request(
    request_in: ItemRequestCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit item access requests")
    
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")

    new_request = ItemAccessRequest(
        item_name=request_in.item_name,
        access_type=request_in.access_type,
        planned_time=request_in.planned_time,
        reason=request_in.reason,
        status="待审核",  
        student_id=student.id
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@router.patch("/{request_id}/review", response_model=ItemRequestResponse)
def review_item_request(
    request_id: int,
    review_in: ItemRequestReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    관리자가 학생의 물품 출입 신청을 승인하거나 반려합니다.
    """
    # 1. 권한 확인 (관리자만 심사 가능)
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    
    # 2. 신청서 조회
    item_request = db.query(ItemAccessRequest).filter(ItemAccessRequest.id == request_id).first()
    if not item_request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    # 3. 상태 및 심사 정보 업데이트
    item_request.status = review_in.status
    item_request.reviewer_id = current_user.id
    item_request.reviewed_at = datetime.now()
    
    db.commit()
    db.refresh(item_request)
    
    return item_request