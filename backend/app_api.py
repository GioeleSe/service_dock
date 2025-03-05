from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Service Dock API",
    description="Simple API used to handle backend stuff",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Proper CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

from routers.airpurifier import ap_router
app.include_router(ap_router, prefix="/api")

# Root endpoint
@app.get("/")
def root():
    return {"message": "See API documentation at /api/docs or /api/redoc"}
