import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole } from "@prisma/client"
import { updateTeamMember, removeTeamMember } from "@/lib/team-service"

const updateMemberSchema = z.object({
  role: z.enum([TeamRole.ADMIN, TeamRole.EDITOR, TeamRole.MEMBER, TeamRole.VIEWER]),
})

export async function PATCH(req: Request, { params }: { params: { id: string; memberId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teamId = params.id
    const memberId = params.memberId
    const body = await req.json()
    const { role } = updateMemberSchema.parse(body)

    // Check if user is an admin or owner of the team
    const userMembership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN] },
      },
    })

    if (!userMembership) {
      return NextResponse.json({ error: "You don't have permission to update members in this team" }, { status: 403 })
    }

    // Check if the member exists
    const memberToUpdate = await db.teamMember.findUnique({
      where: { id: memberId },
      include: { team: true },
    })

    if (!memberToUpdate) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    if (memberToUpdate.teamId !== teamId) {
      return NextResponse.json({ error: "Member does not belong to this team" }, { status: 400 })
    }

    // Cannot change role of the team owner
    if (memberToUpdate.team.ownerId === memberToUpdate.userId) {
      return NextResponse.json({ error: "Cannot change the role of the team owner" }, { status: 400 })
    }

    // If user is admin, they cannot change the role of another admin
    if (userMembership.role === TeamRole.ADMIN && memberToUpdate.role === TeamRole.ADMIN) {
      return NextResponse.json({ error: "Admins cannot change the role of other admins" }, { status: 403 })
    }

    const updatedMember = await updateTeamMember(memberId, { role })

    return NextResponse.json(updatedMember)
  } catch (error) {
    console.error("Error updating team member:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; memberId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teamId = params.id
    const memberId = params.memberId

    // Check if user is an admin or owner of the team
    const userMembership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN] },
      },
    })

    if (!userMembership) {
      return NextResponse.json({ error: "You don't have permission to remove members from this team" }, { status: 403 })
    }

    // Check if the member exists
    const memberToRemove = await db.teamMember.findUnique({
      where: { id: memberId },
      include: { team: true },
    })

    if (!memberToRemove) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    if (memberToRemove.teamId !== teamId) {
      return NextResponse.json({ error: "Member does not belong to this team" }, { status: 400 })
    }

    // Cannot remove the team owner
    if (memberToRemove.team.ownerId === memberToRemove.userId) {
      return NextResponse.json({ error: "Cannot remove the team owner" }, { status: 400 })
    }

    // If user is admin, they cannot remove another admin
    if (userMembership.role === TeamRole.ADMIN && memberToRemove.role === TeamRole.ADMIN) {
      return NextResponse.json({ error: "Admins cannot remove other admins" }, { status: 403 })
    }

    await removeTeamMember(memberId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing team member:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
