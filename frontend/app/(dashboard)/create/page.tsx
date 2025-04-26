import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ContentTypeSelector } from "@/components/content/content-type-selector"

export const metadata: Metadata = {
  title: "Create Content - AI Content Pilot",
  description: "Select content type to create with AI",
}

export default async function CreatePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Content" text="Choose the type of content you want to create" />
      <ContentTypeSelector />
    </DashboardShell>
  )
}
