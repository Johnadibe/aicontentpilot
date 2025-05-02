import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/lib/data/user"
import { sendPasswordResetEmail } from "@/lib/email"
import { PASSWORD_RESET_TOKEN_EXPIRY_HOURS } from "@/lib/constants"
import { randomUUID } from "crypto"

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = forgotPasswordSchema.parse(body)

    // Check if user exists
    const user = await getUserByEmail(email)
    if (!user) {
      // Don't reveal that the user doesn't exist
      return NextResponse.json(
        { message: "If your email is registered, you will receive a password reset link." },
        { status: 200 },
      )
    }

    // Delete any existing password reset tokens for this user
    await db.passwordResetToken.deleteMany({
      where: { email },
    })

    // Create password reset token
    const token = randomUUID()
    const expires = new Date()
    expires.setHours(expires.getHours() + PASSWORD_RESET_TOKEN_EXPIRY_HOURS)

    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Send password reset email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json(
      { message: "If your email is registered, you will receive a password reset link." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
