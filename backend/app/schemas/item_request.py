from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ItemRequestCreate(BaseModel):
    item_name: str
    access_type: str  
    planned_time: datetime
    reason: Optional[str] = None

class ItemRequestResponse(ItemRequestCreate):
    id: int
    status: str
    student_id: int
    submitted_at: datetime
    
    class Config:
        from_attributes = True


class ItemRequestReview(BaseModel):
    status: str