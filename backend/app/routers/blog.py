from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from app.models.content import ContentGenerationParams, ContentResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/blog", response_model=ContentResponse)
async def generate_blog_post(
    params: ContentGenerationParams,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate a blog post based on the provided parameters
    """
    try:
        content = await AIAgentFactory.generate_content("blog", params, provider)
        
        return ContentResponse(
            content=content,
            metadata={
                "type": "blog",
                "provider": provider,
                "params": params.dict()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate blog content: {str(e)}")
