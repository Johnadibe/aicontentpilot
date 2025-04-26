from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from app.models.content import ImageGenerationParams, ImageResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/image", response_model=ImageResponse)
async def generate_image(
    params: ImageGenerationParams,
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate an image based on the provided parameters
    """
    try:
        result = await AIAgentFactory.generate_image(params)
        
        return ImageResponse(
            url=result["url"],
            metadata=result["metadata"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")
