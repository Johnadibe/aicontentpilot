import { API_URL } from "./constants"

// Content Library
export async function getContentItems() {
  const response = await fetch(`${API_URL}/content-management`)

  if (!response.ok) {
    throw new Error("Failed to fetch content items")
  }

  return response.json()
}

export async function getContentItem(id: string) {
  const response = await fetch(`${API_URL}/content-management/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch content item with ID ${id}`)
  }

  return response.json()
}

export async function createContentItem(data: any) {
  const response = await fetch(`${API_URL}/content-management`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create content item")
  }

  return response.json()
}

export async function updateContentItem(id: string, data: any) {
  const response = await fetch(`${API_URL}/content-management/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update content item with ID ${id}`)
  }

  return response.json()
}

export async function deleteContentItem(id: string) {
  const response = await fetch(`${API_URL}/content-management/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete content item with ID ${id}`)
  }

  return response.json()
}

// Content Versions
export async function getContentVersions(contentId: string) {
  const response = await fetch(`${API_URL}/content-management/versions/${contentId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch versions for content ID ${contentId}`)
  }

  return response.json()
}

export async function createContentVersion(contentId: string, data: any) {
  const response = await fetch(`${API_URL}/content-management/versions/${contentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create version for content ID ${contentId}`)
  }

  return response.json()
}

// Folders
export async function getFolders() {
  const response = await fetch(`${API_URL}/content-management/folders`)

  if (!response.ok) {
    throw new Error("Failed to fetch folders")
  }

  return response.json()
}

export async function createFolder(data: any) {
  const response = await fetch(`${API_URL}/content-management/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create folder")
  }

  return response.json()
}

// Tags
export async function getTags() {
  const response = await fetch(`${API_URL}/content-management/tags`)

  if (!response.ok) {
    throw new Error("Failed to fetch tags")
  }

  return response.json()
}

export async function createTag(data: any) {
  const response = await fetch(`${API_URL}/content-management/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create tag")
  }

  return response.json()
}

// Scheduling
export async function getScheduledContent() {
  const response = await fetch(`${API_URL}/content-management/schedule`)

  if (!response.ok) {
    throw new Error("Failed to fetch scheduled content")
  }

  return response.json()
}

export async function scheduleContent(data: any) {
  const response = await fetch(`${API_URL}/content-management/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to schedule content")
  }

  return response.json()
}
