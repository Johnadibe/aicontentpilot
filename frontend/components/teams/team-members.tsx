"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  User,
  UserCog,
  Eye,
  Edit,
  Trash,
  Mail,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { TeamRole } from "@prisma/client"

interface TeamMembersProps {
  team: any
  currentUserId: string
}

export function TeamMembers({ team, currentUserId }: TeamMembersProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<TeamRole>(TeamRole.MEMBER)
  const [isLoading, setIsLoading] = useState(false)

  interface TeamMember {
    id: string;
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
    };
    role: string;
  }

  const isOwner = team.owner.id === currentUserId;
  const currentUserRole = team.members.find((member: TeamMember) => member.user.id === currentUserId)?.role;

  const filteredMembers = team.members.filter((member: TeamMember) =>
    member.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteMember = async () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/teams/${team.id}/members`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, role }),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to invite member")
      // }

      setIsInviteDialogOpen(false)
      setEmail("")
      setRole(TeamRole.MEMBER)

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      })
    } catch (error) {
      console.error("Error inviting member:", error)
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRole = async (memberId: string, newRole: TeamRole) => {
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ role: newRole }),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to update member role")
      // }

      toast({
        title: "Role updated",
        description: "Member role has been updated successfully",
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating member role:", error)
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to remove member")
      // }

      toast({
        title: "Member removed",
        description: "Member has been removed from the team",
      })
      router.refresh()
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <ShieldAlert className="h-4 w-4 text-primary" />
      case "ADMIN":
        return <Shield className="h-4 w-4 text-primary" />
      case "EDITOR":
        return <Edit className="h-4 w-4 text-muted-foreground" />
      case "VIEWER":
        return <Eye className="h-4 w-4 text-muted-foreground" />
      default:
        return <User className="h-4 w-4 text-muted-foreground" />
    }
  }

  const canManageMember = (memberRole: string) => {
    if (isOwner) return true
    if (currentUserRole === "ADMIN" && memberRole !== "OWNER" && memberRole !== "ADMIN") return true
    return false
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {(isOwner || currentUserRole === "ADMIN") && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Manage your team members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No members found matching your search</div>
            ) : (
              filteredMembers.map((member: TeamMember) => (
                <div key={member.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name} />
                      <AvatarFallback>{member.user.name?.charAt(0) || member.user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-sm text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getRoleIcon(member.role)}
                      {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                    </Badge>
                    {canManageMember(member.role) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                          {member.role !== "OWNER" && (
                            <>
                              {member.role !== "ADMIN" && (
                                <DropdownMenuItem onClick={() => handleUpdateRole(member.id, TeamRole.ADMIN)}>
                                  <Shield className="mr-2 h-4 w-4" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {member.role !== "EDITOR" && (
                                <DropdownMenuItem onClick={() => handleUpdateRole(member.id, TeamRole.EDITOR)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Make Editor
                                </DropdownMenuItem>
                              )}
                              {member.role !== "MEMBER" && (
                                <DropdownMenuItem onClick={() => handleUpdateRole(member.id, TeamRole.MEMBER)}>
                                  <User className="mr-2 h-4 w-4" />
                                  Make Member
                                </DropdownMenuItem>
                              )}
                              {member.role !== "VIEWER" && (
                                <DropdownMenuItem onClick={() => handleUpdateRole(member.id, TeamRole.VIEWER)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Make Viewer
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Remove from Team
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Manage your pending team invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock pending invitations */}
            {[
              { id: "inv1", email: "mark.johnson@example.com", role: "MEMBER", sentAt: "2023-06-20T14:00:00Z" },
              { id: "inv2", email: "sarah.williams@example.com", role: "EDITOR", sentAt: "2023-06-22T09:30:00Z" },
            ].map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{invitation.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Invited on {new Date(invitation.sentAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getRoleIcon(invitation.role)}
                    {invitation.role.charAt(0) + invitation.role.slice(1).toLowerCase()}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Resend
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to join your team. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select value={role} onValueChange={(value) => setRole(value as TeamRole)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TeamRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={TeamRole.EDITOR}>Editor</SelectItem>
                  <SelectItem value={TeamRole.MEMBER}>Member</SelectItem>
                  <SelectItem value={TeamRole.VIEWER}>Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {role === TeamRole.ADMIN && "Can manage team members and all content"}
                {role === TeamRole.EDITOR && "Can create and edit content, but cannot manage team members"}
                {role === TeamRole.MEMBER && "Can create content and collaborate with the team"}
                {role === TeamRole.VIEWER && "Can only view content, cannot create or edit"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteMember} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
