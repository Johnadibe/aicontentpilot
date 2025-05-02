"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TeamTabsProps {
  team: any
  activeTab?: string
}

export function TeamTabs({ team, activeTab }: TeamTabsProps) {
  const pathname = usePathname()

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      href: `/dashboard/teams/${team.id}`,
    },
    {
      id: "workspaces",
      label: "Workspaces",
      href: `/dashboard/teams/${team.id}/workspaces`,
    },
    {
      id: "content",
      label: "Content Library",
      href: `/dashboard/teams/${team.id}/content`,
    },
    {
      id: "members",
      label: "Members",
      href: `/dashboard/teams/${team.id}/members`,
    },
    {
      id: "activity",
      label: "Activity",
      href: `/dashboard/teams/${team.id}/activity`,
    },
    {
      id: "settings",
      label: "Settings",
      href: `/dashboard/teams/${team.id}/settings`,
    },
  ]

  // Determine active tab from pathname if not explicitly provided
  const currentTab = activeTab || tabs.find((tab) => pathname === tab.href)?.id || "overview"

  return (
    <Tabs value={currentTab} className="mt-6">
      <TabsList className="grid grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} asChild>
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
