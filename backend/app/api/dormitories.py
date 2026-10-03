from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.dormitory import Room, Bed
from app.models.residence import ResidenceAssignment
from app.models.dormitory import DormitoryBuilding


router = APIRouter(
    prefix="/api/dormitories",
    tags=["宿舍管理"]
)


@router.get("/rooms")
def get_all_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    result = []

    for room in rooms:
        occupied_count = (
            db.query(Bed)
            .filter(
                Bed.room_id == room.id,
                Bed.status == "已占用"
            )
            .count()
        )

        result.append(
            {
                "id": room.id,
                "building": (
                    room.building.building_name
                    if room.building
                    else "未知"
                ),
                "roomNo": room.room_no,
                "floor": room.floor,
                "capacity": room.capacity,
                "occupied": occupied_count,
                "available": room.capacity - occupied_count,
                "status": room.status,
            }
        )

    return result


@router.get("/rooms/{room_id}/beds")
def get_room_beds(
    room_id: int,
    db: Session = Depends(get_db)
):
    beds = (
        db.query(Bed)
        .filter(Bed.room_id == room_id)
        .all()
    )

    result = []

    for bed in beds:
        assignment = (
            db.query(ResidenceAssignment)
            .filter(
                ResidenceAssignment.bed_id == bed.id,
                ResidenceAssignment.status == "有效入住"
            )
            .first()
        )

        student_name = "-"
        student_id = "-"

        if assignment and assignment.student:
            student_name = assignment.student.name
            student_id = assignment.student.student_no

        result.append(
            {
                "bedNo": bed.bed_no,
                "status": bed.status,
                "studentName": student_name,
                "studentId": student_id,
            }
        )

    return result