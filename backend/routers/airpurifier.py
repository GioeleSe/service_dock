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

@ap_router.post("/debug/{p}")
def set_airpurifier_debug(p:str) -> str:
    return f"Debug: {p}"

# Actual endpoints
@ap_router.get("/fan")
async def get_airpurifier_state() -> int:
    # send request using websocket to esp32 to get the current fan pin value 
    return 0 # range from 0 to 255 (will use pwm)


@ap_router.post("/fan")
async def set_airpurifier_state(param:int) -> int:
    r:int = -1
    if param in range(0,256):
        # send command to esp32 using websocket to set the fan speed
        r = param
    return r    