from fastapi import APIRouter, UploadFile, File, Response
import cv2
import numpy as np

from services.detection import detection_service
from schemas import DetectionResponse


router = APIRouter(prefix="/api", tags=["detection"])


@router.post("/detect/", response_model=DetectionResponse)
async def detect_image(
    file: UploadFile = File(...), 
    return_json: bool = False
):
    """
    Detect PPE objects in uploaded image
    
    Args:
        file: Uploaded image file
        return_json: If True, return JSON response. If False, return annotated image
        
    Returns:
        DetectionResponse with detected objects or annotated image
    """
    # Read image from uploaded file
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Perform detection
    detected_objects = detection_service.detect(img)
    
    if return_json:
        return DetectionResponse(detected_objects=detected_objects)
    
    # Draw bounding boxes on image
    img_with_boxes = detection_service.draw_boxes(img, detected_objects)
    
    # Encode result to JPEG
    _, buffer = cv2.imencode('.jpg', img_with_boxes)
    
    # Return image with bounding boxes
    return Response(content=buffer.tobytes(), media_type="image/jpeg")
