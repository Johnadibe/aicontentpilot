from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
import uuid

# Base Models
class ContentRequest(BaseModel):
    title: str
    type: str
    tone: Optional[str] = "professional"
    length: Optional[str] = "medium"
    keywords: Optional[List[str]] = []
    additional_params: Optional[Dict[str, Any]] = {}

class ContentResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    type: str
    created_at: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = {}

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
    serp_analysis: Optional[bool] = True
    semantic_keywords: Optional[bool] = True
    header_optimization: Optional[bool] = True
    internal_linking: Optional[bool] = False
    featured_snippet: Optional[bool] = True
    readability_optimization: Optional[bool] = True

# Tone Analysis Models
class ToneRequest(BaseModel):
    content: str
    target_tone: Optional[str] = None
    industry: Optional[str] = None

class ToneResponse(BaseModel):
    current_tone: str
    tone_analysis: Dict[str, float]
    suggestions: List[str]
    adjusted_content: Optional[str] = None

# Content Length Models
class SummarizeRequest(BaseModel):
    content: str
    target_length: str  # snippet, short, medium, long
    preserve_key_points: Optional[bool] = True

class SummarizeResponse(BaseModel):
    original_length: int
    summarized_length: int
    summary: str
    key_points: Optional[List[str]] = None
