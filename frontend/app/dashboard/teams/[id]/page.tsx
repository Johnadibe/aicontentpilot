import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { TeamOverview } from "@/components/teams/team-overview"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Team Dashboard | AI Content Pilot",
  description: "Collaborate with your team on content creation",
}

export default async function TeamPage({ params }: { params: { id: string } }) {
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

  return (
    <DashboardShell>
      <TeamHeader team={team} />
      <TeamTabs team={team} />
      <TeamOverview team={team} />
    </DashboardShell>
  )
}
