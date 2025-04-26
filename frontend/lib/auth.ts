import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { NextAuthOptions } from "next-auth"
import { db } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"
import TwitterProvider from "next-auth/providers/twitter"
import LinkedInProvider from "next-auth/providers/linkedin"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/onboarding",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error("User not found")
        }

        // Check if account is locked due to too many failed attempts
        if (user.loginAttempts >= 5 && user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
          throw new Error("Account locked. Try again later or reset your password.")
        }

        // Check if email is verified
        if (!user.emailVerified && process.env.NODE_ENV === "production") {
          throw new Error("Please verify your email before logging in")
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          // Increment login attempts
          await db.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: {
                increment: 1,
              },
              lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 30 * 60 * 1000) : null, // Lock for 30 minutes after 5 attempts
            },
          })
          throw new Error("Invalid password")
        }

        // Reset login attempts on successful login
        await db.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date(),
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      // Include account info for social logins
      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
      }

      // Update token on session update
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.email) token.email = session.email
        if (session.picture) token.picture = session.picture
      }

      // Check token expiration
      const tokenExpiration = token.exp as number
      const currentTime = Math.floor(Date.now() / 1000)

      // If token is about to expire (less than 1 hour), refresh it
      if (tokenExpiration && tokenExpiration - currentTime < 3600) {
        // In a real implementation, you would refresh the token here
        // For NextAuth, this is handled automatically
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string | undefined

        // Add additional user info from database
        const user = await db.user.findUnique({
          where: { id: token.id as string },
          select: {
            role: true,
            twoFactorEnabled: true,
            timezone: true,
            language: true,
          },
        })

        if (user) {
          session.user.role = user.role
          session.user.twoFactorEnabled = user.twoFactorEnabled
          session.user.timezone = user.timezone
          session.user.language = user.language
        }
      }

      return session
    },
    async signIn({ user, account, profile }) {
      // For social logins, create or update user profile
      if (account && account.provider !== "credentials") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email as string },
        })

        if (existingUser) {
          // Link social account to existing user
          await db.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId as string,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId as string,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          })
        }
      }

      return true
    },
  },
  events: {
    async signIn({ user }) {
      // Record login activity
      await db.userActivity.create({
        data: {
          userId: user.id,
          type: "LOGIN",
          ipAddress: "127.0.0.1", // In a real app, get from request
          userAgent: "Unknown", // In a real app, get from request
        },
      })
    },
    async signOut({ token }) {
      if (token.id) {
        // Record logout activity
        await db.userActivity.create({
          data: {
            userId: token.id as string,
            type: "LOGOUT",
            ipAddress: "127.0.0.1", // In a real app, get from request
            userAgent: "Unknown", // In a real app, get from request
          },
        })
      }
    },
  },
}
