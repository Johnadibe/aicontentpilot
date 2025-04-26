import type { ReactNode } from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { DashboardHeader } from "@/components/layout/dashboard-header"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] md:gap-16">
        <aside className="hidden w-full md:flex">
          <SidebarNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-8">{children}</main>
      </div>
    </div>
  )
}
