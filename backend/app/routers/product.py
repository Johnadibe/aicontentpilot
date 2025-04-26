from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional

from app.models.content import ContentGenerationParams, ContentResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/product", response_model=ContentResponse)
async def generate_product_description(
    params: ContentGenerationParams,
    product_category: Optional[str] = None,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate product description based on the provided parameters
    """
    try:
        # Add product category to the parameters if specified
        if product_category:
            if params.additional_context:
                params.additional_context += f"\nProduct Category: {product_category}"
            else:
                params.additional_context = f"Product Category: {product_category}"
        
        content = await AIAgentFactory.generate_content("product", params, provider)
        
        return ContentResponse(
            content=content,
            metadata={
                "type": "product",
                "product_category": product_category,
                "provider": provider,
                "params": params.dict()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate product description: {str(e)}")
