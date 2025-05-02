import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import Image from "next/image"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download } from "lucide-react"
import { ImageActions } from "@/components/dashboard/image-actions"

interface ImagePageProps {
  params: {
    id: string
  }
}

async function getImage(id: string, userId: string) {
  return db.image.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      tags: true,
    },
  })
}

export default async function ImagePage({ params }: ImagePageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const image = await getImage(params.id, session.user.id)

  if (!image) {
    notFound()
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Image Details"
        text={`Created on ${formatDate(image.createdAt)}`}
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/images">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={image.url} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            <ImageActions image={image} />
          </div>
        }
      />
      <div className="grid gap-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{`${image.width}x${image.height}`}</Badge>
          {image.tags.map((tag) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border">
          <div className="relative aspect-square md:aspect-auto md:h-[600px] w-full">
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.prompt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Prompt</h2>
          <p className="text-muted-foreground">{image.prompt}</p>
        </div>
      </div>
    </DashboardShell>
  )
}
