"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, ImageIcon, Settings, Users, CreditCard, BarChart } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }> | string
  items?: {
    title: string
    href: string
    icon: string
  }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    href: "/dashboard/content",
    icon: FileText,
  },
  {
    title: "Content Management",
    href: "/dashboard/content-management",
    icon: "folder",
  },
  {
    title: "Images",
    href: "/dashboard/images",
    icon: ImageIcon,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Content Tools",
    href: "/dashboard/content/tools",
    icon: "tool",
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: "layout-template",
    items: [
      {
        title: "Browse Templates",
        href: "/dashboard/templates",
        icon: "library",
      },
      {
        title: "Create Template",
        href: "/dashboard/templates/create",
        icon: "plus-circle",
      },
    ],
  },
  {
    title: "Subscription",
    href: "/dashboard/subscription",
    icon: "creditCard",
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    {typeof item.icon === "string" ? <span>{item.icon}</span> : <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
