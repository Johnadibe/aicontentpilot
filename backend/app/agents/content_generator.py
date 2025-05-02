import openai
from typing import Dict, Any, List, Optional
import uuid
from datetime import datetime
import requests
from bs4 import BeautifulSoup

from app.core.config import settings
from app.models.content import (
    ContentRequest, ContentResponse,
    BlogPostRequest, SocialMediaRequest, EmailCopyRequest,
    AdCopyRequest, ProductDescriptionRequest, SEOContentRequest,
    ToneRequest, ToneResponse, SummarizeRequest, SummarizeResponse
)
from app.utils.text_utils import extract_meta_description, count_words

class ContentGenerator:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        
    async def generate_content(self, request: ContentRequest) -> ContentResponse:
        """Generate general content based on the request."""
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
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=2000
        )
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=request.title,
            content=response,
            type=request.type,
            created_at=datetime.now(),
            metadata={
                "tone": request.tone,
                "length": request.length,
                "keywords": request.keywords,
                **request.additional_params
            }
        )
    
    async def generate_blog_post(self, request: BlogPostRequest) -> ContentResponse:
        """Generate a blog post based on the request."""
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
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000
        )
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=request.title,
            content=response,
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
    
    async def generate_social_media(self, request: SocialMediaRequest) -> ContentResponse:
        """Generate social media content based on the request."""
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
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000
        )
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=f"{request.platform} {request.content_type}",
            content=response,
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
    
    async def generate_email(self, request: EmailCopyRequest) -> ContentResponse:
        """Generate email copy based on the request."""
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
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=2000
        )
        
        # Generate subject line if not provided
        subject_line = request.subject_line
        if not subject_line and "Subject:" in response:
            subject_parts = response.split("Subject:", 1)
            if len(subject_parts) > 1:
                subject_line_parts = subject_parts[1].split("\n", 1)
                if len(subject_line_parts) > 0:
                    subject_line = subject_line_parts[0].strip()
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=subject_line or f"{request.email_type} Email",
            content=response,
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
    
    async def generate_ad_copy(self, request: AdCopyRequest) -> ContentResponse:
        """Generate ad copy based on the request."""
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
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000
        )
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=f"{request.platform} {request.ad_format} for {request.product_name}",
            content=response,
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
    
    async def generate_product_description(self, request: ProductDescriptionRequest) -> ContentResponse:
        """Generate product description based on the request."""
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
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1500
        )
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=f"Product Description: {request.product_name}",
            content=response,
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
    
    async def generate_seo_content(self, request: SEOContentRequest) -> ContentResponse:
        """Generate SEO-optimized content based on the request."""
        # Prepare additional data for SEO optimization
        serp_data = None
        semantic_keywords = []
        
        # If SERP analysis is requested, fetch top results
        if request.serp_analysis:
            serp_data = await self._analyze_serp(request.primary_keyword)
        
        # If semantic keywords are requested, generate them
        if request.semantic_keywords:
            semantic_keywords = await self._generate_semantic_keywords(request.primary_keyword)
        
        # Prepare the system prompt
        system_prompt = f"You are an SEO content expert. Create {request.content_type} content optimized for search engines with a {request.tone} tone for {request.target_audience} audience."
        
        # Prepare the user prompt
        user_prompt = f"Create SEO-optimized {request.content_type} content for the primary keyword: {request.primary_keyword}\n\n"
        
        if request.secondary_keywords:
            user_prompt += f"Secondary keywords to include: {', '.join(request.secondary_keywords)}\n"
        
        if semantic_keywords:
            user_prompt += f"Semantic keywords to include: {', '.join(semantic_keywords[:10])}\n"
        
        user_prompt += f"\nTarget word count: {request.word_count}\n"
        
        if request.include_faq:
            user_prompt += "\nInclude an FAQ section with at least 3 questions and answers related to the topic.\n"
        
        if request.meta_description:
            user_prompt += "\nInclude a meta description of approximately 150-160 characters.\n"
        
        if request.header_optimization:
            user_prompt += "\nEnsure proper use of H1, H2, and H3 headers for SEO structure.\n"
        
        if request.featured_snippet:
            user_prompt += "\nOptimize content for featured snippets by including a concise definition or step-by-step process.\n"
        
        if request.readability_optimization:
            user_prompt += "\nEnsure content is highly readable with short paragraphs, bullet points, and simple language.\n"
        
        if serp_data:
            user_prompt += "\nBased on top-ranking content, consider covering these topics:\n"
            for topic in serp_data[:5]:
                user_prompt += f"- {topic}\n"
        
        if request.internal_linking:
            user_prompt += "\nSuggest internal linking opportunities with placeholder URLs like [INTERNAL_LINK: topic].\n"
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000
        )
        
        # Extract meta description if requested
        meta_description = None
        if request.meta_description:
            meta_description = extract_meta_description(response)
        
        # Create response
        return ContentResponse(
            id=str(uuid.uuid4()),
            title=f"SEO Content: {request.primary_keyword}",
            content=response,
            type="SEO_CONTENT",
            created_at=datetime.now(),
            metadata={
                "primary_keyword": request.primary_keyword,
                "secondary_keywords": request.secondary_keywords,
                "semantic_keywords": semantic_keywords if request.semantic_keywords else None,
                "content_type": request.content_type,
                "target_audience": request.target_audience,
                "word_count": request.word_count,
                "include_faq": request.include_faq,
                "meta_description": meta_description,
                "tone": request.tone,
                "serp_analysis": serp_data if request.serp_analysis else None
            }
        )
    
    async def analyze_tone(self, request: ToneRequest) -> ToneResponse:
        """Analyze the tone of content and provide suggestions for adjusting it."""
        system_prompt = "You are an expert content analyst specializing in tone analysis and adjustment."
        
        user_prompt = f"Analyze the tone of the following content:\n\n{request.content}\n\n"
        
        if request.target_tone:
            user_prompt += f"The target tone is: {request.target_tone}\n"
        
        if request.industry:
            user_prompt += f"The content is for the {request.industry} industry.\n"
        
        user_prompt += "\nProvide the following in your response:\n"
        user_prompt += "1. Current tone assessment (formal, casual, etc.)\n"
        user_prompt += "2. Tone analysis with percentages (e.g., formal: 70%, friendly: 20%, etc.)\n"
        user_prompt += "3. Suggestions for tone improvement\n"
        
        if request.target_tone:
            user_prompt += f"4. Adjusted content to match the {request.target_tone} tone\n"
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=3000,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        import json
        try:
            result = json.loads(response)
            
            # Extract the data
            current_tone = result.get("current_tone", "unknown")
            tone_analysis = result.get("tone_analysis", {})
            suggestions = result.get("suggestions", [])
            adjusted_content = result.get("adjusted_content") if request.target_tone else None
            
            return ToneResponse(
                current_tone=current_tone,
                tone_analysis=tone_analysis,
                suggestions=suggestions,
                adjusted_content=adjusted_content
            )
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return ToneResponse(
                current_tone="analysis failed",
                tone_analysis={},
                suggestions=["Error analyzing tone"],
                adjusted_content=None
            )
    
    async def summarize_content(self, request: SummarizeRequest) -> SummarizeResponse:
        """Summarize content to a target length."""
        # Determine target word count
        length_map = {
            "snippet": 50,
            "short": 100,
            "medium": 200,
            "long": 400
        }
        target_words = length_map.get(request.target_length, 200)
        
        # Count original words
        original_word_count = count_words(request.content)
        
        system_prompt = "You are an expert content summarizer."
        
        user_prompt = f"Summarize the following content to approximately {target_words} words:\n\n{request.content}\n\n"
        
        if request.preserve_key_points:
            user_prompt += "Ensure all key points are preserved in the summary.\n"
            user_prompt += "Also provide a bullet-point list of the key points at the end of your response.\n"
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=2000
        )
        
        # Extract key points if requested
        key_points = []
        summary = response
        
        if request.preserve_key_points and "Key Points:" in response:
            parts = response.split("Key Points:", 1)
            summary = parts[0].strip()
            
            if len(parts) > 1:
                points_text = parts[1].strip()
                key_points = [point.strip().lstrip('•-*').strip() for point in points_text.split('\n') if point.strip()]
        
        # Count summarized words
        summarized_word_count = count_words(summary)
        
        return SummarizeResponse(
            original_length=original_word_count,
            summarized_length=summarized_word_count,
            summary=summary,
            key_points=key_points if request.preserve_key_points else None
        )
    
    async def _call_openai(self, system_prompt: str, user_prompt: str, max_tokens: int = 2000, temperature: float = 0.7, response_format: Optional[Dict[str, str]] = None) -> str:
        """Call the OpenAI API with the given prompts."""
        try:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            kwargs = {
                "model": settings.DEFAULT_MODEL,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
            }
            
            if response_format:
                kwargs["response_format"] = response_format
            
            response = openai.chat.completions.create(**kwargs)
            
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error calling OpenAI API: {str(e)}")
    
    async def _analyze_serp(self, keyword: str) -> List[str]:
        """Analyze SERP for a keyword to extract common topics."""
        system_prompt = "You are an SEO expert analyzing search results."
        
        user_prompt = f"Based on the keyword '{keyword}', what are the most important topics that should be covered in content to rank well? Provide a list of 10 topics."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        import json
        try:
            result = json.loads(response)
            topics = result.get("topics", [])
            return topics if isinstance(topics, list) else []
        except json.JSONDecodeError:
            return []
    
    async def _generate_semantic_keywords(self, keyword: str) -> List[str]:
        """Generate semantic keywords related to the primary keyword."""
        system_prompt = "You are an SEO expert specializing in semantic keyword research."
        
        user_prompt = f"Generate a list of 15 semantic keywords related to '{keyword}'. These should be terms and phrases that are semantically related to the main keyword and would help with SEO. Provide the result as a JSON array."
        
        # Call OpenAI API
        response = await self._call_openai(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            max_tokens=1000,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        import json
        try:
            result = json.loads(response)
            keywords = result.get("keywords", [])
            return keywords if isinstance(keywords, list) else []
        except json.JSONDecodeError:
            return []
