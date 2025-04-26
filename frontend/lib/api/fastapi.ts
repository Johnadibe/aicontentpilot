// This file contains the API client for communicating with the FastAPI backend

import type { ContentGenerationParams } from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function generateContent(contentType: string, params: ContentGenerationParams) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/${contentType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to generate content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating content:", error)
    throw error
  }
}

export async function generateImage(prompt: string, options: any = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
      body: JSON.stringify({
        prompt,
        size: options.size || "1024x1024",
        quality: options.quality || "standard",
        style: options.style || "natural",
        negativePrompt: options.negativePrompt,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to generate image")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating image:", error)
    throw error
  }
}

export async function analyzeContent(content: string, analysisType: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/${analysisType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
      body: JSON.stringify({ content, analysis_type: analysisType }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to analyze content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error analyzing content:", error)
    throw error
  }
}

// Add a function to save content to the library
export async function saveContent(content: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
      body: JSON.stringify(content),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to save content")
    }

    return await response.json()
  } catch (error) {
    console.error("Error saving content:", error)
    throw error
  }
}
