from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db, Base, engine
from app.models import user, student #生成的模型import

app = FastAPI(title="校园宿舍事务与出入登记管理系统 API")

Base.metadata.create_all(bind=engine) #一app开始就数据库的表自动生成

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