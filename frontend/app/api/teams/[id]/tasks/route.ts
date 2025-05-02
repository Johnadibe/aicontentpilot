import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { TeamRole, TaskStatus, TaskPriority } from "@prisma/client"
import { createTask, getTeamTasks } from "@/lib/team-service"

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Due date must be a valid date",
    }),
  contentId: z.string().optional(),
  assigneeId: z.string().optional(),
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

    const tasks = await getTeamTasks(teamId)

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching team tasks:", error)
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
    const { title, description, status, priority, dueDate, contentId, assigneeId } = createTaskSchema.parse(body)

    // Check if user is a member with at least EDITOR role
    const membership = await db.teamMember.findFirst({
      where: {
        teamId,
        userId: session.user.id,
        role: { in: [TeamRole.OWNER, TeamRole.ADMIN, TeamRole.EDITOR] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "You don't have permission to create tasks in this team" }, { status: 403 })
    }

    // If contentId is provided, check if it exists and belongs to the team
    if (contentId) {
      const content = await db.content.findUnique({
        where: { id: contentId },
      })

      if (!content || content.teamId !== teamId) {
        return NextResponse.json({ error: "Content not found or does not belong to this team" }, { status: 400 })
      }
    }

    // If assigneeId is provided, check if they are a member of the team
    if (assigneeId) {
      const assigneeMembership = await db.teamMember.findFirst({
        where: {
          teamId,
          userId: assigneeId,
        },
      })

      if (!assigneeMembership) {
        return NextResponse.json({ error: "Assignee is not a member of this team" }, { status: 400 })
      }
    }

    const task = await createTask({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      contentId,
      teamId,
      assigneeId,
      createdById: session.user.id,
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
