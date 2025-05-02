"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Save, ArrowLeft, Calendar, Download, History, X, Plus, Sparkles } from "lucide-react"

type ContentType = "blog" | "social" | "email" | "ad" | "product" | "seo"
type ContentStatus = "draft" | "published" | "scheduled"

interface ContentData {
  id: string
  title: string
  content: string
  type: ContentType
  status: ContentStatus
  tags: string[]
  folder?: string
  createdAt: string
  updatedAt: string
  versions: {
    id: string
    createdAt: string
    note: string
  }[]
  comments: {
    id: string
    text: string
    createdAt: string
    user: string
  }[]
}

export function ContentEditor({ contentId }: { contentId?: string }) {
  const router = useRouter()
  const isNewContent = !contentId

  // Mock data - in a real app, this would come from an API
  const [content, setContent] = useState<ContentData>({
    id: contentId || "new",
    title: contentId ? "How to Improve Your SEO Strategy in 2023" : "",
    content: contentId
      ? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante."
      : "",
    type: contentId ? "blog" : "blog",
    status: contentId ? "draft" : "draft",
    tags: contentId ? ["seo", "marketing", "strategy"] : [],
    folder: contentId ? "Blog Posts" : undefined,
    createdAt: contentId ? "2023-05-15T10:30:00Z" : new Date().toISOString(),
    updatedAt: contentId ? "2023-05-16T14:20:00Z" : new Date().toISOString(),
    versions: contentId
      ? [
          { id: "v2", createdAt: "2023-05-16T14:20:00Z", note: "Updated introduction and added more examples" },
          { id: "v1", createdAt: "2023-05-15T10:30:00Z", note: "Initial draft" },
        ]
      : [],
    comments: contentId
      ? [
          {
            id: "c1",
            text: "The introduction needs more context about the current SEO landscape.",
            createdAt: "2023-05-15T11:45:00Z",
            user: "Jane Smith",
          },
          {
            id: "c2",
            text: "Great points about backlink strategy in the third paragraph.",
            createdAt: "2023-05-16T09:30:00Z",
            user: "John Doe",
          },
        ]
      : [],
  })

  const [availableTags] = useState(["marketing", "seo", "strategy", "social media", "email", "product", "promotion"])

  const [availableFolders] = useState([
    "Blog Posts",
    "Social Media",
    "Email Campaigns",
    "Product Descriptions",
    "SEO Content",
  ])

  const [newTag, setNewTag] = useState("")
  const [newComment, setNewComment] = useState("")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState("docx")
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiSuggestion, setAiSuggestion] = useState("")

  const handleSave = () => {
    // In a real app, this would call an API to save the content
    setContent({
      ...content,
      updatedAt: new Date().toISOString(),
    })

    if (isNewContent) {
      // Navigate to the edit page for the new content
      router.push(`/dashboard/content/1`)
    }
  }

  const handleAddTag = () => {
    if (newTag && !content.tags.includes(newTag)) {
      setContent({
        ...content,
        tags: [...content.tags, newTag],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setContent({
      ...content,
      tags: content.tags.filter((t) => t !== tag),
    })
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `c${content.comments.length + 1}`,
        text: newComment,
        createdAt: new Date().toISOString(),
        user: "Current User",
      }

      setContent({
        ...content,
        comments: [comment, ...content.comments],
      })

      setNewComment("")
    }
  }

  const handleSchedule = () => {
    if (scheduledDate && scheduledTime) {
      setContent({
        ...content,
        status: "scheduled",
      })
      setShowScheduleDialog(false)
    }
  }

  const handleExport = () => {
    // In a real app, this would trigger a download of the content in the selected format
    setShowExportDialog(false)
  }

  const handleAISuggestion = () => {
    // In a real app, this would call an AI API to get suggestions
    setAiSuggestion(
      "Consider adding more specific examples of successful SEO strategies. Also, the section on backlinks could be expanded with case studies showing measurable results.",
    )
  }

  const handleApplyAISuggestion = () => {
    // In a real app, this would modify the content based on the AI suggestion
    setContent({
      ...content,
      content: content.content + "\n\n" + aiSuggestion,
    })
    setShowAIDialog(false)
    setAiSuggestion("")
    setAiPrompt("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline" onClick={() => setShowVersionHistory(true)}>
            <History className="h-4 w-4 mr-2" />
            History
          </Button>

          <Button variant="outline" onClick={() => setShowScheduleDialog(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>

          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save {content.status === "draft" ? "Draft" : ""}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter content title"
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <div className="relative">
                  <Textarea
                    id="content"
                    placeholder="Write your content here..."
                    className="min-h-[300px]"
                    value={content.content}
                    onChange={(e) => setContent({ ...content, content: e.target.value })}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => setShowAIDialog(true)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Assist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="comments">
            <TabsList>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="versions">Version History</TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleAddComment}>Add</Button>
                  </div>

                  <div className="space-y-4">
                    {content.comments.map((comment) => (
                      <div key={comment.id} className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{comment.user}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1">{comment.text}</div>
                      </div>
                    ))}

                    {content.comments.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No comments yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="versions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Version History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.versions.map((version, index) => (
                      <div key={version.id} className="flex items-start gap-4 p-3 bg-muted rounded-md">
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div className="font-medium">
                              {index === 0 ? "Current Version" : `Version ${content.versions.length - index}`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(version.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-1 text-sm">{version.note}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Restore
                        </Button>
                      </div>
                    ))}

                    {content.versions.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No version history available</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="contentType" className="text-sm font-medium">
                  Content Type
                </label>
                <Select
                  value={content.type}
                  onValueChange={(value) => setContent({ ...content, type: value as ContentType })}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">Blog Post</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email Copy</SelectItem>
                    <SelectItem value="ad">Ad Copy</SelectItem>
                    <SelectItem value="product">Product Description</SelectItem>
                    <SelectItem value="seo">SEO Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contentStatus" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={content.status}
                  onValueChange={(value) => setContent({ ...content, status: value as ContentStatus })}
                >
                  <SelectTrigger id="contentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contentFolder" className="text-sm font-medium">
                  Folder
                </label>
                <Select
                  value={content.folder || ""}
                  onValueChange={(value) => setContent({ ...content, folder: value || undefined })}
                >
                  <SelectTrigger id="contentFolder">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableFolders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        className="ml-1 hover:text-destructive"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <Select value={newTag} onValueChange={setNewTag}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags
                        .filter((tag) => !content.tags.includes(tag))
                        .map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddTag} disabled={!newTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t px-6 py-4">
              <div className="text-xs text-muted-foreground">
                Created: {new Date(content.createdAt).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(content.updatedAt).toLocaleString()}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>View and restore previous versions of your content.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {content.versions.map((version, index) => (
              <div key={version.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {index === 0 ? "Current Version" : `Version ${content.versions.length - index}`}
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(version.createdAt).toLocaleString()}</div>
                    <div className="mt-1">{version.note}</div>
                  </div>
                  <Button variant="outline">Restore This Version</Button>
                </div>

                {index < content.versions.length - 1 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm font-medium">Changes from previous version:</div>
                    <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                      <div className="text-green-600">+ Added new section on backlink strategies</div>
                      <div className="text-red-600">- Removed outdated information about meta keywords</div>
                      <div className="text-blue-600">~ Modified introduction paragraph</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Publication</DialogTitle>
            <DialogDescription>Choose when you want this content to be published.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="scheduleDate" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="scheduleDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="scheduleTime" className="text-sm font-medium">
                Time
              </label>
              <Input
                id="scheduleTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={!scheduledDate || !scheduledTime}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Content</DialogTitle>
            <DialogDescription>Choose a format to export your content.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="exportFormat" className="text-sm font-medium">
                Export Format
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">Microsoft Word (.docx)</SelectItem>
                  <SelectItem value="pdf">PDF Document (.pdf)</SelectItem>
                  <SelectItem value="html">HTML (.html)</SelectItem>
                  <SelectItem value="md">Markdown (.md)</SelectItem>
                  <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Export Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="includeMetadata" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="includeMetadata" className="text-sm">
                    Include metadata
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="includeComments" className="rounded border-gray-300" />
                  <label htmlFor="includeComments" className="text-sm">
                    Include comments
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="optimizeFormatting" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="optimizeFormatting" className="text-sm">
                    Optimize formatting for selected format
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Content Assistant</DialogTitle>
            <DialogDescription>Get AI-powered suggestions to improve your content.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="aiPrompt" className="text-sm font-medium">
                What would you like help with?
              </label>
              <Textarea
                id="aiPrompt"
                placeholder="e.g., Improve the introduction, suggest a better conclusion, make the tone more professional..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>

            <Button onClick={handleAISuggestion} disabled={!aiPrompt.trim()}>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Suggestion
            </Button>

            {aiSuggestion && (
              <div className="mt-4">
                <div className="text-sm font-medium">AI Suggestion:</div>
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">{aiSuggestion}</div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={handleApplyAISuggestion}>Apply Suggestion</Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAIDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
