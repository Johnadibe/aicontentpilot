from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional

from app.models.content import ContentGenerationParams, ContentResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/social", response_model=ContentResponse)
async def generate_social_media_content(
    params: ContentGenerationParams,
    platform: Optional[str] = None,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate social media content based on the provided parameters
    """
    try:
        # Add platform to the parameters if specified
        if platform:
            if params.additional_context:
                params.additional_context += f"\nPlatform: {platform}"
            else:
                params.additional_context = f"Platform: {platform}"
        
        content = await AIAgentFactory.generate_content("social", params, provider)
        
        return ContentResponse(
            content=content,
            metadata={
                "type": "social",
                "platform": platform,
                "provider": provider,
                "params": params.dict()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate social media content: {str(e)}")
