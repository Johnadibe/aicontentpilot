import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardCards } from "@/components/dashboard/cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UsageMetrics } from "@/components/dashboard/usage-metrics"
import { ContentStats } from "@/components/dashboard/content-stats"
import { QuickActions } from "@/components/dashboard/quick-actions"

export const metadata: Metadata = {
  title: "Dashboard - AI Content Pilot",
  description: "Manage your AI-generated content and account",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here's an overview of your AI content creation." />
      <div className="grid gap-8">
        <DashboardCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContentStats className="lg:col-span-2" />
          <UsageMetrics />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentActivity className="lg:col-span-2" />
          <QuickActions />
        </div>
      </div>
    </DashboardShell>
  )
}
