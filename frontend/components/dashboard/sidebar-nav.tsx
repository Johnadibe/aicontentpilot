"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, Edit, FileText, Grid, ImageIcon, LayoutTemplate, Settings, Users } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Grid className="mr-2 h-4 w-4" />,
  },
  {
    title: "Create",
    href: "/create",
    icon: <Edit className="mr-2 h-4 w-4" />,
  },
  {
    title: "Content Library",
    href: "/content",
    icon: <FileText className="mr-2 h-4 w-4" />,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: <LayoutTemplate className="mr-2 h-4 w-4" />,
  },
  {
    title: "AI Images",
    href: "/images",
    icon: <ImageIcon className="mr-2 h-4 w-4" />,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart className="mr-2 h-4 w-4" />,
  },
  {
    title: "Team",
    href: "/team",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 w-full">
      {items.map((item, index) => (
        <Link key={index} href={item.href}>
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              pathname === item.href &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
            )}
          >
            {item.icon}
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
