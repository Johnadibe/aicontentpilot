import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Content Pilot - AI-Powered Content Creation Platform",
  description: "AI-powered content creation platform. Create high-quality content with AI assistance for blogs, social media, emails, and more.",
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col overflow-x-hidden">
            <MarketingHeader />
            <main className="flex-1">{children}</main>
            <MarketingFooter />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
