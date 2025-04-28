import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import Header from "@/components/layout/header"
import { Suspense } from "react"
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
  icons: {
    icon: '/favicon.ico',
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
          <Suspense>
            <Header />
            <main className="flex-grow px-4 sm:px-6 md:px-8 lg:px-12 max-w-screen-2xl mx-auto w-full">{children}</main>
            <Footer />
          </Suspense>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
