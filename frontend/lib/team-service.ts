import { db } from "@/lib/db"
import { TeamRole, InvitationStatus } from "@prisma/client"

// Team Management
export async function createTeam(data: {
  name: string
  description?: string
  ownerId: string
}) {
  return db.team.create({
    data: {
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
      members: {
        create: {
          userId: data.ownerId,
          role: TeamRole.OWNER,
        },
      },
      workspaces: {
        create: {
          name: "Default Workspace",
          description: "Default workspace for your team",
          isDefault: true,
        },
      },
    },
    include: {
      members: true,
      workspaces: true,
    },
  })
}

export async function getTeam(id: string) {
  return db.team.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
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
      },
      workspaces: true,
    },
  })
}

export async function getUserTeams(userId: string) {
  return db.team.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          contents: true,
          templates: true,
          images: true,
        },
      },
    },
  })
}

export async function updateTeam(
  id: string,
  data: {
    name?: string
    description?: string
  },
) {
  return db.team.update({
    where: { id },
    data,
  })
}

export async function deleteTeam(id: string) {
  return db.team.delete({
    where: { id },
  })
}

// Team Members
export async function addTeamMember(data: {
  teamId: string
  userId: string
  role: TeamRole
}) {
  return db.teamMember.create({
    data: {
      teamId: data.teamId,
      userId: data.userId,
      role: data.role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })
}

export async function updateTeamMember(
  id: string,
  data: {
    role?: TeamRole
  },
) {
  return db.teamMember.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })
}

export async function removeTeamMember(id: string) {
  return db.teamMember.delete({
    where: { id },
  })
}

// Team Invitations
export async function createTeamInvitation(data: {
  teamId: string
  email: string
  role: TeamRole
  senderId: string
  expiresAt?: Date
}) {
  const token = generateInvitationToken()
  const expiresAt = data.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days by default

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  })

  return db.teamInvitation.create({
    data: {
      teamId: data.teamId,
      email: data.email,
      role: data.role,
      token,
      expiresAt,
      senderId: data.senderId,
      invitedUserId: existingUser?.id,
    },
    include: {
      team: true,
    },
  })
}

export async function getTeamInvitation(token: string) {
  return db.teamInvitation.findUnique({
    where: { token },
    include: {
      team: true,
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function acceptTeamInvitation(token: string, userId: string) {
  const invitation = await db.teamInvitation.findUnique({
    where: { token },
  })

  if (!invitation) {
    throw new Error("Invitation not found")
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new Error(`Invitation has already been ${invitation.status.toLowerCase()}`)
  }

  if (invitation.expiresAt < new Date()) {
    await db.teamInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.EXPIRED },
    })
    throw new Error("Invitation has expired")
  }

  // Begin transaction
  return db.$transaction(async (tx) => {
    // Update invitation status
    await tx.teamInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED },
    })

    // Add user to team
    return tx.teamMember.create({
      data: {
        teamId: invitation.teamId,
        userId,
        role: invitation.role,
      },
      include: {
        team: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })
  })
}

export async function declineTeamInvitation(token: string) {
  return db.teamInvitation.update({
    where: { token },
    data: { status: InvitationStatus.DECLINED },
  })
}

// Team Workspaces
export async function createWorkspace(data: {
  teamId: string
  name: string
  description?: string
  icon?: string
  color?: string
  isDefault?: boolean
}) {
  return db.workspace.create({
    data,
  })
}

export async function getWorkspace(id: string) {
  return db.workspace.findUnique({
    where: { id },
    include: {
      team: true,
    },
  })
}

export async function getTeamWorkspaces(teamId: string) {
  return db.workspace.findMany({
    where: { teamId },
  })
}

export async function updateWorkspace(
  id: string,
  data: {
    name?: string
    description?: string
    icon?: string
    color?: string
    isDefault?: boolean
  },
) {
  return db.workspace.update({
    where: { id },
    data,
  })
}

export async function deleteWorkspace(id: string) {
  return db.workspace.delete({
    where: { id },
  })
}

// Team Folders
export async function createFolder(data: {
  name: string
  teamId: string
  parentId?: string
}) {
  return db.folder.create({
    data,
    include: {
      parent: true,
    },
  })
}

