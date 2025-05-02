import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Mock data for folders
    const folders = [
      {
        id: "1",
        name: "Marketing",
        parentId: null,
        createdAt: "2023-03-10T08:00:00Z",
      },
      {
        id: "2",
        name: "Blog Posts",
        parentId: "1",
        createdAt: "2023-03-10T08:05:00Z",
      },
      {
        id: "3",
        name: "Social Media",
        parentId: "1",
        createdAt: "2023-03-10T08:10:00Z",
      },
      {
        id: "4",
        name: "Newsletters",
        parentId: null,
        createdAt: "2023-03-15T09:30:00Z",
      },
      {
        id: "5",
        name: "Products",
        parentId: null,
        createdAt: "2023-03-20T14:20:00Z",
      },
      {
        id: "6",
        name: "SEO",
        parentId: null,
        createdAt: "2023-03-25T11:45:00Z",
      },
    ]

    return NextResponse.json({ folders })
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 })
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
      id: `folder-${Date.now()}`,
      name: data.name,
      parentId: data.parentId || null,
      createdAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}
