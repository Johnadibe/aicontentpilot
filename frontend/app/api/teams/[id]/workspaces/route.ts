import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole } from "@prisma/client"
import { createWorkspace, getTeamWorkspaces } from "@/lib/team-service"

const createWorkspaceSchema = z.object({
  name: z.string().min(3, "Workspace name must be at least 3 characters"),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teamId = params.id

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

    const workspaces = await getTeamWorkspaces(teamId)

    return NextResponse.json({ workspaces })
  } catch (error) {
    console.error("Error fetching team workspaces:", error)
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
    const { name, description, icon, color, isDefault } = createWorkspaceSchema.parse(body)

    // Check if user is an admin or owner of the team
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN] },
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: "You don't have permission to create workspaces for this team" },
        { status: 403 },
      )
    }

    // If setting as default, unset any existing default workspace
    if (isDefault) {
      await db.workspace.updateMany({
        where: { teamId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const workspace = await createWorkspace({
      teamId,
      name,
      description,
      icon,
      color,
      isDefault,
    })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    console.error("Error creating workspace:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
