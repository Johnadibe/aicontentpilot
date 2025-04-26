import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdCopyGenerator } from "@/components/content/ad-copy-generator"

export const metadata: Metadata = {
  title: "Create Ad Copy - AI Content Pilot",
  description: "Generate AI-powered ad copy",
}

export default async function CreateAdPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/ad")
  }

  return <AdCopyGenerator />
}
