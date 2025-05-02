import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole } from "@prisma/client"

const addMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum([TeamRole.ADMIN, TeamRole.EDITOR, TeamRole.MEMBER, TeamRole.VIEWER]),
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

    const members = await db.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        permissions: true,
      },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching team members:", error)
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
    const { email, role } = addMemberSchema.parse(body)

    // Check if user is an admin or owner of the team
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "You don't have permission to add members to this team" }, { status: 403 })
    }

    // Create invitation
    const invitation = await db.teamInvitation.create({
      data: {
        teamId,
        email,
        role,
        token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        senderId: session.user.id,
      },
      include: {
        team: true,
      },
    })

    // TODO: Send invitation email

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error("Error inviting team member:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
