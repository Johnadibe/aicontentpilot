from pydantic import BaseModel
from typing import List, Optional

class ImageGenerationRequest(BaseModel):
    prompt: str
    width: int = 1024
    height: int = 1024
    num_images: int = 1

class ImageGenerationResponse(BaseModel):
    images: List[str]
