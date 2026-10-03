from pydantic import BaseModel
from datetime import date
from typing import Optional

class ResidenceCreate(BaseModel):
    student_id: int
    bed_id: int
    check_in_date: date
    check_out_date: Optional[date] = None

class ResidenceResponse(ResidenceCreate):
    id: int
    status: str
    handled_by_id: int

    class Config:
        from_attributes = True