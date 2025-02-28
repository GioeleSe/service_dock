from fastapi import FastAPI
app = FastAPI()

from routers.airpurifier import ap_router
app.include_router(prefix="/api",router=ap_router)