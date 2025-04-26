import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import Header from "@/components/layout/header"
import { Suspense } from "react"
import { SessionProvider } from "next-auth/react"
import { Providers } from "./providers"
import Footer from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Content Pilot - AI-Powered Content Creation Platform",
  description: "Create high-quality content with AI assistance for blogs, social media, emails, and more.",
  keywords: ["AI content creation", "content generation", "content marketing", "AI writing assistant", "SEO content"],
  authors: [{ name: "AI Content Pilot" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aicontentpilot.com",
    title: "AI Content Pilot - AI-Powered Content Creation Platform",
    description: "Create high-quality content with AI assistance for blogs, social media, emails, and more.",
    siteName: "AI Content Pilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Content Pilot - AI-Powered Content Creation Platform",
    description: "Create high-quality content with AI assistance for blogs, social media, emails, and more.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Suspense>
            <Header />
            <main>{children}</main>
            <Footer />
          </Suspense>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
