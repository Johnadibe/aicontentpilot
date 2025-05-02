import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole } from "@prisma/client"
import { createAnnouncement, getTeamAnnouncements } from "@/lib/team-service"

const createAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  isPinned: z.boolean().optional(),
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

    const announcements = await getTeamAnnouncements(teamId)

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error("Error fetching team announcements:", error)
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
    const { title, content, isPinned } = createAnnouncementSchema.parse(body)

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
        { error: "You don't have permission to create announcements for this team" },
        { status: 403 },
      )
    }

    const announcement = await createAnnouncement({
      teamId,
      title,
      content,
      createdBy: session.user.id,
      isPinned,
    })

    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error("Error creating announcement:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
