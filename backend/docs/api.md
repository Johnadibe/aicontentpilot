# AI Content Pilot API Documentation

## Authentication

All API endpoints require authentication using a Bearer token.

\`\`\`
Authorization: Bearer your_api_token
\`\`\`

## Content Generation Endpoints

### Generate General Content

**Endpoint:** `POST /api/content/generate`

**Request Body:**
\`\`\`json
{
  "title": "Example Title",
  "type": "BLOG_POST",
  "tone": "professional",
  "length": "medium",
  "keywords": ["example", "content"],
  "additional_params": {
    "custom_param": "value"
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "uuid",
  "title": "Example Title",
  "content": "Generated content...",
  "type": "BLOG_POST",
  "created_at": "2023-11-15T12:00:00Z",
  "metadata": {
    "tone": "professional",
    "length": "medium",
    "keywords": ["example", "content"],
    "custom_param": "value"
  }
}
\`\`\`

### Generate Blog Post

**Endpoint:** `POST /api/content/blog-post`

**Request Body:**
\`\`\`json
{
  "title": "Example Blog Post",
  "topic": "AI Content Generation",
  "template": "how-to",
  "target_audience": "marketers",
  "industry": "technology",
  "tone": "professional",
  "sections": ["Introduction", "Benefits", "How-to Steps", "Conclusion"],
  "word_count": 800,
  "keywords": ["AI", "content", "generation"]
}
\`\`\`

**Response:** Same as general content response.

### Generate Social Media Content

**Endpoint:** `POST /api/content/social-media`

**Request Body:**
\`\`\`json
{
  "platform": "twitter",
  "content_type": "text_post",
  "objective": "engagement",
  "topic": "New product launch",
  "tone": "casual",
  "include_hashtags": true,
  "include_emojis": true,
  "character_limit": 280
}
\`\`\`

**Response:** Same as general content response.

### Generate Email Copy

**Endpoint:** `POST /api/content/email`

**Request Body:**
\`\`\`json
{
  "email_type": "newsletter",
  "subject_line": "November Updates",
  "product_name": "AI Content Pilot",
  "company_name": "Tech Innovations",
  "target_audience": "subscribers",
  "include_personalization": true,
  "cta": "Try our new features",
  "tone": "friendly",
  "word_count": 300
}
\`\`\`

**Response:** Same as general content response.

### Generate Ad Copy

**Endpoint:** `POST /api/content/ad-copy`

**Request Body:**
\`\`\`json
{
  "platform": "google_ads",
  "ad_format": "responsive_search_ad",
  "product_name": "AI Content Pilot",
  "target_audience": "marketers",
  "unique_selling_point": "10x faster content creation",
  "tone": "persuasive",
  "include_cta": true,
  "keywords": ["AI content", "content automation"]
}
\`\`\`

**Response:** Same as general content response.

### Generate Product Description

**Endpoint:** `POST /api/content/product-description`

**Request Body:**
\`\`\`json
{
  "product_name": "AI Content Pilot Pro",
  "product_category": "software",
  "features": ["AI-powered content generation", "Multiple content types", "SEO optimization"],
  "benefits": ["Save time", "Improve quality", "Increase conversions"],
  "target_audience": "business_owners",
  "tone": "professional",
  "length": "standard",
  "include_technical_specs": true,
  "keywords": ["AI", "content generation", "automation"]
}
\`\`\`

**Response:** Same as general content response.

### Generate SEO Content

**Endpoint:** `POST /api/content/seo-content`

**Request Body:**
\`\`\`json
{
  "primary_keyword": "AI content generation",
  "secondary_keywords": ["content automation", "AI writing"],
  "content_type": "article",
  "target_audience": "marketers",
  "word_count": 1200,
  "include_faq": true,
  "meta_description": true,
  "tone": "informative",
  "serp_analysis": true,
  "semantic_keywords": true,
  "header_optimization": true,
  "internal_linking": true,
  "featured_snippet": true,
  "readability_optimization": true
}
\`\`\`

**Response:** Same as general content response.

### Analyze Tone

**Endpoint:** `POST /api/content/analyze-tone`

**Request Body:**
\`\`\`json
{
  "content": "Content to analyze...",
  "target_tone": "friendly",
  "industry": "technology"
}
\`\`\`

**Response:**
\`\`\`json
{
  "current_tone": "formal",
  "tone_analysis": {
    "formal": 0.7,
    "friendly": 0.2,
    "persuasive": 0.1
  },
  "suggestions": [
    "Use more conversational language",
    "Add personal pronouns like 'you' and 'we'",
    "Include more questions to engage the reader"
  ],
  "adjusted_content": "Adjusted content with friendly tone..."
}
\`\`\`

### Summarize Content

**Endpoint:** `POST /api/content/summarize`

**Request Body:**
\`\`\`json
{
  "content": "Long content to summarize...",
  "target_length": "short",
  "preserve_key_points": true
}
\`\`\`

**Response:**
\`\`\`json
{
  "original_length": 1200,
  "summarized_length": 100,
  "summary": "Summarized content...",
  "key_points": [
    "First key point",
    "Second key point",
    "Third key point"
  ]
}
\`\`\`

## Image Generation Endpoints

### Generate Image

**Endpoint:** `POST /api/images/generate`

**Request Body:**
\`\`\`json
{
  "prompt": "A futuristic city with flying cars",
  "width": 1024,
  "height": 1024,
  "num_images": 1
}
\`\`\`

**Response:**
\`\`\`json
{
  "images": [
    "https://example.com/image1.png"
  ]
}
\`\`\`
\`\`\`

Now, let's update the frontend components to support the new SEO content form:
