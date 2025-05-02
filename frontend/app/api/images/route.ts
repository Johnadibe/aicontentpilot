import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const imageSchema = z.object({
  prompt: z.string().min(3),
  url: z.string().url(),
  width: z.number().min(1),
  height: z.number().min(1),
  format: z.string(),
  tags: z.array(z.string()).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { prompt, url, width, height, format, tags } = imageSchema.parse(body)

    // Create the image in the database
    const image = await db.image.create({
      data: {
        prompt,
        url,
        width,
        height,
        format,
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
        action: "IMAGE_CREATED",
        entityType: "IMAGE",
        entityId: image.id,
        metadata: {
          prompt,
          width,
          height,
        },
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("Error creating image:", error)

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
    const tag = searchParams.get("tag")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const where: any = {
      userId: session.user.id,
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      }
    }

    const [images, total] = await Promise.all([
      db.image.findMany({
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
      db.image.count({ where }),
    ])

    return NextResponse.json({
      images,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
