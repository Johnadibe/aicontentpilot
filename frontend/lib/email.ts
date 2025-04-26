"use server"

import nodemailer from "nodemailer"

// In a production app, you would use a real email service
// For development, we'll use a test account
let transporter: nodemailer.Transporter

async function getTransporter() {
  if (transporter) {
    return transporter
  }

  // If we have SMTP credentials, use them
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  } else {
    // Otherwise, use Ethereal for testing
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  }

  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: EmailOptions) {
  const transport = await getTransporter()

  const info = await transport.sendMail({
    from: `"AI Content Pilot" <${process.env.EMAIL_FROM || "noreply@aicontentpilot.com"}>`,
    to,
    subject,
    html,
  })

  if (process.env.NODE_ENV !== "production") {
    console.log(`Email sent: ${nodemailer.getTestMessageUrl(info)}`)
  }

  return info
}

interface VerificationEmailOptions {
  to: string
  name: string
  token: string
}

export async function sendVerificationEmail({ to, name, token }: VerificationEmailOptions) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with AI Content Pilot. Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
      </div>
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
      <p>This verification link will expire in 24 hours.</p>
      <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>Best regards,<br>The AI Content Pilot Team</p>
    </div>
  `

  return sendEmail({
    to,
    subject: "Verify Your Email Address - AI Content Pilot",
    html,
  })
}

interface PasswordResetEmailOptions {
  to: string
  name: string
  token: string
}

export async function sendPasswordResetEmail({ to, name, token }: PasswordResetEmailOptions) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>Hello ${name},</p>
      <p>We received a request to reset your password for your AI Content Pilot account. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>This password reset link will expire in 24 hours.</p>
      <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
      <p>${resetUrl}</p>
      <p>Best regards,<br>The AI Content Pilot Team</p>
    </div>
  `

  return sendEmail({
    to,
    subject: "Reset Your Password - AI Content Pilot",
    html,
  })
}

interface WelcomeEmailOptions {
  to: string
  name: string
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailOptions) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const dashboardUrl = `${baseUrl}/dashboard`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to AI Content Pilot!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for verifying your email address. Your account is now fully activated!</p>
      <p>With AI Content Pilot, you can:</p>
      <ul>
        <li>Generate high-quality blog posts</li>
        <li>Create engaging social media content</li>
        <li>Draft professional emails</li>
        <li>And much more!</li>
      </ul>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
      </div>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The AI Content Pilot Team</p>
    </div>
  `

  return sendEmail({
    to,
    subject: "Welcome to AI Content Pilot!",
    html,
  })
}
