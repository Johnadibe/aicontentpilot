import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TemplateCreator } from "@/components/templates/template-creator"

export const metadata: Metadata = {
  title: "Create Template",
  description: "Create a new content template",
}

export default function CreateTemplatePage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Template</h1>
          <p className="text-muted-foreground">Design a new template for your content</p>
        </div>
      </div>
      <TemplateCreator />
    </DashboardShell>
  )
}
