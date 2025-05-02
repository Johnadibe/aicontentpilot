import type { Template } from "@prisma/client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface TemplateWithUser extends Template {
  user: {
    name: string | null
    image: string | null
  }
}

export interface TemplatesResponse {
  templates: TemplateWithUser[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface TemplateFilters {
  category?: string
  query?: string
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}

export async function getTemplates(filters: TemplateFilters = {}): Promise<TemplatesResponse> {
  const queryParams = new URLSearchParams()

  if (filters.category) queryParams.append("category", filters.category)
  if (filters.query) queryParams.append("query", filters.query)
  if (filters.sort) queryParams.append("sort", filters.sort)
  if (filters.order) queryParams.append("order", filters.order)
  if (filters.page) queryParams.append("page", filters.page.toString())
  if (filters.limit) queryParams.append("limit", filters.limit.toString())

  const response = await fetch(`${API_URL}/api/templates?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch templates")
  }

  return response.json()
}

export async function getTemplate(id: string): Promise<TemplateWithUser> {
  const response = await fetch(`${API_URL}/api/templates/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch template")
  }

  return response.json()
}

export interface CreateTemplateData {
  title: string
  description?: string
  content: any
  category: string
  tags?: string[]
  isPublic?: boolean
}

export async function createTemplate(data: CreateTemplateData): Promise<Template> {
  const response = await fetch(`${API_URL}/api/templates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create template")
  }

  return response.json()
}

export async function updateTemplate(id: string, data: Partial<CreateTemplateData>): Promise<Template> {
  const response = await fetch(`${API_URL}/api/templates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update template")
  }

  return response.json()
}

export async function deleteTemplate(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/templates/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to delete template")
  }
}

export async function getPopularTemplates(category?: string, limit = 5): Promise<TemplateWithUser[]> {
  const queryParams = new URLSearchParams()

  if (category) queryParams.append("category", category)
  if (limit) queryParams.append("limit", limit.toString())

  const response = await fetch(`${API_URL}/api/templates/popular?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch popular templates")
  }

  return response.json()
}

export interface Category {
  name: string
  count: number
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/api/templates/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}
