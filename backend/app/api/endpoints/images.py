from fastapi import APIRouter, HTTPException
from typing import List

from app.core.config import settings
from app.agents.image_generator import ImageGenerator
from app.models.images import ImageGenerationRequest, ImageGenerationResponse

router = APIRouter()
image_generator = ImageGenerator()

@router.post("/generate", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    try:
        result = await image_generator.generate_image(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")
