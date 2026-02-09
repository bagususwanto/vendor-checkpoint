from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # CORS Configuration
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"]
    
    # Model Configuration
    model_path: str = "models/ppe.pt"
    confidence_threshold: float = 0.5
    
    # Detection Configuration
    skip_classes: List[str] = ["Mask", "NO-Mask", "Person"]
    
    # Class Names
    class_names: dict = {
        0: 'Hardhat',
        1: 'Mask',
        2: 'NO-Hardhat',
        3: 'NO-Mask',
        4: 'NO-Safety Vest',
        5: 'Person',
        6: 'Safety Cone',
        7: 'Safety Vest',
        8: 'machinery',
        9: 'vehicle'
    }
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()
