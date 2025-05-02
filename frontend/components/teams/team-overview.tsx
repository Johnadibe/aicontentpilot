"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, ImageIcon, CheckCircle2, MessageSquare, PlusCircle } from "lucide-react"
import { TeamAnnouncements } from "@/components/teams/team-announcements"

interface TeamOverviewProps {
  team: any
}
interface TeamMember {
  id: string;
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  role: string;
}

export function TeamOverview({ team }: TeamOverviewProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="mt-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="goals">Goals & Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{team.members.length}</div>
                <p className="text-xs text-muted-foreground">Active collaboration</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Items</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+3 in the last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 in the last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">3 due this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your team's recent content activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: "John Doe",
                      action: "created a new blog post",
                      item: "10 Tips for Better SEO",
                      time: "2 hours ago",
                      avatar: "/placeholder.svg?key=neyxe",
                    },
                    {
                      user: "Jane Smith",
                      action: "updated",
                      item: "Q2 Marketing Strategy",
                      time: "Yesterday",
                      avatar: "/placeholder.svg?key=hm996",
                    },
                    {
                      user: "Mike Johnson",
                      action: "commented on",
                      item: "Product Launch Email",
                      time: "2 days ago",
                      avatar: "/placeholder.svg?key=z17pz",
                    },
                    {
                      user: "Sarah Williams",
                      action: "generated an image for",
                      item: "Summer Campaign",
                      time: "3 days ago",
                      avatar: "/placeholder.svg?key=bntbh",
                    },
                    {
                      user: "David Brown",
                      action: "completed task",
                      item: "Review Homepage Copy",
                      time: "4 days ago",
                      avatar: "/placeholder.svg?key=pr1en",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium text-muted-foreground">"{activity.item}"</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teams/${team.id}/activity`}>View All Activity</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks due soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Review Q2 Content Calendar",
                      dueDate: "Tomorrow",
                      priority: "High",
                      assignee: "John Doe",
                      avatar: "/placeholder.svg?key=5s8f8",
                    },
                    {
                      title: "Finalize Blog Post Draft",
                      dueDate: "In 2 days",
                      priority: "Medium",
                      assignee: "Jane Smith",
                      avatar: "/placeholder.svg?key=zn6bx",
                    },
                    {
                      title: "Create Social Media Graphics",
                      dueDate: "Next week",
                      priority: "Medium",
                      assignee: "Mike Johnson",
                      avatar: "/placeholder.svg?key=9p2p5",
                    },
                    {
                      title: "Update Product Descriptions",
                      dueDate: "Next week",
                      priority: "Low",
                      assignee: "Sarah Williams",
                      avatar: "/placeholder.svg?key=k0yx3",
                    },
                  ].map((task, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div
                          className={`h-2 w-2 mt-1.5 rounded-full ${task.priority === "High"
                              ? "bg-red-500"
                              : task.priority === "Medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={task.avatar || "/placeholder.svg"} alt={task.assignee} />
                                <AvatarFallback className="text-[8px]">
                                  {task.assignee
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-xs text-muted-foreground">{task.assignee}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/teams/${team.id}/tasks`}>View All Tasks</Link>
                </Button>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Team Workspaces</CardTitle>
                <CardDescription>Access your team's workspaces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Marketing", description: "Marketing campaigns and content", count: 12 },
                    { name: "Product", description: "Product descriptions and materials", count: 8 },
                    { name: "Social Media", description: "Social media content and graphics", count: 15 },
                  ].map((workspace, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium">{workspace.name}</p>
                        <p className="text-xs text-muted-foreground">{workspace.description}</p>
                      </div>
                      <Badge variant="outline">{workspace.count} items</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/teams/${team.id}/workspaces`}>Manage Workspaces</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
                <CardDescription>Latest feedback and discussions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: "Jane Smith",
                      comment: "I think we should add more examples to this section.",
                      content: "Q2 Marketing Strategy",
                      time: "2 hours ago",
                      avatar: "/placeholder.svg?key=vfw4j",
                    },
                    {
                      user: "Mike Johnson",
                      comment: "The tone feels too formal. Can we make it more conversational?",
                      content: "Product Launch Email",
                      time: "Yesterday",
                      avatar: "/placeholder.svg?key=syf2n",
                    },
                    {
                      user: "Sarah Williams",
                      comment: "Love the new design direction!",
                      content: "Website Redesign",
                      time: "2 days ago",
                      avatar: "/placeholder.svg?key=vidxc",
                    },
                  ].map((comment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                          <AvatarFallback>
                            {comment.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{comment.user}</p>
                          <p className="text-xs text-muted-foreground">on {comment.content}</p>
                        </div>
                      </div>
                      <p className="text-sm">{comment.comment}</p>
                      <p className="text-xs text-muted-foreground">{comment.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View All Comments
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Active team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.members.map((member: TeamMember) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={member.user.image || "/placeholder.svg"} alt={member.user.name} />
                          <AvatarFallback>{member.user.name?.charAt(0) || member.user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.user.name}</p>
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          member.role === "OWNER" ? "default" : member.role === "ADMIN" ? "secondary" : "outline"
                        }
                      >
                        {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/dashboard/teams/${team.id}/members`}>Manage Members</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <TeamAnnouncements team={team} />
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Goals</CardTitle>
                <CardDescription>Track progress towards team objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      title: "Q2 Content Production",
                      description: "Create 20 pieces of content by end of Q2",
                      current: 12,
                      target: 20,
                      dueDate: "June 30, 2023",
                    },
                    {
                      title: "Social Media Growth",
                      description: "Increase engagement by 25%",
                      current: 15,
                      target: 25,
                      dueDate: "Ongoing",
                    },
                    {
                      title: "Website Traffic",
                      description: "Drive 10,000 new visitors through content",
                      current: 6240,
                      target: 10000,
                      dueDate: "December 31, 2023",
                    },
                  ].map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{Math.round((goal.current / goal.target) * 100)}%</p>
                          <p className="text-xs text-muted-foreground">Due: {goal.dueDate}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={(goal.current / goal.target) * 100} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {goal.current} / {goal.target}
                          </span>
                          <span>{goal.target - goal.current} remaining</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Goal
                </Button>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Production</CardTitle>
                  <CardDescription>Content created by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Blog Posts", count: 8, target: 12, color: "bg-blue-500" },
                      { type: "Social Media", count: 15, target: 20, color: "bg-purple-500" },
                      { type: "Email Campaigns", count: 4, target: 6, color: "bg-green-500" },
                      { type: "Product Descriptions", count: 10, target: 15, color: "bg-yellow-500" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${item.color}`} />
                            <span className="text-sm">{item.type}</span>
                          </div>
                          <span className="text-sm">
                            {item.count} / {item.target}
                          </span>
                        </div>
                        <Progress value={(item.count / item.target) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Productivity</CardTitle>
                  <CardDescription>Content created per week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-end gap-2">
                    {[4, 7, 5, 9, 6, 8, 10, 12].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-primary rounded-sm" style={{ height: `${(value / 12) * 100}%` }} />
                        <span className="text-xs">{`W${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
