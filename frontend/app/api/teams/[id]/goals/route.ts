import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole } from "@prisma/client"
import { createTeamGoal, getTeamGoals } from "@/lib/team-service"

const createGoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  target: z.number().positive("Target must be a positive number"),
  current: z.number().min(0, "Current value cannot be negative").optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Start date must be a valid date",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "End date must be a valid date",
  }),
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

    const goals = await getTeamGoals(teamId)

    return NextResponse.json({ goals })
  } catch (error) {
    console.error("Error fetching team goals:", error)
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
    const { title, description, target, current, startDate, endDate } = createGoalSchema.parse(body)

    // Check if user is an  target, current, startDate, endDate } = createGoalSchema.parse(body)

    // Check if user is an admin or owner of the team
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "You don't have permission to create goals for this team" }, { status: 403 })
    }

    const goal = await createTeamGoal({
      teamId,
      title,
      description,
      target,
      current,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error("Error creating team goal:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
