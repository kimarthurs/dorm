from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class VisitorCreate(BaseModel):
    visitor_name: str
    id_number: str
    phone: Optional[str] = None
    visit_time: datetime
    student_id: int

class VisitorResponse(VisitorCreate):
    id: int
    status: str 
    registered_by_id: int
    leave_time: Optional[datetime] = None

    class Config:
        from_attributes = True