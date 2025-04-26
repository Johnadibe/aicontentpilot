from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional

from app.models.content import ContentGenerationParams, ContentResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/email", response_model=ContentResponse)
async def generate_email_content(
    params: ContentGenerationParams,
    email_type: Optional[str] = None,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate email content based on the provided parameters
    """
    try:
        # Add email type to the parameters if specified
        if email_type:
            if params.additional_context:
                params.additional_context += f"\nEmail Type: {email_type}"
            else:
                params.additional_context = f"Email Type: {email_type}"
        
        content = await AIAgentFactory.generate_content("email", params, provider)
        
        return ContentResponse(
            content=content,
            metadata={
                "type": "email",
                "email_type": email_type,
                "provider": provider,
                "params": params.dict()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate email content: {str(e)}")
