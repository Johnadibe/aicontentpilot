import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// GET /api/templates/categories - Get all template categories
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

    // Get distinct categories and count templates in each
    const categories = await prisma.template.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      orderBy: {
        _count: {
          category: "desc",
        },
      },
    })

    const formattedCategories = categories.map((category) => ({
      name: category.category,
      count: category._count.category,
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("[TEMPLATES_CATEGORIES_GET]", error)
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      { status: 500 },
    )
  }
}
