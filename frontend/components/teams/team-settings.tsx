"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Team } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface TeamWithDetails extends Team {
    owner: {
        image: string | null;
        id: string;
        name: string | null;
        email: string | null;
    }
    members: {
        user: {
            image: string | null;
            id: string;
            name: string | null;
            email: string | null;
        }
        role: string
    }[]
}

interface TeamSettingsProps {
    team: TeamWithDetails
}

export function TeamSettings({ team }: TeamSettingsProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [teamName, setTeamName] = useState(team.name)
    const [teamDescription, setTeamDescription] = useState(team.description || "")

    const handleUpdateTeam = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`/api/teams/${team.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: teamName,
                    description: teamDescription,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to update team")
            }

            toast({
                title: "Team updated",
                description: "Your team settings have been updated successfully.",
            })

            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update team settings. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteTeam = async () => {
        setIsLoading(true)

        try {
            const response = await fetch(`/api/teams/${team.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to delete team")
            }

            toast({
                title: "Team deleted",
                description: "Your team has been deleted successfully.",
            })

            router.push("/dashboard/teams")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete team. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Team Information</CardTitle>
                    <CardDescription>
                        Update your team's basic information.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateTeam}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="team-name">Team Name</Label>
                            <Input
                                id="team-name"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team-description">Description</Label>
                            <Textarea
                                id="team-description"
                                value={teamDescription}
                                onChange={(e) => setTeamDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe the purpose of this team"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Permanently delete this team and all of its data.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently delete the team, all of its workspaces, content, and remove all team members.
                    </p>
                </CardContent>
                <CardFooter>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Team</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the team
                                    "{team.name}" and remove all associated data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteTeam}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Deleting..." : "Delete Team"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    )
}