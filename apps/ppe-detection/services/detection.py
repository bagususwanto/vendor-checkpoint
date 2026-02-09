import cv2
import cvzone
import numpy as np
from ultralytics import YOLO
from typing import List, Tuple

from config import settings
from schemas import DetectedObject


class DetectionService:
    """Service for PPE detection using YOLOv8"""
    
    def __init__(self):
        """Initialize the detection service and load the YOLO model"""
        self.model = YOLO(settings.model_path)
        self.class_names = settings.class_names
        self.confidence_threshold = settings.confidence_threshold
        self.skip_classes = settings.skip_classes
    
    def detect(self, image: np.ndarray) -> List[DetectedObject]:
        """
        Detect PPE objects in the given image
        
        Args:
            image: Input image as numpy array
            
        Returns:
            List of detected objects with class, bbox, and confidence
        """
        results = self.model(image, stream=True)
        detected_objects = []
        
        for r in results:
            for box in r.boxes:
                if box.conf is None or box.cls is None:
                    continue
                
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = round(float(box.conf[0]), 2)
                cls = int(box.cls[0])
                current_class = self.class_names.get(cls, "Unknown")
                
                # Skip specified classes
                if current_class in self.skip_classes:
                    continue
                
                if conf > self.confidence_threshold:
                    detected_objects.append(
                        DetectedObject(
                            class_name=current_class,
                            bbox=[x1, y1, x2, y2],
                            confidence=conf
                        )
                    )
        
        return detected_objects
    
    def draw_boxes(
        self, 
        image: np.ndarray, 
        detected_objects: List[DetectedObject]
    ) -> np.ndarray:
        """
        Draw bounding boxes on the image
        
        Args:
            image: Input image as numpy array
            detected_objects: List of detected objects
            
        Returns:
            Image with drawn bounding boxes
        """
        for obj in detected_objects:
            x1, y1, x2, y2 = obj.bbox
            color = (0, 255, 0) if "NO-" not in obj.class_name else (0, 0, 255)
            
            cvzone.putTextRect(
                image, 
                f'{obj.class_name} {obj.confidence}', 
                (x1, y1), 
                scale=1, 
                thickness=1, 
                colorB=color
            )
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 3)
        
        return image


# Global detection service instance
detection_service = DetectionService()
