from pydantic import BaseModel
from typing import List


class DetectedObject(BaseModel):
    """Schema for a single detected object"""
    class_name: str
    bbox: List[int]  # [x1, y1, x2, y2]
    confidence: float


class DetectionResponse(BaseModel):
    """Schema for detection API response"""
    detected_objects: List[DetectedObject]
