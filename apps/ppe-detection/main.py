from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers.detection import router as detection_router


# Create FastAPI application
app = FastAPI(
    title="PPE Detection API",
    description="API for detecting Personal Protective Equipment using YOLOv8",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(detection_router)


@app.get("/")
def health_check():
    """Health check endpoint"""
    return {"message": "Server is running"}
