"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Plus, Settings, MoreHorizontal, Folder, FileText, ImageIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"

interface TeamsListProps {
  teams: any[]
}

interface TeamMember {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  role: string;
}

export function TeamsList({ teams }: TeamsListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teams..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No teams found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery ? "Try adjusting your search query" : "Create your first team to start collaborating"}
          </p>
          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
          {!searchQuery && (
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2">
                    {team.members.length} {team.members.length === 1 ? "member" : "members"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/teams/${team.id}`)}>
                        View Team
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/teams/${team.id}/content`)}>
                        Team Content
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/teams/${team.id}/members`)}>
                        Manage Members
                      </DropdownMenuItem>
                      {team.owner.id === team.members.find((m: TeamMember) => m.role === "OWNER")?.user.id && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/teams/${team.id}/settings`)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Team Settings
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl">{team.name}</CardTitle>
                {team.description && <CardDescription>{team.description}</CardDescription>}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{team._count.contents} contents</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{team._count.templates} templates</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{team._count.images} images</span>
                  </div>
                </div>
                <div className="flex -space-x-2 mt-4">
                  {team.members.slice(0, 5).map((member: TeamMember) => (
                    <Avatar key={member.user.id} className="border-2 border-background h-8 w-8">
                      <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name} />
                      <AvatarFallback>{member.user.name?.charAt(0) || member.user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {team.members.length > 5 && (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                      +{team.members.length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button asChild className="w-full">
                  <Link href={`/dashboard/teams/${team.id}`}>View Team</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateTeamDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
