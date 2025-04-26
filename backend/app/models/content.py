from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union

class ContentGenerationParams(BaseModel):
    topic: Optional[str] = None
    keywords: Optional[str] = None
    audience: Optional[str] = "general"
    tone: Optional[str] = "professional"
    length: Optional[int] = 800
    outline: Optional[List[str]] = None
    format: Optional[str] = None
    additional_context: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "topic": "Benefits of Meditation for Stress Reduction",
                "keywords": "meditation, stress relief, mindfulness, mental health",
                "audience": "beginners",
                "tone": "conversational",
                "length": 800,
                "outline": ["Introduction", "What is Meditation", "Benefits for Stress", "Getting Started", "Conclusion"],
                "additional_context": "Focus on scientific evidence and practical tips"
            }
        }

class ImageGenerationParams(BaseModel):
    prompt: str = Field(..., min_length=3, max_length=1000)
    size: Optional[str] = "1024x1024"
    quality: Optional[str] = "standard"
    style: Optional[str] = "natural"
    
    class Config:
        schema_extra = {
            "example": {
                "prompt": "A serene mountain landscape with a lake at sunset, digital art style",
                "size": "1024x1024",
                "quality": "hd",
                "style": "vivid"
            }
        }

class ContentResponse(BaseModel):
    content: str
    metadata: Dict[str, Any] = {}

class ImageResponse(BaseModel):
    url: str
    metadata: Dict[str, Any] = {}

class AnalysisRequest(BaseModel):
    content: str
    analysis_type: str

class AnalysisResponse(BaseModel):
    results: Dict[str, Any]
    suggestions: List[str] = []
