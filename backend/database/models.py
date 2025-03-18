import datetime
from sqlalchemy import ForeignKey, table
from sqlalchemy.orm import relationship
from sqlmodel import SQLModel, Field, Relationship


class Project(SQLModel, table=True):
    id:int = Field(default=0, primary_key=True, index=True)
    name:str = Field(unique=True, index=True)
    description:str = Field(nullable=True)

    temperature_history: "TemperatureHistory" = Relationship(back_populates="project")

class TemperatureHistory(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    temperature: int = Field(nullable=False)
    humidity: int = Field(nullable=False)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.now, nullable=False)

    project: "Project" = Relationship(back_populates="temperature_history")
