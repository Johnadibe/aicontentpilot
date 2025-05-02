import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET /api/templates/[id] - Get a specific template
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      )
    }

    const template = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!template) {
      return new NextResponse(
        JSON.stringify({
          error: "Template not found",
        }),
        { status: 404 },
      )
    }

    // Check if the user has access to this template
    if (template.userId !== session.user.id && !template.isPublic) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      )
    }

    // Increment usage count
    await prisma.template.update({
      where: {
        id: params.id,
      },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("[TEMPLATE_GET]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}

// PUT /api/templates/[id] - Update a template
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      )
    }

    const json = await request.json()
    const { title, description, content, category, tags, isPublic } = json

    // Check if the template exists and belongs to the user
    const existingTemplate = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTemplate) {
      return new NextResponse(
        JSON.stringify({
          error: "Template not found",
        }),
        { status: 404 },
      )
    }

    if (existingTemplate.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      )
    }

    const updatedTemplate = await prisma.template.update({
      where: {
        id: params.id,
      },
      data: {
        title: title || existingTemplate.title,
        description: description ?? existingTemplate.description,
        content: content || existingTemplate.content,
        category: category || existingTemplate.category,
        tags: tags || existingTemplate.tags,
        isPublic: isPublic ?? existingTemplate.isPublic,
      },
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error("[TEMPLATE_PUT]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}

// DELETE /api/templates/[id] - Delete a template
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      )
    }

    // Check if the template exists and belongs to the user
    const existingTemplate = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTemplate) {
      return new NextResponse(
        JSON.stringify({
          error: "Template not found",
        }),
        { status: 404 },
      )
    }

    if (existingTemplate.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        { status: 401 },
      )
    }

    await prisma.template.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[TEMPLATE_DELETE]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}
