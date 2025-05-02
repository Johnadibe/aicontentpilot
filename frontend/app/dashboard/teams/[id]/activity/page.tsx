import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { TeamActivity } from "@/components/teams/team-activity"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Team Activity | AI Content Pilot",
  description: "View your team's activity",
}

export default async function TeamActivityPage({ params }: { params: { id: string } }) {
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
      <TeamTabs team={team} activeTab="activity" />
      <TeamActivity team={team} />
    </DashboardShell>
  )
}
