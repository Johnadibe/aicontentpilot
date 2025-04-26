// Content generation types
export interface ContentGenerationParams {
  topic?: string
  keywords?: string
  audience?: string
  tone?: string
  length?: number
  outline?: string[]
  [key: string]: any
}

// User types
export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  role: string
  createdAt: string
}

// Subscription types
export type SubscriptionPlan = "FREE" | "STARTER" | "PROFESSIONAL" | "ENTERPRISE"

export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIAL"

export interface Subscription {
  id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  startDate: string
  endDate?: string
  trialEndsAt?: string
  canceledAt?: string
  currentPeriodStart: string
  currentPeriodEnd: string
}

// Content types
export type ContentType =
  | "BLOG_POST"
  | "SOCIAL_MEDIA"
  | "EMAIL"
  | "AD_COPY"
  | "PRODUCT_DESCRIPTION"
  | "SEO_CONTENT"
  | "IMAGE"

export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"

export interface Content {
  id: string
  title: string
  description?: string
  contentType: ContentType
  html?: string
  text?: string
  keywords?: string
  status: ContentStatus
  createdAt: string
  updatedAt: string
  userId: string
  teamId?: string
}

export interface ContentVersion {
  id: string
  versionNumber: number
  html?: string
  text?: string
  createdAt: string
  contentId: string
}

// Team types
export interface Team {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  ownerId: string
  members: UserProfile[]
}
