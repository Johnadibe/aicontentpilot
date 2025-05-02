import { toast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Base content generation
export async function generateContent(data: {
  title: string
  prompt?: string
  tags?: string[]
  type: string
  tone?: string
  length?: string
  keywords?: string[]
  additional_params?: Record<string, any>
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating content:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate content",
      variant: "destructive",
    })
    throw error
  }
}

// Blog post generation
export async function generateBlogPost(data: {
  title: string
  topic: string
  template?: string
  target_audience?: string
  industry?: string
  tone?: string
  sections?: string[]
  word_count?: number
  keywords?: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-blog-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate blog post")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating blog post:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate blog post",
      variant: "destructive",
    })
    throw error
  }
}

// Social media content generation
export async function generateSocialMedia(data: {
  platform: string
  content_type: string
  objective?: string
  topic: string
  tone?: string
  include_hashtags?: boolean
  include_emojis?: boolean
  character_limit?: number
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-social-media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate social media content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating social media content:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate social media content",
      variant: "destructive",
    })
    throw error
  }
}

// Email copy generation
export async function generateEmailCopy(data: {
  email_type: string
  subject_line?: string
  product_name?: string
  company_name?: string
  target_audience?: string
  include_personalization?: boolean
  cta?: string
  tone?: string
  word_count?: number
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate email copy")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating email copy:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate email copy",
      variant: "destructive",
    })
    throw error
  }
}

// Ad copy generation
export async function generateAdCopy(data: {
  platform: string
  ad_format: string
  product_name: string
  target_audience?: string
  unique_selling_point?: string
  tone?: string
  include_cta?: boolean
  character_limit?: number
  keywords?: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-ad-copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate ad copy")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating ad copy:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate ad copy",
      variant: "destructive",
    })
    throw error
  }
}

// Product description generation
export async function generateProductDescription(data: {
  product_name: string
  product_category: string
  features?: string[]
  benefits?: string[]
  target_audience?: string
  tone?: string
  length?: string
  include_technical_specs?: boolean
  keywords?: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-product-description`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate product description")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating product description:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate product description",
      variant: "destructive",
    })
    throw error
  }
}

// SEO content generation with enhanced features
export async function generateSEOContent(data: {
  primary_keyword: string
  secondary_keywords?: string[]
  content_type?: string
  target_audience?: string
  word_count?: number
  include_faq?: boolean
  meta_description?: boolean
  tone?: string
  serp_analysis?: boolean
  semantic_keywords?: boolean
  header_optimization?: boolean
  internal_linking?: boolean
  featured_snippet?: boolean
  readability_optimization?: boolean
}) {
  try {
    const response = await fetch(`${API_URL}/api/content/seo-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate SEO content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating SEO content:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate SEO content",
      variant: "destructive",
    })
    throw error
  }
}

// Image generation
export async function generateImage(data: {
  prompt: string
  width?: number
  height?: number
  numImages?: number
  style?: string;
  mood?: string;
  colorPalette?: string;
  lighting?: string,
  composition?: string,
  format?: string,
}) {
  try {
    const response = await fetch(`${API_URL}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.prompt,
        width: data.width || 1024,
        height: data.height || 1024,
        num_images: data.numImages || 1,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate image")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating image:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate image",
      variant: "destructive",
    })
    throw error
  }
}

// Tone analysis
export async function analyzeTone(data: {
  content: string
  target_tone?: string
  industry?: string
}) {
  try {
    const response = await fetch(`${API_URL}/api/content/analyze-tone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to analyze tone")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing tone:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to analyze tone",
      variant: "destructive",
    })
    throw error
  }
}

// Content summarization
export async function summarizeContent(data: {
  content: string
  target_length: string
  preserve_key_points?: boolean
}) {
  try {
    const response = await fetch(`${API_URL}/api/content/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to summarize content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error summarizing content:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to summarize content",
      variant: "destructive",
    })
    throw error
  }
}
