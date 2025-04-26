"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email"

const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

type UserInput = z.infer<typeof UserSchema>

export async function registerUser(input: UserInput) {
  // Validate input
  const validatedFields = UserSchema.safeParse(input)

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.errors[0].message)
  }

  const { name, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("User with this email already exists.")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // Create verification token
  const token = uuidv4()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await db.verificationToken.create({
    data: {
      token,
      expires,
      userId: user.id,
    },
  })

  // Send verification email
  await sendVerificationEmail({
    to: email,
    name: name || "",
    token,
  })

  // Log activity
  await db.userActivity.create({
    data: {
      userId: user.id,
      type: "ACCOUNT_CREATED",
      ipAddress: "127.0.0.1", // In a real app, get from request
      userAgent: "Unknown", // In a real app, get from request
    },
  })

  return { id: user.id, name: user.name, email: user.email }
}

export async function verifyEmail(token: string) {
  // Find the verification token
  const verificationToken = await db.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!verificationToken) {
    throw new Error("Invalid verification token")
  }

  if (verificationToken.expires < new Date()) {
    throw new Error("Verification token has expired")
  }

  // Update user's email verification status
  await db.user.update({
    where: { id: verificationToken.userId },
    data: {
      emailVerified: new Date(),
    },
  })

  // Delete the verification token
  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  })

  // Send welcome email
  await sendWelcomeEmail({
    to: verificationToken.user.email as string,
    name: verificationToken.user.name as string,
  })

  return { success: true }
}

export async function requestPasswordReset(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    // For security reasons, don't reveal that the user doesn't exist
    return { success: true }
  }

  // Create password reset token
  const token = uuidv4()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await db.passwordResetToken.create({
    data: {
      token,
      expires,
      userId: user.id,
    },
  })

  // Send password reset email
  await sendPasswordResetEmail({
    to: email,
    name: user.name || "",
    token,
  })

  return { success: true }
}

export async function resetPassword(token: string, newPassword: string) {
  // Validate password
  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

  const validatedPassword = passwordSchema.safeParse(newPassword)

  if (!validatedPassword.success) {
    throw new Error(validatedPassword.error.errors[0].message)
  }

  // Find the password reset token
  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: { token },
  })

  if (!passwordResetToken) {
    throw new Error("Invalid password reset token")
  }

  if (passwordResetToken.expires < new Date()) {
    throw new Error("Password reset token has expired")
  }

  if (passwordResetToken.usedAt) {
    throw new Error("Password reset token has already been used")
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update user's password
  await db.user.update({
    where: { id: passwordResetToken.userId },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      loginAttempts: 0,
      lockedUntil: null,
    },
  })

  // Mark token as used
  await db.passwordResetToken.update({
    where: { id: passwordResetToken.id },
    data: {
      usedAt: new Date(),
    },
  })

  // Log activity
  await db.userActivity.create({
    data: {
      userId: passwordResetToken.userId,
      type: "PASSWORD_CHANGE",
      ipAddress: "127.0.0.1", // In a real app, get from request
      userAgent: "Unknown", // In a real app, get from request
    },
  })

  return { success: true }
}

export async function updateUserProfile(userId: string, data: any) {
  // Validate data
  const ProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").optional(),
    image: z.string().url("Please provide a valid URL for your profile image").optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
    notificationPreferences: z.record(z.boolean()).optional(),
  })

  const validatedFields = ProfileSchema.safeParse(data)

  if (!validatedFields.success) {
    throw new Error(validatedFields.error.errors[0].message)
  }

  // Update user profile
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: validatedFields.data,
  })

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    image: updatedUser.image,
    timezone: updatedUser.timezone,
    language: updatedUser.language,
    notificationPreferences: updatedUser.notificationPreferences,
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  // Validate new password
  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

  const validatedPassword = passwordSchema.safeParse(newPassword)

  if (!validatedPassword.success) {
    throw new Error(validatedPassword.error.errors[0].message)
  }

  // Get user
  const user = await db.user.findUnique({
    where: { id: userId },
  })

  if (!user || !user.password) {
    throw new Error("User not found")
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password)

  if (!isValid) {
    throw new Error("Current password is incorrect")
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update password
  await db.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
    },
  })

  // Log activity
  await db.userActivity.create({
    data: {
      userId,
      type: "PASSWORD_CHANGE",
      ipAddress: "127.0.0.1", // In a real app, get from request
      userAgent: "Unknown", // In a real app, get from request
    },
  })

  return { success: true }
}

export async function toggleTwoFactor(userId: string, enable: boolean) {
  // In a real app, you would generate and verify 2FA secrets
  await db.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: enable,
    },
  })

  // Log activity
  await db.userActivity.create({
    data: {
      userId,
      type: enable ? "TWO_FACTOR_ENABLED" : "TWO_FACTOR_DISABLED",
      ipAddress: "127.0.0.1", // In a real app, get from request
      userAgent: "Unknown", // In a real app, get from request
    },
  })

  return { success: true }
}

export async function createApiKey(userId: string, name: string) {
  const key = `acp_${uuidv4().replace(/-/g, "")}`

  const apiKey = await db.apiKey.create({
    data: {
      name,
      key,
      userId,
    },
  })

  // Log activity
  await db.userActivity.create({
    data: {
      userId,
      type: "API_KEY_CREATED",
      ipAddress: "127.0.0.1", // In a real app, get from request
      userAgent: "Unknown", // In a real app, get from request
      metadata: { apiKeyId: apiKey.id },
    },
  })

  return { id: apiKey.id, name: apiKey.name, key }
}

export async function deleteApiKey(userId: string, keyId: string) {
  const apiKey = await db.apiKey.findFirst({
    where: {
      id: keyId,
      userId,
    },
  })

  if (!apiKey) {
    throw new Error("API key not found")
  }

  await db.apiKey.delete({
    where: { id: keyId },
  })

  // Log activity
  await db.userActivity.create({
    data: {
      userId,
      type: "API_KEY_DELETED",
      ipAddress: "127.0.0.1", // In a real app, get from request
      userAgent: "Unknown", // In a real app, get from request
      metadata: { apiKeyId: keyId },
    },
  })

  return { success: true }
}

export async function getUserApiKeys(userId: string) {
  const apiKeys = await db.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return apiKeys
}

export async function getUserActivity(userId: string, limit = 10) {
  const activities = await db.userActivity.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return activities
}
