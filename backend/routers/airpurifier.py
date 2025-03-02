from typing import Dict
from pydantic import BaseModel
from fastapi import APIRouter


ap_router = APIRouter(
    prefix="/airpurifier",
    tags=["airpurifier"],
    responses={404: {"description":"Resource not found"}},
)

# Debug endpoints
@ap_router.get("/debug")
def get_airpurifier_debug() -> str:
    return "Debug"

@ap_router.post("/debug")
def set_airpurifier_debug(p:str) -> Dict[str,str]:
    return {"Debug": {p}}



# Actual endpoints
@ap_router.get("/fan")
async def get_airpurifier_state() -> Dict[str, int]:
    # send request using websocket to esp32 to get the current fan pin value 
    speed:int = 127

    return {"speed":speed} # range from 0 to 255 (will use pwm)

class FanSpeedRequest(BaseModel):
    speed: int

@ap_router.post("/fan")
async def set_airpurifier_state(speed_req:FanSpeedRequest) -> Dict[str, int]:
    speed:int = -1
    if speed_req.speed in range(0,256):
        # send command to esp32 using websocket to set the fan speed
        speed = speed_req.speed
    return {"speed":speed}