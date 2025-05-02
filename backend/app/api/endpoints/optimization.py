from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any

from app.agents.content_optimizer import ContentOptimizer
from app.models.optimization import (
    SEOAnalysisRequest, SEOAnalysisResponse,
    ReadabilityRequest, ReadabilityResponse,
    GrammarCheckRequest, GrammarCheckResponse,
    SentimentAnalysisRequest, SentimentAnalysisResponse,
    KeywordDensityRequest, KeywordDensityResponse,
    MetadataGeneratorRequest, MetadataGeneratorResponse,
    ContentImproverRequest, ContentImproverResponse
)

router = APIRouter()
content_optimizer = ContentOptimizer()

@router.post("/seo-analysis", response_model=SEOAnalysisResponse)
async def analyze_seo(request: SEOAnalysisRequest):
    """Analyze content for SEO optimization."""
    try:
        result = await content_optimizer.analyze_seo(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing SEO: {str(e)}")

@router.post("/readability", response_model=ReadabilityResponse)
async def analyze_readability(request: ReadabilityRequest):
    """Analyze content readability."""
    try:
        result = await content_optimizer.analyze_readability(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing readability: {str(e)}")

@router.post("/grammar-check", response_model=GrammarCheckResponse)
async def check_grammar(request: GrammarCheckRequest):
    """Check grammar and spelling in content."""
    try:
        result = await content_optimizer.check_grammar(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking grammar: {str(e)}")

@router.post("/sentiment-analysis", response_model=SentimentAnalysisResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """Analyze sentiment of content."""
    try:
        result = await content_optimizer.analyze_sentiment(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing sentiment: {str(e)}")

@router.post("/keyword-density", response_model=KeywordDensityResponse)
async def analyze_keyword_density(request: KeywordDensityRequest):
    """Analyze keyword density in content."""
    try:
        result = await content_optimizer.analyze_keyword_density(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing keyword density: {str(e)}")

@router.post("/generate-metadata", response_model=MetadataGeneratorResponse)
async def generate_metadata(request: MetadataGeneratorRequest):
    """Generate title and meta description options."""
    try:
        result = await content_optimizer.generate_metadata(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating metadata: {str(e)}")

@router.post("/improve-content", response_model=ContentImproverResponse)
async def improve_content(request: ContentImproverRequest):
    """Improve content based on specified parameters."""
    try:
        result = await content_optimizer.improve_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error improving content: {str(e)}")
