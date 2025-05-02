import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { Folder } from "lucide-react"
import { Team } from "@prisma/client"

interface WorkspacesListProps {
    team: Team;
    workspaces: Workspace[]
    teamId: string
}

export interface Project {
    id: string
    name: string
}

export interface Workspace {
    id: string
    name: string
    description?: string
    projects?: Project[]
}

export function WorkspacesList({ team, workspaces, teamId }: WorkspacesListProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Workspaces</h2>
                <Link href={`/dashboard/teams/${teamId}/workspaces/new`}>
                    <Button>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New Workspace
                    </Button>
                </Link>
            </div>

            {workspaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                        <Folder className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No workspaces</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You don&apos;t have any workspaces yet. Create one to get started.
                    </p>
                    <Link href={`/dashboard/teams/${teamId}/workspaces/new`}>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            New Workspace
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workspaces.map((workspace) => (
                        <Card key={workspace.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">{workspace.name}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">
                                    {workspace.description || "No description"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="text-sm text-muted-foreground">
                                    {workspace.projects?.length || 0} projects
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Link href={`/dashboard/teams/${teamId}/workspaces/${workspace.id}`}>
                                    <Button variant="outline" size="sm">
                                        View
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/teams/${teamId}/workspaces/${workspace.id}/settings`}>
                                    <Button variant="ghost" size="sm">
                                        Settings
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
} 