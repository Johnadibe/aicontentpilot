import { Resend } from "resend"
import VerificationEmail from "@/emails/verification-email"
import PasswordResetEmail from "@/emails/password-reset-email"
import WelcomeEmail from "@/emails/welcome-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Verify your email address",
    react: VerificationEmail({
      verificationUrl,
      userEmail: email,
    }),
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    react: PasswordResetEmail({
      resetUrl,
      userEmail: email,
    }),
  })
}

export async function sendWelcomeEmail(email: string, name: string) {
  const loginUrl = `${process.env.NEXTAUTH_URL}/auth/login`

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: email,
    subject: "Welcome to AI Content Pilot",
    react: WelcomeEmail({
      loginUrl,
      userName: name,
    }),
  })
}
