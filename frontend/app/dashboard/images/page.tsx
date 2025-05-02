import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Download, Edit, Info } from "lucide-react"
import { ImageListSkeleton } from "@/components/skeletons/image-list-skeleton"
import { ImageSearch } from "@/components/image-generation/image-search"
import { ImageSorting } from "@/components/image-generation/image-sorting"
import { ImageViewToggle } from "@/components/image-generation/image-view-toggle"
import { Pagination } from "@/components/ui/pagination"
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Images | AI Content Pilot",
  description: "Manage your AI-generated images",
}

interface ImageGalleryProps {
  images: any[]
  view: "grid" | "list"
}

interface Tag {
  id: string;
  name: string;
  teamId: string | null;
  _count?: {
    images: number;
  };
}

function ImageGallery({ images, view }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="image" />
        <EmptyPlaceholder.Title>No images found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You haven't generated any images yet or no images match your current filters.
        </EmptyPlaceholder.Description>
        <Button asChild>
          <Link href="/dashboard/images/create">Generate an Image</Link>
        </Button>
      </EmptyPlaceholder>
    )
  }

  if (view === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group">
            <Link href={`/dashboard/images/${image.id}`} className="relative block">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.prompt || "Generated image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/dashboard/images/${image.id}`}>
                      <Info className="h-4 w-4 mr-1" /> Details
                    </Link>
                  </Button>
                  <Button size="sm" variant="secondary" asChild>
                    <a href={image.url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            </Link>
            <CardFooter className="flex justify-between p-3 border-t">
              <div className="flex flex-wrap gap-1">
                {image.tags?.slice(0, 2).map((tag: any) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
                {image.tags?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{image.tags.length - 2}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-48 h-48">
              <div className="relative h-full w-full">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.prompt || "Generated image"}
                  fill
                  sizes="(max-width: 640px) 100vw, 192px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <div className="flex-1">
                <h3 className="font-medium line-clamp-1 mb-1">{image.name || `Image ${image.id.substring(0, 8)}`}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{image.prompt}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {image.tags?.map((tag: any) => (
                    <Badge key={tag.id} variant="secondary" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/images/${image.id}`}>
                    <Info className="h-4 w-4 mr-1" /> Details
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/dashboard/images/${image.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={image.url} download target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-1" /> Download
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

async function getImages(
  userId: string,
  options: {
    tag?: string
    search?: string
    sort?: string
    page?: number
    limit?: number
  },
) {
  const { tag, search, sort = "newest", page = 1, limit = 12 } = options
  const skip = (page - 1) * limit

  const where: any = { userId }

  if (tag) {
    where.tags = {
      some: {
        name: tag,
      },
    }
  }

  if (search) {
    where.OR = [
      { prompt: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { tags: { some: { name: { contains: search, mode: "insensitive" } } } },
    ]
  }

  const orderBy: any = {}
  switch (sort) {
    case "oldest":
      orderBy.createdAt = "asc"
      break
    case "name-asc":
      orderBy.name = "asc"
      break
    case "name-desc":
      orderBy.name = "desc"
      break
    case "newest":
    default:
      orderBy.createdAt = "desc"
      break
  }

  const [images, total] = await Promise.all([
    db.image.findMany({
      where,
      orderBy,
      include: {
        tags: true,
      },
      skip,
      take: limit,
    }),
    db.image.count({ where }),
  ])

  return {
    images,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

async function getAllTags(userId: string) {
  const tags = await db.tag.findMany({
    where: {
      images: {
        some: {
          userId,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return tags
}

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: { tag?: string; q?: string; sort?: string; page?: string; view?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return null
  }

  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const view = (searchParams.view as "grid" | "list") || "grid"

  const [imagesData, tags] = await Promise.all([
    getImages(session.user.id, {
      tag: searchParams.tag,
      search: searchParams.q,
      sort: searchParams.sort,
      page,
    }),
    getAllTags(session.user.id),
  ])

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Images"
        text="Manage your AI-generated images."
        action={
          <Button asChild className="gradient-primary">
            <Link href="/dashboard/images/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Image
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <ImageSearch defaultValue={searchParams.q} />
          </div>
          <div className="flex gap-2">
            <ImageSorting defaultValue={searchParams.sort || "newest"} />
            <ImageViewToggle defaultView={view} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tags</h4>
                    <div className="space-y-2">
                      {tags.length > 0 ? (
                        tags.map((tag: Tag) => (
                          <Link
                            key={tag.id}
                            href={`/dashboard/images?tag=${tag.name}`}
                            className={cn(
                              "block text-sm px-2 py-1 rounded-md hover:bg-accent",
                              searchParams.tag === tag.name && "bg-accent font-medium",
                            )}
                          >
                            {tag.name} ({tag._count?.images || 0})
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No tags found</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Date</h4>
                    <div className="space-y-2">
                      <Link
                        href="/dashboard/images?sort=newest"
                        className={cn(
                          "block text-sm px-2 py-1 rounded-md hover:bg-accent",
                          (searchParams.sort === "newest" || !searchParams.sort) && "bg-accent font-medium",
                        )}
                      >
                        Newest first
                      </Link>
                      <Link
                        href="/dashboard/images?sort=oldest"
                        className={cn(
                          "block text-sm px-2 py-1 rounded-md hover:bg-accent",
                          searchParams.sort === "oldest" && "bg-accent font-medium",
                        )}
                      >
                        Oldest first
                      </Link>
                    </div>
                  </div>

                  {searchParams.tag || searchParams.q || searchParams.sort ? (
                    <div className="pt-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/dashboard/images">Clear All Filters</Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Suspense fallback={<ImageListSkeleton />}>
              <ImageGallery images={imagesData.images} view={view} />

              {imagesData.pagination.totalPages > 1 && (
                <Pagination
                  className="mt-8"
                  currentPage={imagesData.pagination.page}
                  totalPages={imagesData.pagination.totalPages}
                  baseUrl={`/dashboard/images?${new URLSearchParams({
                    ...(searchParams.tag ? { tag: searchParams.tag } : {}),
                    ...(searchParams.q ? { q: searchParams.q } : {}),
                    ...(searchParams.sort ? { sort: searchParams.sort } : {}),
                    ...(searchParams.view ? { view: searchParams.view } : {}),
                  }).toString()}`}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}