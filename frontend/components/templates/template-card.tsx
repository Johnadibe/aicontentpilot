import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { TemplateWithUser } from "@/lib/template-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Star, Users } from "lucide-react"

interface TemplateCardProps {
  template: TemplateWithUser
  viewMode: "grid" | "list"
}

export function TemplateCard({ template, viewMode }: TemplateCardProps) {
  const initials = template.user.name
    ? template.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "U"

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden transition-all hover:border-primary/50">
        <Link href={`/dashboard/templates/${template.id}`} className="block h-full">
          <div className="flex h-full items-center p-4">
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-md bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{template.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {template.description || "No description"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{template.category}</Badge>
                  {template.isPublic && (
                    <Badge variant="secondary">
                      <Users className="mr-1 h-3 w-3" />
                      Public
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Avatar className="mr-1 h-4 w-4">
                    <AvatarImage src={template.user.image || ""} alt={template.user.name || ""} />
                    <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                  </Avatar>
                  <span>{template.user.name}</span>
                </div>
                <span className="mx-2">•</span>
                <span>{formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Star className="mr-1 h-3 w-3" />
                  {template.usageCount} uses
                </span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50">
      <Link href={`/dashboard/templates/${template.id}`} className="block h-full">
        <CardHeader className="border-b bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{template.category}</Badge>
            {template.isPublic && (
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-medium">{template.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{template.description || "No description"}</p>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Avatar className="mr-1 h-4 w-4">
                <AvatarImage src={template.user.image || ""} alt={template.user.name || ""} />
                <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
              </Avatar>
              <span>{template.user.name}</span>
            </div>
            <div className="flex items-center">
              <Star className="mr-1 h-3 w-3" />
              {template.usageCount} uses
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
