import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createUser, getUserByEmail } from "@/lib/data/user"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import { VERIFICATION_TOKEN_EXPIRY_HOURS } from "@/lib/constants"
import { randomUUID } from "crypto"

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password,
    })

    // Create verification token
    const token = randomUUID()
    const expires = new Date()
    expires.setHours(expires.getHours() + VERIFICATION_TOKEN_EXPIRY_HOURS)

    await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        message: "User created successfully. Please verify your email.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
