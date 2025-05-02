import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET /api/templates - Get all templates
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("query")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {
      OR: [{ userId: session.user.id }, { isPublic: true }],
    }

    if (category) {
      where.category = category
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ]
    }

    // Get templates with pagination
    const templates = await prisma.template.findMany({
      where,
      orderBy: {
        [sort]: order.toLowerCase(),
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    // Get total count for pagination
    const total = await prisma.template.count({ where })

    return NextResponse.json({
      templates,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[TEMPLATES_GET]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}

// POST /api/templates - Create a new template
export async function POST(request: Request) {
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

    if (!title || !content) {
      return new NextResponse(
        JSON.stringify({
          error: "Title and content are required",
        }),
        { status: 400 },
      )
    }

    const template = await prisma.template.create({
      data: {
        title,
        description: description || "",
        content,
        category: category || "Other",
        tags: tags || [],
        isPublic: isPublic || false,
        userId: session.user.id,
      },
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error("[TEMPLATES_POST]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}
