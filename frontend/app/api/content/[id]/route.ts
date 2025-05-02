import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const content = await db.content.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        tags: true,
      },
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if content exists and belongs to the user
    const content = await db.content.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Delete the content
    await db.content.delete({
      where: {
        id: params.id,
      },
    })

    // Log the activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        action: "CONTENT_DELETED",
        entityType: "CONTENT",
        entityId: params.id,
        metadata: {
          contentType: content.type,
          title: content.title,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content: contentText, status, tags } = body

    // Check if content exists and belongs to the user
    const existingContent = await db.content.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        tags: true,
      },
    })

    if (!existingContent) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    // Update the content
    const updatedContent = await db.content.update({
      where: {
        id: params.id,
      },
      data: {
        title: title || existingContent.title,
        content: contentText || existingContent.content,
        status: status || existingContent.status,
        tags: tags
          ? {
              disconnect: existingContent.tags.map((tag) => ({ id: tag.id })),
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: {
        tags: true,
      },
    })

    // Log the activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        action: "CONTENT_UPDATED",
        entityType: "CONTENT",
        entityId: params.id,
        metadata: {
          contentType: existingContent.type,
          title: updatedContent.title,
        },
      },
    })

    return NextResponse.json(updatedContent)
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
