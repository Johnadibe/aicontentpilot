"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import {
    Activity,
    FileText,
    ImageIcon,
    MessageSquare,
    Users,
    Calendar,
    CheckSquare,
    Folder,
    Star,
    AlertCircle,
    Filter,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

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

interface TeamActivityProps {
    team: {
        id: string
        name: string
        members: any[]
    }
    initialActivities?: TeamActivityItem[]
}

export function TeamActivity({ team, initialActivities = [] }: TeamActivityProps) {
    const { data: session } = useSession()
    const [activities, setActivities] = useState<TeamActivityItem[]>(initialActivities)
    const [loading, setLoading] = useState(!initialActivities.length)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [filter, setFilter] = useState<{
        types: ActivityType[]
        resources: ResourceType[]
        users: string[]
    }>({
        types: [],
        resources: [],
        users: [],
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("all")

    // Fetch team activities
    useEffect(() => {
        if (initialActivities.length) {
            return
        }

        const fetchActivities = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/teams/${team.id}/activities?page=${page}&limit=20`)
                const data = await response.json()

                if (data.activities.length === 0) {
                    setHasMore(false)
                } else {
                    setActivities((prev) => (page === 1 ? data.activities : [...prev, ...data.activities]))
                }
            } catch (error) {
                console.error("Failed to fetch team activities:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [team.id, page, initialActivities])

    // Load more activities
    const loadMore = () => {
        if (!loading && hasMore) {
            setPage((prev) => prev + 1)
        }
    }

    // Filter activities based on selected filters and search term
    const filteredActivities = activities.filter((activity) => {
        // Filter by tab
        if (activeTab === "mine" && activity.userId !== session?.user.id) {
            return false
        }

        // Filter by selected types
        if (filter.types.length > 0 && !filter.types.includes(activity.type)) {
            return false
        }

        // Filter by selected resources
        if (filter.resources.length > 0 && !filter.resources.includes(activity.resourceType)) {
            return false
        }

        // Filter by selected users
        if (filter.users.length > 0 && !filter.users.includes(activity.userId)) {
            return false
        }

        // Filter by search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            return (
                activity.action.toLowerCase().includes(searchLower) ||
                activity.resourceName.toLowerCase().includes(searchLower) ||
                activity.user.name.toLowerCase().includes(searchLower)
            )
        }

        return true
    })

    // Get activity icon based on resource type
    const getActivityIcon = (resourceType: ResourceType) => {
        switch (resourceType) {
            case "content":
                return <FileText className="h-4 w-4" />
            case "image":
                return <ImageIcon className="h-4 w-4" />
            case "comment":
                return <MessageSquare className="h-4 w-4" />
            case "team":
            case "member":
                return <Users className="h-4 w-4" />
            case "workspace":
                return <Activity className="h-4 w-4" />
            case "folder":
                return <Folder className="h-4 w-4" />
            case "task":
                return <CheckSquare className="h-4 w-4" />
            case "announcement":
                return <AlertCircle className="h-4 w-4" />
            case "goal":
                return <Star className="h-4 w-4" />
            case "template":
                return <FileText className="h-4 w-4" />
            default:
                return <Activity className="h-4 w-4" />
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

    // Group activities by date
    const groupedActivities = filteredActivities.reduce(
        (groups, activity) => {
            const date = new Date(activity.createdAt).toDateString()
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(activity)
            return groups
        },
        {} as Record<string, TeamActivityItem[]>,
    )

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Team Activity</CardTitle>
                            <CardDescription>Recent actions and events in your team</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="all">All Activity</TabsTrigger>
                                    <TabsTrigger value="mine">My Activity</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Filter className="h-4 w-4" />
                                        <span className="sr-only">Filter activities</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="p-2">
                                        <div className="font-medium mb-1">Activity Types</div>
                                        {["created", "updated", "deleted", "commented", "completed"].map((type) => (
                                            <DropdownMenuCheckboxItem
                                                key={type}
                                                checked={filter.types.includes(type as ActivityType)}
                                                onCheckedChange={(checked) => {
                                                    setFilter((prev) => ({
                                                        ...prev,
                                                        types: checked
                                                            ? [...prev.types, type as ActivityType]
                                                            : prev.types.filter((t) => t !== type),
                                                    }))
                                                }}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </div>
                                    <div className="p-2 border-t">
                                        <div className="font-medium mb-1">Resource Types</div>
                                        {["content", "image", "comment", "task", "folder"].map((resource) => (
                                            <DropdownMenuCheckboxItem
                                                key={resource}
                                                checked={filter.resources.includes(resource as ResourceType)}
                                                onCheckedChange={(checked) => {
                                                    setFilter((prev) => ({
                                                        ...prev,
                                                        resources: checked
                                                            ? [...prev.resources, resource as ResourceType]
                                                            : prev.resources.filter((r) => r !== resource),
                                                    }))
                                                }}
                                            >
                                                {resource.charAt(0).toUpperCase() + resource.slice(1)}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="pt-2">
                        <Input
                            placeholder="Search activities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading && !activities.length ? (
                        <ActivitySkeleton />
                    ) : filteredActivities.length === 0 ? (
                        <div className="text-center py-10">
                            <Activity className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No activities found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm || Object.values(filter).some((arr) => arr.length > 0)
                                    ? "Try adjusting your filters or search term."
                                    : "Team activities will appear here as your team works together."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                                <div key={date} className="space-y-4">
                                    <div className="sticky top-0 z-10 flex items-center gap-2 bg-white dark:bg-gray-950 py-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <h3 className="text-sm font-medium">
                                            {new Date(date).toLocaleDateString(undefined, {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </h3>
                                    </div>
                                    <div className="space-y-4 pl-9">
                                        {dateActivities.map((activity) => (
                                            <div key={activity.id} className="flex gap-4">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
                                                    <AvatarFallback>
                                                        {activity.user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{activity.user.name}</span>
                                                        <Badge variant="outline" className={getActivityColor(activity.type)}>
                                                            {activity.type}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{activity.action}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        {getActivityIcon(activity.resourceType)}
                                                        <span>
                                                            {activity.resourceType}: {activity.resourceName}
                                                        </span>
                                                    </div>
                                                    {activity.metadata && (
                                                        <div className="mt-2 text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded">
                                                            {Object.entries(activity.metadata).map(([key, value]) => (
                                                                <div key={key} className="flex gap-2">
                                                                    <span className="font-medium">{key}:</span>
                                                                    <span>{String(value)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {hasMore && (
                                <div className="flex justify-center pt-4">
                                    <Button variant="outline" onClick={loadMore} disabled={loading}>
                                        {loading ? "Loading..." : "Load More"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Skeleton loader for activities
function ActivitySkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, dateIndex) => (
                <div key={dateIndex} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-7 rounded-full" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="space-y-4 pl-9">
                        {Array.from({ length: 3 }).map((_, activityIndex) => (
                            <div key={activityIndex} className="flex gap-4">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex items-center gap-1">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}