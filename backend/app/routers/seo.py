from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, Optional, List

from app.models.content import ContentGenerationParams, ContentResponse, AnalysisRequest, AnalysisResponse
from app.agents.agent_factory import AIAgentFactory
from app.auth.auth_handler import get_current_user_id

router = APIRouter()

@router.post("/seo", response_model=ContentResponse)
async def generate_seo_content(
    params: ContentGenerationParams,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Generate SEO-optimized content based on the provided parameters
    """
    try:
        content = await AIAgentFactory.generate_content("seo", params, provider)
        
        return ContentResponse(
            content=content,
            metadata={
                "type": "seo",
                "provider": provider,
                "params": params.dict()
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate SEO content: {str(e)}")

@router.post("/analyze/seo", response_model=AnalysisResponse)
async def analyze_seo(
    request: AnalysisRequest,
    provider: str = "openai",
    user_id: str = Depends(get_current_user_id)
):
    """
    Analyze content for SEO optimization
    """
    try:
        analysis_result = await AIAgentFactory.analyze_content(request.content, "seo", provider)
        
        return AnalysisResponse(
            results=analysis_result.get("analysis", {}),
            suggestions=analysis_result.get("suggestions", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze SEO content: {str(e)}")
