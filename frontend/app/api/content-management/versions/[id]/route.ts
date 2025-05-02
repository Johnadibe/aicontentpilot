import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const contentId = params.id

    // Mock data for content versions
    const versions = [
      {
        id: "v1",
        contentId,
        version: 1,
        content: `
          <h1>10 Tips for Content Creation</h1>
          <p>Creating engaging content is essential. Here are some tips:</p>
          <ol>
            <li>Know your audience</li>
            <li>Set clear goals</li>
            <li>Create compelling headlines</li>
            <li>Use visuals</li>
            <li>Keep it concise</li>
          </ol>
        `,
        createdAt: "2023-04-15T10:30:00Z",
        createdBy: "John Doe",
        note: "Initial draft",
      },
      {
        id: "v2",
        contentId,
        version: 2,
        content: `
          <h1>10 Tips for Content Creation</h1>
          <p>Creating engaging content is essential for any marketing strategy. Here are some tips:</p>
          <ol>
            <li>Know your audience</li>
            <li>Set clear goals for each piece</li>
            <li>Create compelling headlines</li>
            <li>Use visuals to enhance your message</li>
            <li>Keep it concise and scannable</li>
            <li>Tell a story</li>
            <li>Add value for readers</li>
            <li>Include a call to action</li>
          </ol>
        `,
        createdAt: "2023-04-15T15:45:00Z",
        createdBy: "John Doe",
        note: "Added more tips and expanded descriptions",
      },
      {
        id: "v3",
        contentId,
        version: 3,
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
        createdAt: "2023-04-16T14:20:00Z",
        createdBy: "John Doe",
        note: "Final edits and proofreading",
      },
    ]

    return NextResponse.json({ versions })
  } catch (error) {
    console.error(`Error fetching versions for content ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch content versions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const contentId = params.id
    const data = await req.json()

    // In a real implementation, this would save to a database
    // For now, we'll just return the data with a mock version ID

    return NextResponse.json({
      id: `v${Date.now()}`,
      contentId,
      version: data.version || 1,
      content: data.content,
      createdAt: new Date().toISOString(),
      createdBy: session.user?.name || "Unknown User",
      note: data.note || "New version",
    })
  } catch (error) {
    console.error(`Error creating version for content ID ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to create content version" }, { status: 500 })
  }
}
