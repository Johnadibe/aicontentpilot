import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const contentSchema = z.object({
  title: z.string().min(3),
  prompt: z.string().min(10),
  type: z.enum(["BLOG_POST", "SOCIAL_MEDIA", "EMAIL", "AD_COPY", "PRODUCT_DESCRIPTION", "SEO_CONTENT", "OTHER"]),
  tags: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, prompt, type, tags } = contentSchema.parse(body)

    // Here you would typically call an AI service to generate content
    // For now, we'll just create a placeholder content
    const generatedContent = `# ${title}\n\nThis is a placeholder for AI-generated content based on your prompt: "${prompt}"\n\nMore content would be generated here using an AI service.`

    // Create the content in the database
    const content = await db.content.create({
      data: {
        title,
        content: generatedContent,
        type,
        status: "DRAFT",
        userId: session.user.id,
        tags: {
          connectOrCreate:
            tags?.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })) || [],
        },
      },
    })

    // Log the activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        action: "CONTENT_CREATED",
        entityType: "CONTENT",
        entityId: content.id,
        metadata: {
          contentType: type,
          title,
        },
      },
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error("Error creating content:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const tag = searchParams.get("tag")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      }
    }

    const [contents, total] = await Promise.all([
      db.content.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        include: {
          tags: true,
        },
      }),
      db.content.count({ where }),
    ])

    return NextResponse.json({
      contents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
