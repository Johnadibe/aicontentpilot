import Link from "next/link"
import { ChevronLeft, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TeamHeaderProps {
  team: any
}

export function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/teams">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Teams
          </Link>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`/abstract-geometric-shapes.png?key=pap3j&height=40&width=40&query=${team.name}`}
              alt={team.name}
            />
            <AvatarFallback>
              <Users className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            {team.description && <p className="text-muted-foreground">{team.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.members.slice(0, 5).map((member: { user: { id: string; image: string | null; name: string | null; email: string | null } }) => (
              <Avatar key={member.user.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name || undefined} />
                <AvatarFallback>{member.user.name?.charAt(0) || member.user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 5 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                +{team.members.length - 5}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/teams/${team.id}/members`}>Manage Members</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
