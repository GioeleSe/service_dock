from typing import Annotated
from sqlmodel import SQLModel
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from fastapi import Depends
from database.models import Project, TemperatureHistory

sqlite_url: str = f"sqlite:///sqlite_db.db"
db_engine = create_engine(url=sqlite_url, connect_args={"check_same_thread": False})


def create_db_and_tables():
    SQLModel.metadata.create_all(db_engine)

def get_session():
    with Session(db_engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
