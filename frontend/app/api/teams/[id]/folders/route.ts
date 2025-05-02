import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole } from "@prisma/client"
import { createFolder, getTeamFolders } from "@/lib/team-service"

const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  parentId: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teamId = params.id
    const { searchParams } = new URL(req.url)
    const parentId = searchParams.get("parentId") || undefined

    // Check if user is a member of the team
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "You don't have access to this team" }, { status: 403 })
    }

    const folders = await getTeamFolders(teamId, parentId)

    return NextResponse.json({ folders })
  } catch (error) {
    console.error("Error fetching team folders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teamId = params.id
    const body = await req.json()
    const { name, parentId } = createFolderSchema.parse(body)

    // Check if user is a member with at least EDITOR role
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.EDITOR] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "You don't have permission to create folders in this team" }, { status: 403 })
    }

    // If parentId is provided, check if it exists and belongs to the team
    if (parentId) {
      const parentFolder = await db.folder.findUnique({
        where: { id: parentId },
      })

      if (!parentFolder || parentFolder.teamId !== teamId) {
        return NextResponse.json({ error: "Parent folder not found or does not belong to this team" }, { status: 400 })
      }
    }

    const folder = await createFolder({
      name,
      teamId,
      parentId,
    })

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error("Error creating folder:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
