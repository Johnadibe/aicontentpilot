import { toast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// SEO Analysis
export async function analyzeSEO(data: {
  content: string
  url?: string
  primary_keyword?: string
  secondary_keywords?: string[]
  target_audience?: string
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/seo-analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to analyze SEO")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing SEO:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to analyze SEO",
      variant: "destructive",
    })
    throw error
  }
}

// Readability Analysis
export async function analyzeReadability(data: {
  content: string
  target_audience?: string
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/readability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to analyze readability")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing readability:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to analyze readability",
      variant: "destructive",
    })
    throw error
  }
}

// Grammar Check
export async function checkGrammar(data: {
  content: string
  check_style?: boolean
  check_punctuation?: boolean
  check_spelling?: boolean
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/grammar-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to check grammar")
    }

    return await response.json()
  } catch (error) {
    console.error("Error checking grammar:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to check grammar",
      variant: "destructive",
    })
    throw error
  }
}

// Sentiment Analysis
export async function analyzeSentiment(data: {
  content: string
  detailed?: boolean
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/sentiment-analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to analyze sentiment")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to analyze sentiment",
      variant: "destructive",
    })
    throw error
  }
}

// Keyword Density Analysis
export async function analyzeKeywordDensity(data: {
  content: string
  primary_keyword: string
  secondary_keywords?: string[]
  analyze_competitors?: boolean
  competitor_urls?: string[]
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/keyword-density`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to analyze keyword density")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing keyword density:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to analyze keyword density",
      variant: "destructive",
    })
    throw error
  }
}

// Metadata Generator
export async function generateMetadata(data: {
  content: string
  primary_keyword: string
  secondary_keywords?: string[]
  brand_name?: string
  character_limit_title?: number
  character_limit_description?: number
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/generate-metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to generate metadata")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating metadata:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate metadata",
      variant: "destructive",
    })
    throw error
  }
}

// Content Improver
export async function improveContent(data: {
  content: string
  improvement_type: string
  transformation_level?: number
  preserve_keywords?: string[]
  target_audience?: string
}) {
  try {
    const response = await fetch(`${API_URL}/api/optimization/improve-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to improve content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error improving content:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to improve content",
      variant: "destructive",
    })
    throw error
  }
}
