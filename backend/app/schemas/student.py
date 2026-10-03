from pydantic import BaseModel
from typing import Optional

#生成profile的话要传送的数据
class StudentCreate(BaseModel):
    student_no: str
    name: str
    gender: Optional[str] = None
    phone: Optional[str] = None
    college: Optional[str] = None

#服务器回应的数据
class StudentResponse(StudentCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True