from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, Base, engine
from app.models import user, student, dormitory, residence
from app.models import staff, item_request, maintenance, visitor, log #生成的模型import
from app.api import auth, students, dormitories, residence, item_requests
from datetime import datetime
from app.api import maintenance, visitors
from app.api import statistics

app = FastAPI(title="校园宿舍事务与出入登记管理系统 API")
app = FastAPI()

Base.metadata.create_all(bind=engine) #一app开始就数据库的表自动生成
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(dormitories.router)
app.include_router(residence.router)
app.include_router(item_requests.router)
app.include_router(maintenance.router) 
app.include_router(visitors.router)
app.include_router(statistics.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://dorm-f8cgo7pyi-kimarthurs-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "校园宿舍事务与出入登记管理系统 API服务器正常运行中"}

@app.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "PostgreSQL数据库连接成功"}
    except Exception as e:
        return {"status": "error", "message": f"数据库连接失败: {str(e)}"}