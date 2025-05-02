import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Mock data for content management
    const contentItems = [
      {
        id: "1",
        title: "Blog Post: 10 Tips for Content Creation",
        type: "blog",
        status: "published",
        createdAt: "2023-04-15T10:30:00Z",
        updatedAt: "2023-04-16T14:20:00Z",
        tags: ["content", "tips", "blog"],
        folder: "Marketing",
        versions: 3,
        scheduledFor: null,
      },
      {
        id: "2",
        title: "Email Newsletter: May Updates",
        type: "email",
        status: "draft",
        createdAt: "2023-04-20T09:15:00Z",
        updatedAt: "2023-04-20T09:15:00Z",
        tags: ["newsletter", "email"],
        folder: "Newsletters",
        versions: 1,
        scheduledFor: null,
      },
      {
        id: "3",
        title: "Product Description: New Summer Collection",
        type: "product",
        status: "scheduled",
        createdAt: "2023-04-18T16:45:00Z",
        updatedAt: "2023-04-19T11:30:00Z",
        tags: ["product", "summer", "collection"],
        folder: "Products",
        versions: 2,
        scheduledFor: "2023-05-01T08:00:00Z",
      },
      {
        id: "4",
        title: "Social Media Post: Product Launch",
        type: "social",
        status: "published",
        createdAt: "2023-04-10T13:20:00Z",
        updatedAt: "2023-04-10T15:45:00Z",
        tags: ["social", "launch", "product"],
        folder: "Social Media",
        versions: 4,
        scheduledFor: null,
      },
      {
        id: "5",
        title: "SEO Article: Improving Website Rankings",
        type: "seo",
        status: "draft",
        createdAt: "2023-04-22T10:10:00Z",
        updatedAt: "2023-04-22T10:10:00Z",
        tags: ["seo", "website", "rankings"],
        folder: "SEO",
        versions: 1,
        scheduledFor: null,
      },
    ]

    return NextResponse.json({ contentItems })
  } catch (error) {
    console.error("Error fetching content management data:", error)
    return NextResponse.json({ error: "Failed to fetch content management data" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()

    // In a real implementation, this would save to a database
    // For now, we'll just return the data with a mock ID

    return NextResponse.json({
      id: `new-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: 1,
    })
  } catch (error) {
    console.error("Error creating content:", error)
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}
