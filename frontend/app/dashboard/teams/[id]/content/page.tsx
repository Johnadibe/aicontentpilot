import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam, getTeamFolders } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { TeamContentLibrary } from "@/components/teams/team-content-library"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Team Content Library | AI Content Pilot",
  description: "Access and manage your team's shared content",
}

export default async function TeamContentPage({ params }: { params: { id: string } }) {
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

  const rootFolders = await getTeamFolders(params.id)

  return (
    <DashboardShell>
      <TeamHeader team={team} />
      <TeamTabs team={team} activeTab="content" />
      <TeamContentLibrary team={team} rootFolders={rootFolders} />
    </DashboardShell>
  )
}
