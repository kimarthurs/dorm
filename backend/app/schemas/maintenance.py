from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MaintenanceCreate(BaseModel):
    device_type: str
    description: str

class MaintenanceUpdate(BaseModel):
    status: str 

class MaintenanceResponse(MaintenanceCreate):
    id: int
    status: str
    student_id: int
    handler_id: Optional[int] = None
    submitted_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True