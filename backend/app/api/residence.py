from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.dormitory import Bed, DormitoryBuilding, Room
from app.models.residence import ResidenceAssignment
from app.models.student import Student
from app.models.user import User


router = APIRouter(
    prefix="/api/residences",
    tags=["住宿分配管理"]
)


class AssignBedRequest(BaseModel):
    student_no: str
    building_name: str
    room_no: str
    bed_no: str
    check_in_date: date
    check_out_date: Optional[date] = None


@router.post("/assign", status_code=status.HTTP_201_CREATED)
def assign_bed(
    request: AssignBedRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "dormAdmin"]:
        raise HTTPException(
            status_code=403,
            detail="仅限宿舍管理员访问。"
        )

    student = (
        db.query(Student)
        .filter(Student.student_no == request.student_no)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="未找到对应的学生信息。"
        )

    bed = (
        db.query(Bed)
        .join(Room)
        .join(DormitoryBuilding)
        .filter(
            DormitoryBuilding.building_name == request.building_name,
            Room.room_no == request.room_no,
            Bed.bed_no == request.bed_no
        )
        .first()
    )

    if not bed:
        raise HTTPException(
            status_code=404,
            detail="未找到指定的床位信息。"
        )

    if bed.status != "空闲":
        raise HTTPException(
            status_code=400,
            detail="该床位当前不可分配。"
        )

    active_assignment = (
        db.query(ResidenceAssignment)
        .filter(
            ResidenceAssignment.student_id == student.id,
            ResidenceAssignment.status == "有效入住"
        )
        .first()
    )

    if active_assignment:
        raise HTTPException(
            status_code=400,
            detail="该学生当前已有有效住宿记录，请先办理调宿或退宿。"
        )

    new_assignment = ResidenceAssignment(
        check_in_date=request.check_in_date,
        check_out_date=request.check_out_date,
        status="有效入住",
        student_id=student.id,
        bed_id=bed.id,
        handled_by_id=current_user.id
    )

    bed.status = "已占用"

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return {
        "message": "床位分配成功。",
        "assignment_id": new_assignment.id
    }


@router.get("/my")
def get_my_residence(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=403,
            detail="仅限学生访问。"
        )

    student = (
        db.query(Student)
        .filter(Student.student_no == current_user.username)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="未找到当前用户对应的学生档案。"
        )

    assignment = (
        db.query(ResidenceAssignment)
        .filter(
            ResidenceAssignment.student_id == student.id,
            ResidenceAssignment.status == "有效入住"
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="当前暂无有效住宿分配记录。"
        )

    bed = db.query(Bed).filter(Bed.id == assignment.bed_id).first()

    if not bed or not bed.room or not bed.room.building:
        raise HTTPException(
            status_code=500,
            detail="住宿数据不完整，请联系宿舍管理员。"
        )

    roommates = []

    room_beds = (
        db.query(Bed)
        .filter(Bed.room_id == bed.room.id)
        .order_by(Bed.bed_no)
        .all()
    )

    for room_bed in room_beds:
        room_assignment = (
            db.query(ResidenceAssignment)
            .filter(
                ResidenceAssignment.bed_id == room_bed.id,
                ResidenceAssignment.status == "有效入住"
            )
            .first()
        )

        if room_assignment and room_assignment.student:
            roommates.append(
                {
                    "bedNo": room_bed.bed_no,
                    "name": room_assignment.student.name,
                    "status": (
                        "本人"
                        if room_assignment.student_id == student.id
                        else "已入住"
                    )
                }
            )
        else:
            roommates.append(
                {
                    "bedNo": room_bed.bed_no,
                    "name": "-",
                    "status": "空闲"
                }
            )

    return {
        "campus": bed.room.building.campus,
        "building": bed.room.building.building_name,
        "roomNo": bed.room.room_no,
        "bedNo": bed.bed_no,
        "status": assignment.status,
        "checkInDate": (
            assignment.check_in_date.strftime("%Y-%m-%d")
            if assignment.check_in_date
            else "-"
        ),
        "roommates": roommates
    }

@router.get("/unassigned-students")
def get_unassigned_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "dormAdmin"]:
        raise HTTPException(
            status_code=403,
            detail="仅限管理员访问。"
        )

    assigned_records = (
        db.query(ResidenceAssignment.student_id)
        .filter(ResidenceAssignment.status == "有效入住")
        .all()
    )

    assigned_ids = [record[0] for record in assigned_records]

    if assigned_ids:
        unassigned_students = (
            db.query(Student)
            .filter(~Student.id.in_(assigned_ids))
            .all()
        )
    else:
        unassigned_students = db.query(Student).all()

    return [
        {
            "student_no": student.student_no,
            "name": student.name,
            "gender": student.gender,
            "college": student.college,
        }
        for student in unassigned_students
    ]    