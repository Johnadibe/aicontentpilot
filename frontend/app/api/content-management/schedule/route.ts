import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Mock data for scheduled content
    const scheduledContent = [
      {
        id: "1",
        contentId: "3",
        title: "Product Description: New Summer Collection",
        scheduledFor: "2023-05-01T08:00:00Z",
        status: "scheduled",
        platform: "website",
      },
      {
        id: "2",
        contentId: "6",
        title: "Social Media Post: Memorial Day Sale",
        scheduledFor: "2023-05-25T09:00:00Z",
        status: "scheduled",
        platform: "instagram",
      },
      {
        id: "3",
        contentId: "8",
        title: "Email Newsletter: June Updates",
        scheduledFor: "2023-06-01T10:00:00Z",
        status: "scheduled",
        platform: "email",
      },
      {
        id: "4",
        contentId: "10",
        title: "Blog Post: Summer Travel Tips",
        scheduledFor: "2023-06-15T08:30:00Z",
        status: "scheduled",
        platform: "blog",
      },
    ]

    return NextResponse.json({ scheduledContent })
  } catch (error) {
    console.error("Error fetching scheduled content:", error)
    return NextResponse.json({ error: "Failed to fetch scheduled content" }, { status: 500 })
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
      id: `schedule-${Date.now()}`,
      contentId: data.contentId,
      title: data.title,
      scheduledFor: data.scheduledFor,
      status: "scheduled",
      platform: data.platform,
    })
  } catch (error) {
    console.error("Error scheduling content:", error)
    return NextResponse.json({ error: "Failed to schedule content" }, { status: 500 })
  }
}
