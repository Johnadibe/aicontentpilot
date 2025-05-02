"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Pin, MoreHorizontal, Edit, Trash, MessageSquare, Calendar } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"

interface TeamAnnouncementsProps {
  team: any
}

export function TeamAnnouncements({ team }: TeamAnnouncementsProps) {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: "1",
      title: "New Content Strategy",
      content:
        "We're updating our content strategy for Q3. Please review the attached document and provide feedback by Friday.",
      createdAt: "2023-06-15T10:30:00Z",
      createdBy: {
        id: "user1",
        name: "John Doe",
        image: "/placeholder.svg?key=kom00",
      },
      isPinned: true,
      comments: 5,
    },
    {
      id: "2",
      title: "Team Meeting - July 1st",
      content:
        "We'll be having our monthly team meeting on July 1st at 10:00 AM. Please prepare your progress reports and be ready to discuss upcoming projects.",
      createdAt: "2023-06-20T14:15:00Z",
      createdBy: {
        id: "user2",
        name: "Jane Smith",
        image: "/placeholder.svg?key=hwjsd",
      },
      isPinned: false,
      comments: 2,
    },
    {
      id: "3",
      title: "New Team Member",
      content:
        "Please welcome Sarah Williams to our team! Sarah will be joining us as a Content Specialist starting next Monday.",
      createdAt: "2023-06-22T09:45:00Z",
      createdBy: {
        id: "user1",
        name: "John Doe",
        image: "/placeholder.svg?key=99b04",
      },
      isPinned: false,
      comments: 8,
    },
  ])

  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/teams/${team.id}/announcements`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ title, content, isPinned }),
      // })

      // if (!response.ok) {
      //   throw new Error("Failed to create announcement")
      // }

      // const newAnnouncement = await response.json()

      // Mock response
      const newAnnouncement = {
        id: `${Date.now()}`,
        title,
        content,
        createdAt: new Date().toISOString(),
        createdBy: {
          id: "currentUser",
          name: "Current User",
          image: "/placeholder.svg?key=af5kv",
        },
        isPinned,
        comments: 0,
      }

      setAnnouncements([newAnnouncement, ...announcements])
      setIsCreateDialogOpen(false)
      setTitle("")
      setContent("")
      setIsPinned(false)

      toast({
        title: "Announcement created",
        description: "Your announcement has been posted successfully",
      })
    } catch (error) {
      console.error("Error creating announcement:", error)
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePin = (id: string) => {
    setAnnouncements(
      announcements.map((announcement) =>
        announcement.id === id ? { ...announcement, isPinned: !announcement.isPinned } : announcement,
      ),
    )
  }

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((announcement) => announcement.id !== id))
    toast({
      title: "Announcement deleted",
      description: "The announcement has been deleted successfully",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Announcements</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No announcements yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first team announcement to keep everyone informed.
            </p>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={announcement.isPinned ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {announcement.isPinned && (
                      <Badge variant="secondary" className="gap-1">
                        <Pin className="h-3 w-3" />
                        Pinned
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(announcement.createdAt)}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleTogglePin(announcement.id)}>
                        <Pin className="mr-2 h-4 w-4" />
                        {announcement.isPinned ? "Unpin" : "Pin"} Announcement
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Announcement
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Announcement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{announcement.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={announcement.createdBy.image || "/placeholder.svg"}
                      alt={announcement.createdBy.name}
                    />
                    <AvatarFallback>{announcement.createdBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Posted by {announcement.createdBy.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {announcement.comments} {announcement.comments === 1 ? "comment" : "comments"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>Post an announcement to your team. All team members will be notified.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                placeholder="Write your announcement here..."
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pin"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="pin" className="text-sm">
                Pin this announcement to the top
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAnnouncement} disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Announcement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
