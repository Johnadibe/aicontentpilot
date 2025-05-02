"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { FileText, ImageIcon, MessageSquare, Mail, Filter, Search, ChevronDown, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/utils"

// Mock data for recent activities
const recentActivities = [
  {
    id: "act1",
    name: "You",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "Created a new blog post",
    actionType: "CONTENT_CREATED",
    contentType: "BLOG_POST",
    title: "10 Ways to Improve Your Content Marketing",
    time: "2h ago",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "act2",
    name: "You",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "Generated a new image",
    actionType: "IMAGE_CREATED",
    contentType: "IMAGE",
    title: "Product showcase for new launch",
    time: "4h ago",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "act3",
    name: "You",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "Updated a template",
    actionType: "TEMPLATE_UPDATED",
    contentType: "TEMPLATE",
    title: "Newsletter Template",
    time: "Yesterday",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "act4",
    name: "You",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "Created a social media post",
    actionType: "CONTENT_CREATED",
    contentType: "SOCIAL_MEDIA",
    title: "Product announcement for Twitter",
    time: "2d ago",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "act5",
    name: "You",
    avatar: "/placeholder.svg?height=32&width=32",
    action: "Generated SEO content",
    actionType: "CONTENT_CREATED",
    contentType: "SEO_CONTENT",
    title: "SEO optimization for product page",
    time: "5d ago",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
]

export function RecentActivity() {
  const [activities, setActivities] = useState(recentActivities)
  const [filter, setFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null)

  // Filter activities based on selected filter and search query
  const filteredActivities = activities.filter((activity) => {
    const matchesFilter = filter === "ALL" || activity.contentType === filter
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Get icon based on content type
  const getActivityIcon = (contentType: string) => {
    switch (contentType) {
      case "BLOG_POST":
      case "SEO_CONTENT":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "IMAGE":
        return <ImageIcon className="h-4 w-4 text-purple-500" />
      case "SOCIAL_MEDIA":
        return <MessageSquare className="h-4 w-4 text-pink-500" />
      case "EMAIL":
        return <Mail className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilter("ALL")}>All Activities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("BLOG_POST")}>Blog Posts</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("SOCIAL_MEDIA")}>Social Media</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("IMAGE")}>Images</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("EMAIL")}>Emails</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("SEO_CONTENT")}>SEO Content</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("TEMPLATE")}>Templates</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No activities found</div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="space-y-2">
              <div
                className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} alt="Avatar" />
                  <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1 flex-1">
                  <div className="flex items-center">
                    {getActivityIcon(activity.contentType)}
                    <p className="text-sm font-medium leading-none ml-1">{activity.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                  {expandedActivity === activity.id ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>

              {expandedActivity === activity.id && (
                <div className="ml-13 pl-13 border-l-2 border-muted ml-4 pl-9">
                  <div className="bg-muted/50 p-3 rounded-md text-sm">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-muted-foreground mt-1">{formatDate(activity.timestamp)}</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
