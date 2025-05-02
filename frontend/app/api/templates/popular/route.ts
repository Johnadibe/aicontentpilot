import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET /api/templates/popular - Get popular templates
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
    const limit = Number.parseInt(searchParams.get("limit") || "5")

    // Build filter conditions
    const where: any = {
      isPublic: true,
    }

    if (category) {
      where.category = category
    }

    // Get popular templates based on usage count
    const templates = await prisma.template.findMany({
      where,
      orderBy: {
        usageCount: "desc",
      },
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

    return NextResponse.json(templates)
  } catch (error) {
    console.error("[TEMPLATES_POPULAR_GET]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}
