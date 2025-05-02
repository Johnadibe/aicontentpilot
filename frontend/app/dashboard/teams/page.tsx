import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserTeams } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TeamsList } from "@/components/teams/teams-list"
import { CreateTeamButton } from "@/components/teams/create-team-button"

export const metadata = {
  title: "Teams | AI Content Pilot",
  description: "Manage your teams and collaborate on content",
}

export default async function TeamsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const teams = await getUserTeams(session.user.id)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Teams"
        text="Create and manage your teams for collaborative content creation."
        action={<CreateTeamButton />}
      />
      <TeamsList teams={teams} />
    </DashboardShell>
  )
}
