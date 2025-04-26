from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional

from app.models.content import ContentGenerationParams, ContentResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/ad", response_model=ContentResponse)
async def generate_ad_copy(
    params: ContentGenerationParams,
    ad_platform: Optional[str] = None,
    ad_format: Optional[str] = None,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate ad copy based on the provided parameters
    """
    try:
        # Add ad platform and format to the parameters if specified
        additional_context = []
        if ad_platform:
            additional_context.append(f"Ad Platform: {ad_platform}")
        if ad_format:
            additional_context.append(f"Ad Format: {ad_format}")
        
        if additional_context:
            context_str = "\n".join(additional_context)
            if params.additional_context:
                params.additional_context += f"\n{context_str}"
            else:
                params.additional_context = context_str
        
        content = await AIAgentFactory.generate_content("ad", params, provider)
        
        return ContentResponse(
            content=content  params, provider)
        
        return ContentResponse(
            content=content,
            metadata={
                "type": "ad",
                "ad_platform": ad_platform,
                "ad_format": ad_format,
                "provider": provider,
                "params": params.dict()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate ad copy: {str(e)}")
