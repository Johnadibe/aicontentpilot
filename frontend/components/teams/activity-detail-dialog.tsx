"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import {
    Activity,
    FileText,
    ImageIcon,
    MessageSquare,
    Users,
    CheckSquare,
    Folder,
    Star,
    AlertCircle,
    ExternalLink,
} from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Types for team activity
interface TeamActivityItem {
    id: string
    teamId: string
    userId: string
    user: {
        id: string
        name: string
        email: string
        image: string
    }
    type: ActivityType
    action: string
    resourceType: ResourceType
    resourceId: string
    resourceName: string
    metadata?: any
    createdAt: string
}

type ActivityType =
    | "created"
    | "updated"
    | "deleted"
    | "commented"
    | "joined"
    | "left"
    | "invited"
    | "completed"
    | "assigned"
    | "shared"
    | "locked"
    | "unlocked"
    | "approved"
    | "rejected"
    | "published"
    | "unpublished"

type ResourceType =
    | "content"
    | "image"
    | "template"
    | "comment"
    | "team"
    | "member"
    | "workspace"
    | "folder"
    | "task"
    | "announcement"
    | "goal"

interface ActivityDetailDialogProps {
    activity: TeamActivityItem
    trigger?: React.ReactNode
}

export function ActivityDetailDialog({ activity, trigger }: ActivityDetailDialogProps) {
    const [open, setOpen] = useState(false)

    // Get activity icon based on resource type
    const getActivityIcon = (resourceType: ResourceType) => {
        switch (resourceType) {
            case "content":
                return <FileText className="h-5 w-5" />
            case "image":
                return <ImageIcon className="h-5 w-5" />
            case "comment":
                return <MessageSquare className="h-5 w-5" />
            case "team":
            case "member":
                return <Users className="h-5 w-5" />
            case "workspace":
                return <Activity className="h-5 w-5" />
            case "folder":
                return <Folder className="h-5 w-5" />
            case "task":
                return <CheckSquare className="h-5 w-5" />
            case "announcement":
                return <AlertCircle className="h-5 w-5" />
            case "goal":
                return <Star className="h-5 w-5" />
            case "template":
                return <FileText className="h-5 w-5" />
            default:
                return <Activity className="h-5 w-5" />
        }
    }

    // Get activity color based on action type
    const getActivityColor = (type: ActivityType) => {
        switch (type) {
            case "created":
            case "joined":
            case "completed":
            case "approved":
            case "published":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            case "updated":
            case "assigned":
            case "locked":
            case "unlocked":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            case "deleted":
            case "left":
            case "rejected":
            case "unpublished":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            case "commented":
            case "invited":
            case "shared":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
        }
    }

    // Generate resource URL based on resource type and ID
    const getResourceUrl = () => {
        switch (activity.resourceType) {
            case "content":
                return `/dashboard/content/${activity.resourceId}`
            case "image":
                return `/dashboard/images/${activity.resourceId}`
            case "template":
                return `/dashboard/templates/${activity.resourceId}`
            case "team":
                return `/dashboard/teams/${activity.resourceId}`
            case "workspace":
                return `/dashboard/teams/${activity.teamId}/workspaces`
            case "folder":
                return `/dashboard/teams/${activity.teamId}/content?folder=${activity.resourceId}`
            case "task":
                return `/dashboard/teams/${activity.teamId}/tasks?task=${activity.resourceId}`
            default:
                return null
        }
    }

    const resourceUrl = getResourceUrl()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="sm">
                        View Details
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getActivityIcon(activity.resourceType)}
                        <span>Activity Details</span>
                    </DialogTitle>
                    <DialogDescription>Detailed information about this activity</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-4 p-1">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
                                <AvatarFallback>
                                    {activity.user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{activity.user.name}</div>
                                <div className="text-sm text-gray-500">{activity.user.email}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Action</div>
                                <Badge className={getActivityColor(activity.type)}>{activity.type}</Badge>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Date & Time</div>
                                <div className="text-sm">{format(new Date(activity.createdAt), "PPpp")}</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-500">Description</div>
                            <p className="text-sm mt-1">{activity.action}</p>
                        </div>

                        <div>
                            <div className="text-sm font-medium text-gray-500">Resource</div>
                            <div className="flex items-center gap-2 mt-1">
                                {getActivityIcon(activity.resourceType)}
                                <span className="text-sm capitalize">
                                    {activity.resourceType}: {activity.resourceName}
                                </span>
                            </div>
                        </div>

                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                            <div>
                                <div className="text-sm font-medium text-gray-500">Additional Details</div>
                                <div className="mt-1 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded border">
                                    {Object.entries(activity.metadata).map(([key, value]) => (
                                        <div key={key} className="flex gap-2 py-1">
                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                                            <span className="text-gray-700 dark:text-gray-300">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="flex justify-between items-center pt-2">
                    {resourceUrl ? (
                        <Button variant="outline" size="sm" asChild>
                            <a href={resourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                <span>View Resource</span>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </Button>
                    ) : (
                        <div />
                    )}
                    <DialogClose asChild>
                        <Button variant="secondary" size="sm">
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}