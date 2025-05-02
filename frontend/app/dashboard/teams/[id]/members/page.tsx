import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { TeamMembers } from "@/components/teams/team-members"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Team Members | AI Content Pilot",
  description: "Manage your team members and permissions",
}

export default async function TeamMembersPage({ params }: { params: { id: string } }) {
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
      <TeamTabs team={team} activeTab="members" />
      <TeamMembers team={team} currentUserId={session.user.id} />
    </DashboardShell>
  )
}
