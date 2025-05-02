import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getTeam, getWorkspace } from "@/lib/team-service"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TeamHeader } from "@/components/teams/team-header"
import { TeamTabs } from "@/components/teams/team-tabs"
import { WorkspaceView } from "@/components/teams/workspace-view"
import { notFound } from "next/navigation"

export const metadata = {
    title: "Workspace | AI Content Pilot",
    description: "View and manage workspace content",
}

export default async function WorkspacePage({
    params,
}: {
    params: { id: string; workspaceId: string }
}) {
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

    const workspace = await getWorkspace(params.workspaceId)

    if (!workspace || workspace.teamId !== params.id) {
        notFound()
    }

    return (
        <DashboardShell>
            <TeamHeader team={team} />
            <TeamTabs team={team} activeTab="workspaces" />
            <WorkspaceView team={team} workspace={workspace} />
        </DashboardShell>
    )
}