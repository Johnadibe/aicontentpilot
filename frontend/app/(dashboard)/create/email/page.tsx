import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EmailCopyGenerator } from "@/components/content/email-copy-generator"

export const metadata: Metadata = {
  title: "Create Email Copy - AI Content Pilot",
  description: "Generate AI-powered email copy",
}

export default async function CreateEmailPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/email")
  }

  return <EmailCopyGenerator />
}
