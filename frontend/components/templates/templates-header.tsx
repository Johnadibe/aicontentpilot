import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function TemplatesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">Browse, create, and manage your content templates</p>
      </div>
      <Button asChild>
        <Link href="/dashboard/templates/create">
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Link>
      </Button>
    </div>
  )
}
