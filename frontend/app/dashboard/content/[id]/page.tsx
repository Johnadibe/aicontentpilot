import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { ContentActions } from "@/components/dashboard/content-actions"

interface ContentPageProps {
  params: {
    id: string
  }
}

async function getContent(id: string, userId: string) {
  return db.content.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      tags: true,
    },
  })
}

export default async function ContentPage({ params }: ContentPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const content = await getContent(params.id, session.user.id)

  if (!content) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={content.title}
        text={`Created on ${formatDate(content.createdAt)}`}
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/content">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <ContentActions content={content} />
          </div>
        }
      />
      <div className="grid gap-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{content.type.replace("_", " ")}</Badge>
          <Badge variant="outline">{content.status}</Badge>
          {content.tags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {content.content.split("\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return <h1 key={index}>{paragraph.substring(2)}</h1>
            } else if (paragraph.startsWith("## ")) {
              return <h2 key={index}>{paragraph.substring(3)}</h2>
            } else if (paragraph.startsWith("### ")) {
              return <h3 key={index}>{paragraph.substring(4)}</h3>
            } else if (paragraph.trim() === "") {
              return <br key={index} />
            } else {
              return <p key={index}>{paragraph}</p>
            }
          })}
        </div>
      </div>
    </DashboardShell>
  )
}
