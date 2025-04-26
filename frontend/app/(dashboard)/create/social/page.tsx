import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SocialMediaGenerator } from "@/components/content/social-media-generator"

export const metadata: Metadata = {
  title: "Create Social Media Content - AI Content Pilot",
  description: "Generate AI-powered social media content",
}

export default async function CreateSocialPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/social")
  }

  return <SocialMediaGenerator />
}
