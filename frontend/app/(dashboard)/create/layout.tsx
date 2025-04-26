import type { ReactNode } from "react"
import { DashboardShell } from "@/components/dashboard/shell"
import { ContentTypeNav } from "@/components/content/content-type-nav"

interface CreateLayoutProps {
  children: ReactNode
}

export default function CreateLayout({ children }: CreateLayoutProps) {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <ContentTypeNav />
        <div className="space-y-6">{children}</div>
      </div>
    </DashboardShell>
  )
}
