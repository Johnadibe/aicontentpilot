import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SeoContentGenerator } from "@/components/content/seo-content-generator"

export const metadata: Metadata = {
  title: "Create SEO Content - AI Content Pilot",
  description: "Generate AI-powered SEO content",
}

export default async function CreateSeoPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/seo")
  }

  return <SeoContentGenerator />
}
