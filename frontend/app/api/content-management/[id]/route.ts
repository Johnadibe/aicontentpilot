import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = params.id

    // Mock data for a specific content item
    const contentItem = {
      id,
      title: "Blog Post: 10 Tips for Content Creation",
      type: "blog",
      status: "published",
      content: `
        <h1>10 Tips for Content Creation</h1>
        <p>Creating engaging content is essential for any digital marketing strategy. Here are 10 tips to help you create better content:</p>
        <ol>
          <li>Know your audience</li>
          <li>Set clear goals for each piece of content</li>
          <li>Create a compelling headline</li>
          <li>Use visuals to enhance your message</li>
          <li>Keep it concise and scannable</li>
          <li>Tell a story</li>
          <li>Add value for your readers</li>
          <li>Include a call to action</li>
          <li>Optimize for SEO</li>
          <li>Proofread and edit thoroughly</li>
        </ol>
        <p>By following these tips, you'll be able to create content that resonates with your audience and achieves your marketing goals.</p>
      `,
      createdAt: "2023-04-15T10:30:00Z",
      updatedAt: "2023-04-16T14:20:00Z",
      tags: ["content", "tips", "blog"],
      folder: "Marketing",
      versions: [
        {
          id: "v1",
          createdAt: "2023-04-15T10:30:00Z",
          note: "Initial draft",
        },
        {
          id: "v2",
          createdAt: "2023-04-15T15:45:00Z",
          note: "Added examples to each tip",
        },
        {
          id: "v3",
          createdAt: "2023-04-16T14:20:00Z",
          note: "Final edits and proofreading",
        },
      ],
      scheduledFor: null,
    }

    return NextResponse.json(contentItem)
  } catch (error) {
    console.error(`Error fetching content with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = params.id
    const data = await req.json()

    // In a real implementation, this would update the database
    // For now, we'll just return the updated data

    return NextResponse.json({
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error updating content with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = params.id

    // In a real implementation, this would delete from the database
    // For now, we'll just return a success message

    return NextResponse.json({ success: true, message: `Content with ID ${id} deleted successfully` })
  } catch (error) {
    console.error(`Error deleting content with ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
