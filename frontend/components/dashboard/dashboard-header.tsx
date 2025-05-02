import Link from "next/link"
import { MobileSidebar } from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

interface DashboardHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  heading?: string
  description?: string
  text?: string
  action?: React.ReactNode
}

export function DashboardHeader({ user, heading, description, text, action }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <MobileSidebar />
          <Link href="/" className="hidden items-center gap-2 md:flex">
            <Logo className="h-6 w-6" />
            <span className="font-bold">AI Content Pilot</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
