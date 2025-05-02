import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { TeamSettings } from "@/components/teams/team-settings"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Team Settings | AI Content Pilot",
  description: "Manage your team settings",
}

export default async function TeamSettingsPage({ params }: { params: { id: string } }) {
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

  // Check if user is the owner or an admin
  const isOwnerOrAdmin =
    team.owner.id === session.user.id ||
    team.members.some(
      (member) => member.user.id === session.user.id && (member.role === "OWNER" || member.role === "ADMIN"),
    )

  if (!isOwnerOrAdmin) {
    redirect(`/dashboard/teams/${params.id}`)
  }

  return (
    <DashboardShell>
      <TeamHeader team={team} />
      <TeamTabs team={team} activeTab="settings" />
      <TeamSettings team={team} />
    </DashboardShell>
  )
}
