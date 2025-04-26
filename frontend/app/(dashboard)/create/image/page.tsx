import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ImageGenerator } from "@/components/content/image-generator"

export const metadata: Metadata = {
  title: "Create AI Image - AI Content Pilot",
  description: "Generate AI-powered images",
}

export default async function CreateImagePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/image")
  }

  return <ImageGenerator />
}
