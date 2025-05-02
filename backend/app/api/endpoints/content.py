from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

from app.core.config import settings
from app.agents.content_generator import ContentGenerator
from app.models.content import (
    ContentRequest, ContentResponse,
    BlogPostRequest, SocialMediaRequest, EmailCopyRequest,
    AdCopyRequest, ProductDescriptionRequest, SEOContentRequest,
    ToneRequest, ToneResponse, SummarizeRequest, SummarizeResponse
)

router = APIRouter()
content_generator = ContentGenerator()

@router.post("/generate", response_model=ContentResponse)
async def generate_content(request: ContentRequest):
    try:
        result = await content_generator.generate_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@router.post("/blog-post", response_model=ContentResponse)
async def generate_blog_post(request: BlogPostRequest):
    try:
        result = await content_generator.generate_blog_post(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating blog post: {str(e)}")

@router.post("/social-media", response_model=ContentResponse)
async def generate_social_media(request: SocialMediaRequest):
    try:
        result = await content_generator.generate_social_media(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating social media content: {str(e)}")

@router.post("/email", response_model=ContentResponse)
async def generate_email(request: EmailCopyRequest):
    try:
        result = await content_generator.generate_email(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating email copy: {str(e)}")

@router.post("/ad-copy", response_model=ContentResponse)
async def generate_ad_copy(request: AdCopyRequest):
    try:
        result = await content_generator.generate_ad_copy(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating ad copy: {str(e)}")

@router.post("/product-description", response_model=ContentResponse)
async def generate_product_description(request: ProductDescriptionRequest):
    try:
        result = await content_generator.generate_product_description(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating product description: {str(e)}")

@router.post("/seo-content", response_model=ContentResponse)
async def generate_seo_content(request: SEOContentRequest):
    try:
        result = await content_generator.generate_seo_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SEO content: {str(e)}")

@router.post("/analyze-tone", response_model=ToneResponse)
async def analyze_tone(request: ToneRequest):
    try:
        result = await content_generator.analyze_tone(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing tone: {str(e)}")

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_content(request: SummarizeRequest):
    try:
        result = await content_generator.summarize_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing content: {str(e)}")
