import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam, getTeamWorkspaces } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { WorkspacesList } from "@/components/teams/workspaces-list"
import { notFound } from "next/navigation"
import { Workspace } from "@/types"

export const metadata = {
  title: "Team Workspaces | AI Content Pilot",
  description: "Manage your team workspaces",
}

export default async function TeamWorkspacesPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const team = await getTeam(params.id)

  if (!team) {
    notFound()
  }

  // Check if user is a member of the team
  const isMember = team.members.some((member) => member.user.id === session.user.id)

  if (!isMember) {
    redirect("/dashboard/teams")
  }


  const fetchedWorkspaces = await getTeamWorkspaces(params.id)

  // Map workspaces to match the expected type (null -> undefined for description)
  const workspacesForList: Workspace[] = fetchedWorkspaces.map(ws => ({
    ...ws,
    description: ws.description === null ? undefined : ws.description,
  }));

  return (
    <DashboardShell>
      <TeamHeader team={team} />
      <TeamTabs team={team} activeTab="workspaces" />
      <WorkspacesList team={team} workspaces={workspacesForList} teamId={params.id} />
    </DashboardShell>
  )
}
