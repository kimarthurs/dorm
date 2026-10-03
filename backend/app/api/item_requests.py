from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/items",
    tags=["物品出入申请"]
)


class ItemRequestCreate(BaseModel):
    item_name: str
    access_type: str
    planned_time: str
    reason: str


class ReviewRequest(BaseModel):
    status: str
    review_comment: str = ""


mock_requests = []
request_id_counter = 1


@router.post("/request")
def create_item_request(
    request: ItemRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    global request_id_counter

    new_request = {
        "id": request_id_counter,
        "item_name": request.item_name,
        "access_type": request.access_type,
        "planned_time": request.planned_time,
        "reason": request.reason,
        "status": "待审核",
        "student_id": current_user.username,
        "student_name": "金将源",
        "residence": "A栋 305室",
        "review_comment": "",
    }

    mock_requests.append(new_request)
    request_id_counter += 1

    return new_request


@router.get("/my")
def get_my_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    my_requests = [
        request
        for request in mock_requests
        if request["student_id"] == current_user.username
    ]

    return my_requests


@router.patch("/{request_id}/cancel")
def cancel_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for request in mock_requests:
        if request["id"] == request_id:
            if request["student_id"] != current_user.username:
                raise HTTPException(
                    status_code=403,
                    detail="只能撤销本人提交的申请。"
                )

            if request["status"] != "待审核":
                raise HTTPException(
                    status_code=400,
                    detail="只有待审核状态的申请可以撤销。"
                )

            request["status"] = "已撤销"
            return request

    raise HTTPException(
        status_code=404,
        detail="未找到对应的申请记录。"
    )


@router.get("/pending")
def get_pending_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "dormAdmin":
        raise HTTPException(
            status_code=403,
            detail="仅限宿舍管理员访问。"
        )

    pending_requests = [
        request
        for request in mock_requests
        if request["status"] == "待审核"
    ]

    return pending_requests


@router.patch("/{request_id}/review")
def review_request(
    request_id: int,
    review: ReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "dormAdmin":
        raise HTTPException(
            status_code=403,
            detail="仅限宿舍管理员审核申请。"
        )

    if review.status not in {"已批准", "已驳回"}:
        raise HTTPException(
            status_code=400,
            detail="审核状态只能为“已批准”或“已驳回”。"
        )

    if review.status == "已驳回" and not review.review_comment.strip():
        raise HTTPException(
            status_code=400,
            detail="驳回申请时必须填写驳回原因。"
        )

    for request in mock_requests:
        if request["id"] == request_id:
            if request["status"] != "待审核":
                raise HTTPException(
                    status_code=400,
                    detail="该申请已经处理，不能重复审核。"
                )

            request["status"] = review.status
            request["review_comment"] = review.review_comment.strip()

            return request

    raise HTTPException(
        status_code=404,
        detail="未找到对应的申请记录。"
    )