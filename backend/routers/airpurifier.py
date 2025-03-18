import datetime
from http.client import HTTPException
from typing import Dict, List, Tuple
from pydantic import BaseModel
from fastapi import APIRouter
from database.models import TemperatureHistory
from database import sqlite_db
from database.sqlite_db import SessionDep
from sqlalchemy import text, insert
from sqlalchemy.future import select

ap_router = APIRouter(
    prefix="/airpurifier",
    tags=["airpurifier"],
    responses={404: {"description": "Resource not found"}},
)


# Debug endpoints
@ap_router.get("/debug")
def get_airpurifier_debug() -> str:
    return "Debug"


@ap_router.post("/debug")
def set_airpurifier_debug(p: str) -> Dict[str, str]:
    return {"Debug": p}


class FanSpeedRequest(BaseModel):
    speed: int


class TemperatureData(BaseModel):
    environmental_now: Tuple[int, int, int, datetime.datetime]

class TemperatureHistoryResponse(BaseModel):
    environmental_history: List[Tuple[int, int, int, datetime.datetime]]

    class Config:
        arbitrary_types_allowed = True



# Actual endpoints
@ap_router.get("/fan")
async def get_airpurifier_state() -> Dict[str, int]:
    # send request using websocket to esp32 to get the current fan pin value 
    speed: int = 127

    return {"speed": speed}  # range from 0 to 255 (will use pwm)


@ap_router.post("/fan")
async def set_airpurifier_state(speed_req: FanSpeedRequest) -> Dict[str, int]:
    speed: int = -1
    if speed_req.speed in range(0, 256):
        # send command to esp32 using websocket to set the fan speed
        speed = speed_req.speed
    return {"speed": speed}


@ap_router.get("/environmental")
async def get_airpurifier_temperature() -> TemperatureData:
    # send request using websocket to esp32 to get the current temperature value

    return TemperatureData(environmental_now=(0, 1900, 4000, datetime.datetime.now()))

@ap_router.post("/environmental")
def set_airpurifier_temperature(data: TemperatureData, session: SessionDep) -> Dict[
    str, bool]:
    print(f"Received data: project_id={data.project_id}, temperature={data.temperature}, humidity={data.humidity}")

    stmt = insert(TemperatureHistory).values(
        project_id=data.project_id,
        temperature=data.temperature,
        humidity=data.humidity,
    )
    session.execute(stmt)
    session.commit()
    return {"Insert": True}


@ap_router.get("/environmental/history", response_model=TemperatureHistoryResponse)
async def get_airpurifier_environmental_history(session: SessionDep) -> TemperatureHistoryResponse:
    # fetch the history from the db (will use a parameter to get an explicit period)
    # history:List[models.TemperatureHistory] = []
    history = session.execute(text("SELECT * FROM TemperatureHistory"))
    if not history:
        raise HTTPException(status_code=404, detail="No history record found")
    environmental_history:List[Tuple[int,int,int,str]] = [
        (row.project_id, row.temperature, row.humidity, row.timestamp)
        for row in history
    ]
    # print(f"TemperatureHistoryResponse:{TemperatureHistoryResponse.model_json_schema()}")
    return TemperatureHistoryResponse(environmental_history=environmental_history)


