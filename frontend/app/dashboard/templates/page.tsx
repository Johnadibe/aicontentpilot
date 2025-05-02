import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TemplatesList } from "@/components/templates/templates-list"
import { TemplatesHeader } from "@/components/templates/templates-header"
import { TemplatesListSkeleton } from "@/components/skeletons/templates-list-skeleton"

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse and manage your content templates",
}

export default function TemplatesPage() {
  return (
    <DashboardShell>
      <TemplatesHeader />
      <Suspense fallback={<TemplatesListSkeleton />}>
        <TemplatesList />
      </Suspense>
    </DashboardShell>
  )
}
