import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserByEmail, updateUserPassword } from "@/lib/data/user"

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = resetPasswordSchema.parse(body)

    // Find the password reset token
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    })

    if (!passwordResetToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 })
    }

    // Check if token is expired
    if (passwordResetToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    // Get user by email
    const user = await getUserByEmail(passwordResetToken.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user's password
    await updateUserPassword(user.id, password)

    // Delete the password reset token
    await db.passwordResetToken.delete({
      where: { token },
    })

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 })
  } catch (error) {
    console.error("Reset password error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
