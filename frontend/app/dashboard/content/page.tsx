import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentListSkeleton } from "@/components/skeletons/content-list-skeleton"

export const metadata = {
  title: "Content | AI Content Pilot",
  description: "Manage your AI-generated content",
}

async function getContents(userId: string) {
  return db.content.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      tags: true,
    },
    take: 10,
  })
}

export default async function ContentPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Content"
        text="Manage your AI-generated content."
        action={
          <Button asChild className="gradient-primary">
            <Link href="/dashboard/content/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Content
            </Link>
          </Button>
        }
      />
      <Suspense fallback={<ContentListSkeleton />}>
        <ContentList userId={session.user.id} />
      </Suspense>
    </DashboardShell>
  )
}

async function ContentList({ userId }: { userId: string }) {
  const contents = await getContents(userId)

  if (contents.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No content created</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven&apos;t created any content yet. Start creating content with AI.
          </p>
          <Button asChild className="gradient-primary">
            <Link href="/dashboard/content/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Content
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <Card key={content.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="truncate text-lg">{content.title}</CardTitle>
            <CardDescription>
              {formatDate(content.createdAt)}
              <Badge variant="secondary" className="ml-2">
                {content.type.replace("_", " ")}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="line-clamp-3 text-sm text-muted-foreground">{content.content.substring(0, 150)}...</p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-1 border-t pt-3">
            {content.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
            {content.tags.length === 0 && <span className="text-xs text-muted-foreground">No tags</span>}
          </CardFooter>
          <Link href={`/dashboard/content/${content.id}`} className="absolute inset-0">
            <span className="sr-only">View content</span>
          </Link>
        </Card>
      ))}
    </div>
  )
}
