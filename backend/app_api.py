from fastapi import FastAPI
app = FastAPI(
    title="Service Dock API",
    description="simple API used to handle backend stuff",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)
from routers.airpurifier import ap_router
app.include_router(prefix="/api",router=ap_router)

api = FastAPI()
# re-route the root calls to (fastapi-generated) doc.
api.include_router(ap_router, prefix="/api")
@api.get("/")
def endpoints_list():
    return {"message": "See API documentation at /api/docs or /api/redoc"}