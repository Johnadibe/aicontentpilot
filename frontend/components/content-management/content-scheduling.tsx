"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Plus, CalendarIcon, Check, X, AlertCircle, FileText, ImageIcon } from "lucide-react"

type ScheduledContent = {
  id: string
  title: string
  type: "blog" | "social" | "email" | "ad" | "product" | "seo"
  scheduledDate: Date
  status: "scheduled" | "published" | "failed"
  platform?: string
}

export function ContentScheduling() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([
    {
      id: "1",
      title: "10 Tips for Better SEO",
      type: "blog",
      scheduledDate: new Date(2023, 4, 15, 9, 0),
      status: "published",
      platform: "Website Blog",
    },
    {
      id: "2",
      title: "Summer Sale Announcement",
      type: "email",
      scheduledDate: new Date(2023, 4, 17, 10, 0),
      status: "scheduled",
      platform: "Email Campaign",
    },
    {
      id: "3",
      title: "New Product Launch",
      type: "social",
      scheduledDate: new Date(2023, 4, 18, 12, 0),
      status: "scheduled",
      platform: "Instagram",
    },
    {
      id: "4",
      title: "Holiday Promotion Ad",
      type: "ad",
      scheduledDate: new Date(2023, 4, 20, 15, 0),
      status: "failed",
      platform: "Facebook Ads",
    },
  ])

  const [availableContent] = useState([
    { id: "c1", title: "How to Improve Your SEO Strategy in 2023", type: "blog" },
    { id: "c2", title: "Summer Sale Announcement", type: "email" },
    { id: "c3", title: "New Product Launch - Eco-friendly Water Bottle", type: "product" },
    { id: "c4", title: "Instagram Post for World Environment Day", type: "social" },
    { id: "c5", title: "Google Ads Copy for Summer Collection", type: "ad" },
  ])

  const [availablePlatforms] = useState([
    { id: "p1", name: "Website Blog", types: ["blog", "seo"] },
    { id: "p2", name: "Instagram", types: ["social"] },
    { id: "p3", name: "Facebook", types: ["social"] },
    { id: "p4", name: "Twitter", types: ["social"] },
    { id: "p5", name: "Email Campaign", types: ["email"] },
    { id: "p6", name: "Google Ads", types: ["ad"] },
    { id: "p7", name: "Facebook Ads", types: ["ad"] },
    { id: "p8", name: "Online Store", types: ["product"] },
  ])

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8 // Start at 8 AM
    return `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? "AM" : "PM"}`
  })

  const handleAddSchedule = () => {
    if (date && selectedTimeSlot && selectedContent) {
      const content = availableContent.find((c) => c.id === selectedContent)
      if (!content) return

      const [hourStr, minuteStr] = selectedTimeSlot.split(":")
      const hour = Number.parseInt(hourStr) + (selectedTimeSlot.includes("PM") && hourStr !== "12" ? 12 : 0)
      const minute = Number.parseInt(minuteStr.split(" ")[0])

      const scheduledDate = new Date(date)
      scheduledDate.setHours(hour, minute)

      const newScheduledContent: ScheduledContent = {
        id: `sc-${Date.now()}`,
        title: content.title,
        type: content.type as any,
        scheduledDate,
        status: "scheduled",
        platform: selectedPlatform ? availablePlatforms.find((p) => p.id === selectedPlatform)?.name : undefined,
      }

      setScheduledContent([...scheduledContent, newScheduledContent])
      setShowAddDialog(false)
      setSelectedTimeSlot(null)
      setSelectedContent(null)
      setSelectedPlatform(null)
    }
  }

  const getContentForDate = (date: Date) => {
    return scheduledContent.filter((content) => {
      const contentDate = new Date(content.scheduledDate)
      return (
        contentDate.getDate() === date.getDate() &&
        contentDate.getMonth() === date.getMonth() &&
        contentDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <Check className="h-4 w-4 text-green-500" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "social":
        return <ImageIcon className="h-4 w-4 text-purple-500" />
      case "email":
        return <FileText className="h-4 w-4 text-green-500" />
      case "ad":
        return <FileText className="h-4 w-4 text-red-500" />
      case "product":
        return <FileText className="h-4 w-4 text-orange-500" />
      case "seo":
        return <FileText className="h-4 w-4 text-teal-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const selectedDateContent = date ? getContentForDate(date) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Content Calendar</CardTitle>
              <Button size="sm" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Schedule Content
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              components={{
                DayContent: (props) => {
                  const dateContent = getContentForDate(props.date)
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div>{props.date.getDate()}</div>
                      {dateContent.length > 0 && (
                        <div className="absolute bottom-0 flex gap-0.5 justify-center">
                          {dateContent.length <= 3 ? (
                            dateContent.map((content, i) => (
                              <div
                                key={i}
                                className={`h-1 w-1 rounded-full ${content.status === "published"
                                    ? "bg-green-500"
                                    : content.status === "scheduled"
                                      ? "bg-blue-500"
                                      : "bg-red-500"
                                  }`}
                              />
                            ))
                          ) : (
                            <>
                              <div className="h-1 w-1 rounded-full bg-blue-500" />
                              <div className="h-1 w-1 rounded-full bg-blue-500" />
                              <Badge className="h-3 w-3 p-0 flex items-center justify-center text-[8px]">
                                {dateContent.length}
                              </Badge>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>
              {date ? (
                <span>
                  Schedule for {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </span>
              ) : (
                "Select a date"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateContent.length > 0 ? (
              <div className="space-y-4">
                <Tabs defaultValue="list">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list" className="pt-4">
                    <div className="space-y-3">
                      {selectedDateContent.map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                              {getTypeIcon(content.type)}
                            </div>
                            <div>
                              <div className="font-medium">{content.title}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {content.scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                {content.platform && (
                                  <>
                                    <span className="mx-1">•</span>
                                    {content.platform}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                content.status === "published"
                                  ? "default"
                                  : content.status === "scheduled"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="flex items-center gap-1"
                            >
                              {getStatusIcon(content.status)}
                              <span className="capitalize">{content.status}</span>
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="pt-4">
                    <div className="relative min-h-[300px] border-l border-muted ml-4">
                      {selectedDateContent.map((content) => (
                        <div key={content.id} className="mb-6 ml-6 relative">
                          <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border border-background bg-background flex items-center justify-center">
                            {getStatusIcon(content.status)}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {content.scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(content.type)}
                              <span className="font-medium">{content.title}</span>
                            </div>
                            {content.platform && (
                              <div className="text-xs text-muted-foreground mt-1">Platform: {content.platform}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No content scheduled</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {date ? "No content is scheduled for this date." : "Select a date to view scheduled content."}
                </p>
                {date && (
                  <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Schedule Content
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Content</DialogTitle>
            <DialogDescription>Select content and choose when to publish it.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Select value={selectedContent || ""} onValueChange={setSelectedContent}>
                <SelectTrigger id="content">
                  <SelectValue placeholder="Select content" />
                </SelectTrigger>
                <SelectContent>
                  {availableContent.map((content) => (
                    <SelectItem key={content.id} value={content.id}>
                      <div className="flex items-center">
                        {getTypeIcon(content.type)}
                        <span className="ml-2">{content.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="platform" className="text-sm font-medium">
                Platform (Optional)
              </label>
              <Select value={selectedPlatform || ""} onValueChange={setSelectedPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {selectedContent ? (
                    availablePlatforms
                      .filter((platform) => {
                        const content = availableContent.find((c) => c.id === selectedContent)
                        return content && platform.types.includes(content.type)
                      })
                      .map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Select content first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <div className="border rounded-md p-3">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="timeSlot" className="text-sm font-medium">
                Time
              </label>
              <Select value={selectedTimeSlot || ""} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger id="timeSlot">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSchedule} disabled={!date || !selectedTimeSlot || !selectedContent}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
