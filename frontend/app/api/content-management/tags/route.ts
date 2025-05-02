import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Mock data for tags
    const tags = [
      {
        id: "1",
        name: "blog",
        count: 15,
      },
      {
        id: "2",
        name: "social",
        count: 23,
      },
      {
        id: "3",
        name: "email",
        count: 8,
      },
      {
        id: "4",
        name: "product",
        count: 12,
      },
      {
        id: "5",
        name: "seo",
        count: 7,
      },
      {
        id: "6",
        name: "marketing",
        count: 19,
      },
      {
        id: "7",
        name: "tips",
        count: 11,
      },
      {
        id: "8",
        name: "guide",
        count: 6,
      },
      {
        id: "9",
        name: "tutorial",
        count: 4,
      },
      {
        id: "10",
        name: "news",
        count: 9,
      },
    ]

    return NextResponse.json({ tags })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
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
      id: `tag-${Date.now()}`,
      name: data.name,
      count: 0,
    })
  } catch (error) {
    console.error("Error creating tag:", error)
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}
