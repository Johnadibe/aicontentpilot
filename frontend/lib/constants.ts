// Authentication
export const MAX_LOGIN_ATTEMPTS = 5
export const LOCK_TIME_MINUTES = 30
export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 24
export const VERIFICATION_TOKEN_EXPIRY_HOURS = 24

// Content
export const MAX_CONTENT_LENGTH = 50000 // 50k characters

// Subscription
export const FREE_TIER_WORD_LIMIT = 5000
export const BASIC_TIER_WORD_LIMIT = 50000
export const PRO_TIER_WORD_LIMIT = 200000
export const ENTERPRISE_TIER_WORD_LIMIT = 1000000

// Image Generation
export const FREE_TIER_IMAGE_LIMIT = 5
export const BASIC_TIER_IMAGE_LIMIT = 50
export const PRO_TIER_IMAGE_LIMIT = 100
export const ENTERPRISE_TIER_IMAGE_LIMIT = 500

// API Rate Limiting
export const API_RATE_LIMIT = 100 // requests per minute

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