export async function getFolder(id: string) {
  return db.folder.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      contents: {
        include: {
          tags: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      images: {
        include: {
          tags: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })
}

export async function getTeamFolders(teamId: string, parentId?: string) {
  return db.folder.findMany({
    where: {
      teamId,
      parentId: parentId || null,
    },
    include: {
      _count: {
        select: {
          children: true,
          contents: true,
          images: true,
        },
      },
    },
  })
}

export async function updateFolder(
  id: string,
  data: {
    name?: string
    parentId?: string | null
  },
) {
  return db.folder.update({
    where: { id },
    data,
  })
}

export async function deleteFolder(id: string) {
  return db.folder.delete({
    where: { id },
  })
}

// Team Announcements
export async function createAnnouncement(data: {
  teamId: string
  title: string
  content: string
  createdBy: string
  isPinned?: boolean
}) {
  return db.teamAnnouncement.create({
    data,
  })
}

export async function getTeamAnnouncements(teamId: string) {
  return db.teamAnnouncement.findMany({
    where: { teamId },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  })
}

export async function updateAnnouncement(
  id: string,
  data: {
    title?: string
    content?: string
    isPinned?: boolean
  },
) {
  return db.teamAnnouncement.update({
    where: { id },
    data,
  })
}

export async function deleteAnnouncement(id: string) {
  return db.teamAnnouncement.delete({
    where: { id },
  })
}

// Team Goals
export async function createTeamGoal(data: {
  teamId: string
  title: string
  description?: string
  target: number
  current?: number
  startDate: Date
  endDate: Date
}) {
  return db.teamGoal.create({
    data,
  })
}

export async function getTeamGoals(teamId: string) {
  return db.teamGoal.findMany({
    where: { teamId },
    orderBy: { endDate: "asc" },
  })
}

export async function updateTeamGoal(
  id: string,
  data: {
    title?: string
    description?: string
    target?: number
    current?: number
    startDate?: Date
    endDate?: Date
  },
) {
  return db.teamGoal.update({
    where: { id },
    data,
  })
}

export async function deleteTeamGoal(id: string) {
  return db.teamGoal.delete({
    where: { id },
  })
}

// Permissions
export async function setPermission(data: {
  teamMemberId: string
  resource: string
  action: string
  conditions?: any
}) {
  return db.permission.upsert({
    where: {
      teamMemberId_resource_action: {
        teamMemberId: data.teamMemberId,
        resource: data.resource,
        action: data.action,
      },
    },
    update: {
      conditions: data.conditions,
    },
    create: {
      teamMemberId: data.teamMemberId,
      resource: data.resource,
      action: data.action,
      conditions: data.conditions,
    },
  })
}

export async function removePermission(data: {
  teamMemberId: string
  resource: string
  action: string
}) {
  return db.permission.delete({
    where: {
      teamMemberId_resource_action: {
        teamMemberId: data.teamMemberId,
        resource: data.resource,
        action: data.action,
      },
    },
  })
}

export async function getMemberPermissions(teamMemberId: string) {
  return db.permission.findMany({
    where: { teamMemberId },
  })
}

// Tasks
export async function createTask(data: {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: Date
  contentId?: string
  teamId: string
  assigneeId?: string
  createdById: string
}) {
  return db.task.create({
    data,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      content: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
}

export async function getTeamTasks(teamId: string) {
  return db.task.findMany({
    where: { teamId },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      content: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  })
}

export async function getUserTasks(userId: string) {
  return db.task.findMany({
    where: { assigneeId: userId },
    include: {
      team: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      content: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  })
}

export async function updateTask(
  id: string,
  data: {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    dueDate?: Date
    assigneeId?: string | null
  },
) {
  return db.task.update({
    where: { id },
    data,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })
}

export async function deleteTask(id: string) {
  return db.task.delete({
    where: { id },
  })
}

// Comments
export async function createComment(data: {
  contentId: string
  userId: string
  text: string
  parentId?: string
}) {
  return db.comment.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      parent: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  })
}

export async function getContentComments(contentId: string) {
  return db.comment.findMany({
    where: {
      contentId,
      parentId: null, // Only get top-level comments
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateComment(
  id: string,
  data: {
    text: string
  },
) {
  return db.comment.update({
    where: { id },
    data,
  })
}

export async function deleteComment(id: string) {
  return db.comment.delete({
    where: { id },
  })
}

// Content Lock/Unlock
export async function lockContent(contentId: string, userId: string) {
  return db.content.update({
    where: { id: contentId },
    data: {
      isLocked: true,
      lockedBy: userId,
      lockedAt: new Date(),
    },
  })
}

export async function unlockContent(contentId: string) {
  return db.content.update({
    where: { id: contentId },
    data: {
      isLocked: false,
      lockedBy: null,
      lockedAt: null,
    },
  })
}

// Helper functions
function generateInvitationToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Types
import type { TaskStatus, TaskPriority } from "@prisma/client"
