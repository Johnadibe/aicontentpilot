from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
import os
import openai
from datetime import datetime
import uuid
import json

app = FastAPI(title="AI Content Pilot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    print("Warning: OPENAI_API_KEY environment variable not set")

# Base Models
class ContentRequest(BaseModel):
    title: str
    type: str
    tone: Optional[str] = "professional"
    length: Optional[str] = "medium"
    keywords: Optional[List[str]] = []
    additional_params: Optional[Dict[str, Any]] = {}

class ContentResponse(BaseModel):
    id: str
    title: str
    content: str
    type: str
    created_at: datetime
    metadata: Dict[str, Any]

class ImageGenerationRequest(BaseModel):
    prompt: str
    width: int = 1024
    height: int = 1024
    num_images: int = 1

class ImageGenerationResponse(BaseModel):
    images: List[str]

# Specialized Content Models
class BlogPostRequest(BaseModel):
    title: str
    topic: str
    template: Optional[str] = "standard"
    target_audience: Optional[str] = "general"
    industry: Optional[str] = "general"
    tone: Optional[str] = "professional"
    sections: Optional[List[str]] = None
    word_count: Optional[int] = 800
    keywords: Optional[List[str]] = []

class SocialMediaRequest(BaseModel):
    platform: str
    content_type: str
    objective: Optional[str] = "engagement"
    topic: str
    tone: Optional[str] = "casual"
    include_hashtags: Optional[bool] = True
    include_emojis: Optional[bool] = True
    character_limit: Optional[int] = None

class EmailCopyRequest(BaseModel):
    email_type: str
    subject_line: Optional[str] = None
    product_name: Optional[str] = None
    company_name: Optional[str] = None
    target_audience: Optional[str] = "general"
    include_personalization: Optional[bool] = True
    cta: Optional[str] = None
    tone: Optional[str] = "professional"
    word_count: Optional[int] = 300

class AdCopyRequest(BaseModel):
    platform: str
    ad_format: str
    product_name: str
    target_audience: Optional[str] = "general"
    unique_selling_point: Optional[str] = None
    tone: Optional[str] = "persuasive"
    include_cta: Optional[bool] = True
    character_limit: Optional[int] = None
    keywords: Optional[List[str]] = []

class ProductDescriptionRequest(BaseModel):
    product_name: str
    product_category: str
    features: Optional[List[str]] = []
    benefits: Optional[List[str]] = []
    target_audience: Optional[str] = "general"
    tone: Optional[str] = "professional"
    length: Optional[str] = "standard"
    include_technical_specs: Optional[bool] = False
    keywords: Optional[List[str]] = []

class SEOContentRequest(BaseModel):
    primary_keyword: str
    secondary_keywords: Optional[List[str]] = []
    content_type: Optional[str] = "article"
    target_audience: Optional[str] = "general"
    word_count: Optional[int] = 1000
    include_faq: Optional[bool] = True
    meta_description: Optional[bool] = True
    tone: Optional[str] = "informative"

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to AI Content Pilot API"}

@app.post("/api/generate-content", response_model=ContentResponse)
async def generate_content(request: ContentRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Prepare the prompt based on content type
        system_prompt = f"You are an expert content creator specializing in {request.type.replace('_', ' ').lower()}. Create content with a {request.tone} tone."
        
        # Build the user prompt based on content type and additional parameters
        user_prompt = f"Title: {request.title}\n\n"
        
        if request.keywords:
            user_prompt += f"Keywords to include: {', '.join(request.keywords)}\n\n"
        
        if request.length:
            length_guide = {
                "short": "Create concise content around 300-400 words.",
                "medium": "Create standard content around 600-800 words.",
                "long": "Create detailed content around 1200-1500 words."
            }
            user_prompt += f"{length_guide.get(request.length, 'Create content of appropriate length.')}\n\n"
        
        # Add any additional parameters
        for key, value in request.additional_params.items():
            if isinstance(value, list):
                value = ", ".join(value)
            user_prompt += f"{key.replace('_', ' ').title()}: {value}\n"
        
        user_prompt += f"\nCreate {request.type.replace('_', ' ').lower()} content."
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=2000,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=request.title,
            content=generated_content,
            type=request.type,
            created_at=datetime.now(),
            metadata={
                "tone": request.tone,
                "length": request.length,
                "keywords": request.keywords,
                **request.additional_params
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")

@app.post("/api/generate-blog-post", response_model=ContentResponse)
async def generate_blog_post(request: BlogPostRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Prepare the system prompt
        system_prompt = f"You are an expert blog writer specializing in {request.industry} content for {request.target_audience} audiences. Write in a {request.tone} tone."
        
        # Prepare the user prompt
        user_prompt = f"Create a {request.template} blog post titled: {request.title}\n\n"
        user_prompt += f"Topic: {request.topic}\n"
        
        if request.sections:
            user_prompt += "Sections to include:\n"
            for section in request.sections:
                user_prompt += f"- {section}\n"
        
        user_prompt += f"\nTarget word count: {request.word_count}\n"
        
        if request.keywords:
            user_prompt += f"Keywords to include: {', '.join(request.keywords)}\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=3000,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=request.title,
            content=generated_content,
            type="BLOG_POST",
            created_at=datetime.now(),
            metadata={
                "template": request.template,
                "target_audience": request.target_audience,
                "industry": request.industry,
                "tone": request.tone,
                "word_count": request.word_count,
                "keywords": request.keywords
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating blog post: {str(e)}")

@app.post("/api/generate-social-media", response_model=ContentResponse)
async def generate_social_media(request: SocialMediaRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Set character limits based on platform
        platform_limits = {
            "twitter": 280,
            "linkedin": 3000,
            "facebook": 5000,
            "instagram": 2200
        }
        
        char_limit = request.character_limit or platform_limits.get(request.platform.lower(), 1000)
        
        # Prepare the system prompt
        system_prompt = f"You are a social media content expert for {request.platform}. Create {request.content_type} content with a {request.tone} tone aimed at {request.objective}."
        
        # Prepare the user prompt
        user_prompt = f"Create a {request.platform} {request.content_type} about: {request.topic}\n\n"
        user_prompt += f"Character limit: {char_limit}\n"
        
        if request.include_hashtags:
            user_prompt += "Include relevant hashtags.\n"
        
        if request.include_emojis:
            user_prompt += "Include appropriate emojis.\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=f"{request.platform} {request.content_type}",
            content=generated_content,
            type="SOCIAL_MEDIA",
            created_at=datetime.now(),
            metadata={
                "platform": request.platform,
                "content_type": request.content_type,
                "objective": request.objective,
                "tone": request.tone,
                "include_hashtags": request.include_hashtags,
                "include_emojis": request.include_emojis,
                "character_limit": char_limit
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating social media content: {str(e)}")

@app.post("/api/generate-email", response_model=ContentResponse)
async def generate_email(request: EmailCopyRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Prepare the system prompt
        system_prompt = f"You are an email marketing expert. Create a {request.email_type} email with a {request.tone} tone for {request.target_audience} audience."
        
        # Prepare the user prompt
        user_prompt = f"Create a {request.email_type} email"
        
        if request.subject_line:
            user_prompt += f" with subject line: {request.subject_line}"
        
        user_prompt += "\n\n"
        
        if request.product_name:
            user_prompt += f"Product: {request.product_name}\n"
        
        if request.company_name:
            user_prompt += f"Company: {request.company_name}\n"
        
        if request.include_personalization:
            user_prompt += "Include personalization tokens like {{first_name}}.\n"
        
        if request.cta:
            user_prompt += f"Call to action: {request.cta}\n"
        
        user_prompt += f"\nTarget word count: {request.word_count}\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=2000,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Generate subject line if not provided
        subject_line = request.subject_line
        if not subject_line and "Subject:" in generated_content:
            subject_parts = generated_content.split("Subject:", 1)
            if len(subject_parts) > 1:
                subject_line_parts = subject_parts[1].split("\n", 1)
                if len(subject_line_parts) > 0:
                    subject_line = subject_line_parts[0].strip()
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=subject_line or f"{request.email_type} Email",
            content=generated_content,
            type="EMAIL",
            created_at=datetime.now(),
            metadata={
                "email_type": request.email_type,
                "subject_line": subject_line,
                "product_name": request.product_name,
                "company_name": request.company_name,
                "target_audience": request.target_audience,
                "include_personalization": request.include_personalization,
                "cta": request.cta,
                "tone": request.tone,
                "word_count": request.word_count
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating email copy: {str(e)}")

@app.post("/api/generate-ad-copy", response_model=ContentResponse)
async def generate_ad_copy(request: AdCopyRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Set character limits based on platform and format
        platform_limits = {
            "google_ads": {
                "responsive_search_ad": {"headline": 30, "description": 90},
                "display_ad": {"headline": 25, "description": 90}
            },
            "facebook_ads": {
                "feed_ad": {"headline": 40, "description": 125},
                "carousel_ad": {"headline": 40, "description": 125}
            },
            "linkedin_ads": {
                "sponsored_content": {"headline": 150, "description": 150},
                "text_ad": {"headline": 25, "description": 75}
            }
        }
        
        # Prepare the system prompt
        system_prompt = f"You are an advertising copywriter specializing in {request.platform} {request.ad_format} ads. Write in a {request.tone} tone for {request.target_audience} audience."
        
        # Prepare the user prompt
        user_prompt = f"Create ad copy for {request.product_name} on {request.platform} using the {request.ad_format} format.\n\n"
        
        if request.unique_selling_point:
            user_prompt += f"Unique selling point: {request.unique_selling_point}\n"
        
        if request.include_cta:
            user_prompt += "Include a strong call to action.\n"
        
        if request.keywords:
            user_prompt += f"Keywords to include: {', '.join(request.keywords)}\n"
        
        # Get platform-specific character limits
        platform_key = request.platform.lower().replace(" ", "_")
        format_key = request.ad_format.lower().replace(" ", "_")
        
        if platform_key in platform_limits and format_key in platform_limits[platform_key]:
            limits = platform_limits[platform_key][format_key]
            user_prompt += f"\nHeadline character limit: {limits['headline']}\n"
            user_prompt += f"Description character limit: {limits['description']}\n"
        elif request.character_limit:
            user_prompt += f"\nCharacter limit: {request.character_limit}\n"
        
        user_prompt += "\nPlease format the output as follows:\n"
        user_prompt += "Headline 1: [headline text]\n"
        user_prompt += "Headline 2: [headline text]\n"
        user_prompt += "Headline 3: [headline text]\n"
        user_prompt += "Description 1: [description text]\n"
        user_prompt += "Description 2: [description text]\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=f"{request.platform} {request.ad_format} for {request.product_name}",
            content=generated_content,
            type="AD_COPY",
            created_at=datetime.now(),
            metadata={
                "platform": request.platform,
                "ad_format": request.ad_format,
                "product_name": request.product_name,
                "target_audience": request.target_audience,
                "unique_selling_point": request.unique_selling_point,
                "tone": request.tone,
                "include_cta": request.include_cta,
                "character_limit": request.character_limit,
                "keywords": request.keywords
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating ad copy: {str(e)}")

@app.post("/api/generate-product-description", response_model=ContentResponse)
async def generate_product_description(request: ProductDescriptionRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Determine length in words
        length_words = {
            "short": 100,
            "standard": 200,
            "detailed": 400
        }
        word_count = length_words.get(request.length, 200)
        
        # Prepare the system prompt
        system_prompt = f"You are a product description writer specializing in {request.product_category} products. Write in a {request.tone} tone for {request.target_audience} audience."
        
        # Prepare the user prompt
        user_prompt = f"Create a {request.length} product description for: {request.product_name}\n\n"
        
        if request.features:
            user_prompt += "Features to highlight:\n"
            for feature in request.features:
                user_prompt += f"- {feature}\n"
        
        if request.benefits:
            user_prompt += "\nBenefits to emphasize:\n"
            for benefit in request.benefits:
                user_prompt += f"- {benefit}\n"
        
        if request.include_technical_specs:
            user_prompt += "\nInclude technical specifications in a structured format.\n"
        
        if request.keywords:
            user_prompt += f"\nKeywords to include: {', '.join(request.keywords)}\n"
        
        user_prompt += f"\nTarget word count: approximately {word_count} words.\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1500,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=f"Product Description: {request.product_name}",
            content=generated_content,
            type="PRODUCT_DESCRIPTION",
            created_at=datetime.now(),
            metadata={
                "product_name": request.product_name,
                "product_category": request.product_category,
                "features": request.features,
                "benefits": request.benefits,
                "target_audience": request.target_audience,
                "tone": request.tone,
                "length": request.length,
                "include_technical_specs": request.include_technical_specs,
                "keywords": request.keywords
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating product description: {str(e)}")

@app.post("/api/generate-seo-content", response_model=ContentResponse)
async def generate_seo_content(request: SEOContentRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Prepare the system prompt
        system_prompt = f"You are an SEO content expert. Create {request.content_type} content optimized for search engines with a {request.tone} tone for {request.target_audience} audience."
        
        # Prepare the user prompt
        user_prompt = f"Create SEO-optimized {request.content_type} content for the primary keyword: {request.primary_keyword}\n\n"
        
        if request.secondary_keywords:
            user_prompt += f"Secondary keywords to include: {', '.join(request.secondary_keywords)}\n"
        
        user_prompt += f"\nTarget word count: {request.word_count}\n"
        
        if request.include_faq:
            user_prompt += "\nInclude an FAQ section with at least 3 questions and answers related to the topic.\n"
        
        if request.meta_description:
            user_prompt += "\nInclude a meta description of approximately 150-160 characters.\n"
        
        user_prompt += "\nEnsure proper use of H1, H2, and H3 headers for SEO structure.\n"
        
        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=3000,
            temperature=0.7,
        )
        
        # Extract the generated content
        generated_content = response.choices[0].message.content
        
        # Extract meta description if requested
        meta_description = None
        if request.meta_description and "Meta Description:" in generated_content:
            meta_parts = generated_content.split("Meta Description:", 1)
            if len(meta_parts) > 1:
                meta_desc_parts = meta_parts[1].split("\n", 1)
                if len(meta_desc_parts) > 0:
                    meta_description = meta_desc_parts[0].strip()
        
        # Create response
        content_response = ContentResponse(
            id=str(uuid.uuid4()),
            title=f"SEO Content: {request.primary_keyword}",
            content=generated_content,
            type="SEO_CONTENT",
            created_at=datetime.now(),
            metadata={
                "primary_keyword": request.primary_keyword,
                "secondary_keywords": request.secondary_keywords,
                "content_type": request.content_type,
                "target_audience": request.target_audience,
                "word_count": request.word_count,
                "include_faq": request.include_faq,
                "meta_description": meta_description,
                "tone": request.tone
            }
        )
        
        return content_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating SEO content: {str(e)}")

@app.post("/api/generate-image", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    if not openai_api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    try:
        # Call OpenAI API for image generation
        response = openai.images.generate(
            model="dall-e-3",
            prompt=request.prompt,
            n=request.num_images,
            size=f"{request.width}x{request.height}"
        )
        
        # Extract image URLs
        image_urls = [image.url for image in response.data]
        
        return ImageGenerationResponse(images=image_urls)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
