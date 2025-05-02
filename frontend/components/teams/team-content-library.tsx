"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Folder,
  File,
  Search,
  Plus,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Download,
  FolderPlus,
  Eye,
  FileText,
  Mail,
  ImageIcon,
  FolderOpen,
  Clock,
  Users,
  Copy,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

interface TeamContentLibraryProps {
  team: {
    owner: {
      image: string | null;
      id: string;
      name: string | null;
      email: string | null;
    };
    members: Array<{
      user: {
        image: string | null;
        id: string;
        name: string | null;
        email: string | null;
      };
      permissions: any[]; // Define more specific type if needed
    }>;
    workspaces: any[]; // Define more specific type if needed
  };
  rootFolders: any[]; // Define more specific type if needed
}

// Mock data for demonstration
const mockFolders = [
  { id: "folder-1", name: "Blog Posts", itemCount: 12, parentId: null },
  { id: "folder-2", name: "Social Media", itemCount: 24, parentId: null },
  { id: "folder-3", name: "Email Campaigns", itemCount: 8, parentId: null },
  { id: "folder-4", name: "Ad Copy", itemCount: 15, parentId: null },
  { id: "folder-5", name: "Q1 Campaigns", itemCount: 5, parentId: "folder-2" },
  { id: "folder-6", name: "Q2 Campaigns", itemCount: 7, parentId: "folder-2" },
]

const mockContentItems = [
  {
    id: "content-1",
    title: "Q1 Marketing Strategy",
    type: "Document",
    content: "This is a comprehensive marketing strategy for Q1, focusing on product launches and customer retention.",
    createdBy: "John Doe",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-20T14:45:00Z",
    tags: ["marketing", "strategy", "Q1"],
    folderId: "folder-1",
  },
  {
    id: "content-2",
    title: "Product Launch Social Posts",
    type: "Social Media",
    content: "A series of social media posts for the upcoming product launch, scheduled for different platforms.",
    createdBy: "Jane Smith",
    createdAt: "2023-02-05T09:15:00Z",
    updatedAt: "2023-02-10T11:20:00Z",
    tags: ["product", "launch", "social"],
    folderId: "folder-2",
  },
  {
    id: "content-3",
    title: "Customer Testimonial Email",
    type: "Email",
    content: "Email template featuring customer testimonials to be sent to our subscriber list.",
    createdBy: "Alex Johnson",
    createdAt: "2023-02-18T13:45:00Z",
    updatedAt: "2023-02-18T13:45:00Z",
    tags: ["email", "testimonial"],
    folderId: "folder-3",
  },
  {
    id: "content-4",
    title: "SEO Blog Post Template",
    type: "Template",
    content:
      "A template for SEO-optimized blog posts with sections for keywords, meta descriptions, and content structure.",
    createdBy: "Sarah Williams",
    createdAt: "2023-03-01T16:30:00Z",
    updatedAt: "2023-03-05T10:15:00Z",
    tags: ["seo", "blog", "template"],
    folderId: "folder-1",
  },
  {
    id: "content-5",
    title: "Summer Sale Banner",
    type: "Image",
    content: "Banner image for the upcoming summer sale campaign.",
    createdBy: "Michael Brown",
    createdAt: "2023-03-10T11:20:00Z",
    updatedAt: "2023-03-12T09:45:00Z",
    tags: ["banner", "sale", "summer"],
    folderId: "folder-4",
  },
  {
    id: "content-6",
    title: "Weekly Newsletter Template",
    type: "Email",
    content: "Template for our weekly newsletter with sections for featured content, updates, and promotions.",
    createdBy: "Emily Davis",
    createdAt: "2023-03-15T14:30:00Z",
    updatedAt: "2023-03-18T16:15:00Z",
    tags: ["newsletter", "email", "weekly"],
    folderId: "folder-3",
  },
]

const mockTeamMembers = [
  { id: "user-1", name: "John Doe", email: "john@example.com", avatar: "/stylized-jd-initials.png" },
  { id: "user-2", name: "Jane Smith", email: "jane@example.com", avatar: "/javascript-code.png" },
  { id: "user-3", name: "Alex Johnson", email: "alex@example.com", avatar: "/abstract-letter-aj.png" },
  { id: "user-4", name: "Sarah Williams", email: "sarah@example.com", avatar: "/stylized-sw.png" },
  { id: "user-5", name: "Michael Brown", email: "michael@example.com", avatar: "/monogram-mb.png" },
]

type ContentItem = (typeof mockContentItems)[0]
type FolderItem = (typeof mockFolders)[0]
type TeamMember = (typeof mockTeamMembers)[0]

interface ContentTypeIcon {
  [key: string]: React.ReactNode
}

const contentTypeIcons: ContentTypeIcon = {
  Document: <FileText className="h-4 w-4" />,
  Email: <Mail className="h-4 w-4" />,
  "Social Media": <Users className="h-4 w-4" />,
  Template: <Copy className="h-4 w-4" />,
  Image: <ImageIcon className="h-4 w-4" />,
}

export const TeamContentLibrary: React.FC<TeamContentLibraryProps> = ({ team, rootFolders }) => {
  const router = useRouter()
  const params = useParams()
  const teamId = params?.id as string
  const dragItem = useRef<any>(null)
  const dragOverItem = useRef<any>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [sortField, setSortField] = useState("updatedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [contentViewDialogOpen, setContentViewDialogOpen] = useState(false)
  const [editFolderDialogOpen, setEditFolderDialogOpen] = useState(false)
  const [folderToEdit, setFolderToEdit] = useState<FolderItem | null>(null)
  const [createContentDialogOpen, setCreateContentDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [newContent, setNewContent] = useState({
    title: "",
    type: "Document",
    content: "",
    tags: "",
  })

  // Fetch folders and content
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // const foldersResponse = await fetch(`/api/teams/${teamId}/folders`)
        // const foldersData = await foldersResponse.json()
        // setFolders(foldersData)

        // const contentResponse = await fetch(`/api/teams/${teamId}/content${currentFolder ? `?folderId=${currentFolder}` : ''}`)
        // const contentData = await contentResponse.json()
        // setContentItems(contentData)

        // Using mock data for demonstration
        setFolders(mockFolders)
        setContentItems(mockContentItems)

        // Simulate API loading
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching team content:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [teamId, currentFolder])

  // Update breadcrumbs when folder changes
  useEffect(() => {
    if (currentFolder) {
      const breadcrumbsArray = []
      let currentFolderId = currentFolder

      while (currentFolderId) {
        const folder = folders.find((f) => f.id === currentFolderId)
        if (folder) {
          breadcrumbsArray.unshift({ id: folder.id, name: folder.name })
          currentFolderId = folder.parentId || "root"
        } else {
          currentFolderId = "root"
        }
      }

      setBreadcrumbs(breadcrumbsArray)
    } else {
      setBreadcrumbs([])
    }
  }, [currentFolder, folders])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleBackToRoot = () => {
    setCurrentFolder(null)
  }

  const handleBreadcrumbClick = (folderId: string) => {
    setCurrentFolder(folderId)
  }

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleContentTypeFilter = (type: string | null) => {
    setSelectedContentType(type)
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/teams/${teamId}/folders`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: newFolderName, parentId: currentFolder })
      // })
      // const newFolder = await response.json()

      // Mock implementation
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        itemCount: 0,
        parentId: currentFolder,
      }

      setFolders([...folders, newFolder])
      setNewFolderName("")
      setNewFolderDialogOpen(false)
      toast({
        title: "Folder created",
        description: `Folder "${newFolderName}" has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating folder:", error)
      toast({
        title: "Error",
        description: "Failed to create folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditFolder = () => {
    if (!folderToEdit || !newFolderName.trim()) return

    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/teams/${teamId}/folders/${folderToEdit.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: newFolderName })
      // })

      // Mock implementation
      const updatedFolders = folders.map((folder) =>
        folder.id === folderToEdit.id ? { ...folder, name: newFolderName } : folder,
      )
      setFolders(updatedFolders)

      // Update breadcrumbs if the edited folder is in the current path
      if (breadcrumbs.some((crumb) => crumb.id === folderToEdit.id)) {
        setBreadcrumbs(
          breadcrumbs.map((crumb) => (crumb.id === folderToEdit.id ? { ...crumb, name: newFolderName } : crumb)),
        )
      }

      setEditFolderDialogOpen(false)
      setFolderToEdit(null)
      setNewFolderName("")
      toast({
        title: "Folder updated",
        description: `Folder has been renamed to "${newFolderName}".`,
      })
    } catch (error) {
      console.error("Error updating folder:", error)
      toast({
        title: "Error",
        description: "Failed to update folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/teams/${teamId}/folders/${folderId}`, {
      //   method: 'DELETE'
      // })

      // Mock implementation
      setFolders(folders.filter((folder) => folder.id !== folderId))

      // If we're in the folder that was deleted, go back to root
      if (currentFolder === folderId) {
        setCurrentFolder(null)
      }

      toast({
        title: "Folder deleted",
        description: "The folder and its contents have been deleted.",
      })
    } catch (error) {
      console.error("Error deleting folder:", error)
      toast({
        title: "Error",
        description: "Failed to delete folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteContent = async (contentId: string) => {
    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/teams/${teamId}/content/${contentId}`, {
      //   method: 'DELETE'
      // })

      // Mock implementation
      setContentItems(contentItems.filter((item) => item.id !== contentId))
      toast({
        title: "Content deleted",
        description: "The content has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewContent = (content: ContentItem) => {
    setSelectedContent(content)
    setContentViewDialogOpen(true)
  }

  const handleCreateContent = async () => {
    if (!newContent.title.trim() || !newContent.content.trim()) return

    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/teams/${teamId}/content`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...newContent,
      //     tags: newContent.tags.split(',').map(tag => tag.trim()),
      //     folderId: currentFolder
      //   })
      // })
      // const createdContent = await response.json()

      // Mock implementation
      const createdContent = {
        id: `content-${Date.now()}`,
        title: newContent.title,
        type: newContent.type,
        content: newContent.content,
        tags: newContent.tags.split(",").map((tag) => tag.trim()),
        createdBy: "Current User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folderId: currentFolder || "",
      }

      setContentItems([...contentItems, createdContent])
      setNewContent({
        title: "",
        type: "Document",
        content: "",
        tags: "",
      })
      setCreateContentDialogOpen(false)
      toast({
        title: "Content created",
        description: `"${newContent.title}" has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating content:", error)
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareContent = () => {
    if (!selectedContent || selectedMembers.length === 0) return

    try {
      // In a real implementation, this would be an API call
      // await fetch(`/api/teams/${teamId}/content/${selectedContent.id}/share`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ memberIds: selectedMembers })
      // })

      // Mock implementation
      const memberNames = selectedMembers
        .map((id) => mockTeamMembers.find((member) => member.id === id)?.name)
        .filter(Boolean)
        .join(", ")

      setShareDialogOpen(false)
      setSelectedMembers([])
      toast({
        title: "Content shared",
        description: `"${selectedContent.title}" has been shared with ${memberNames}.`,
      })
    } catch (error) {
      console.error("Error sharing content:", error)
      toast({
        title: "Error",
        description: "Failed to share content. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, item: any, type: "folder" | "content") => {
    dragItem.current = { ...item, type }
  }

  const handleDragOver = (e: React.DragEvent, item: any, type: "folder" | "content") => {
    e.preventDefault()
    dragOverItem.current = { ...item, type }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    // Only allow dropping content into folders
    if (
      dragItem.current &&
      dragOverItem.current &&
      dragItem.current.type === "content" &&
      dragOverItem.current.type === "folder" &&
      dragItem.current.id !== dragOverItem.current.id
    ) {
      try {
        // In a real implementation, this would be an API call
        // await fetch(`/api/teams/${teamId}/content/${dragItem.current.id}/move`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ folderId: dragOverItem.current.id })
        // })

        // Mock implementation
        const updatedContentItems = contentItems.map((item) => {
          if (item.id === dragItem.current.id) {
            return { ...item, folderId: dragOverItem.current.id }
          }
          return item
        })

        setContentItems(updatedContentItems)
        toast({
          title: "Content moved",
          description: `"${dragItem.current.title}" has been moved to "${dragOverItem.current.name}".`,
        })
      } catch (error) {
        console.error("Error moving content:", error)
        toast({
          title: "Error",
          description: "Failed to move content. Please try again.",
          variant: "destructive",
        })
      }
    }

    dragItem.current = null
    dragOverItem.current = null
  }

  // Filter content items based on search query, content type, and current folder
  const filteredContentItems = contentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedContentType ? item.type === selectedContentType : true
    const matchesFolder = currentFolder ? item.folderId === currentFolder : true
    return matchesSearch && matchesType && matchesFolder
  })

  // Filter folders based on current folder
  const filteredFolders = folders.filter((folder) => folder.parentId === currentFolder)

  // Sort content items
  const sortedContentItems = [...filteredContentItems].sort((a, b) => {
    if (sortField === "title") {
      return sortDirection === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    } else if (sortField === "updatedAt") {
      return sortDirection === "asc"
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    } else if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    return 0
  })

  // Get unique content types for filter
  const contentTypes = Array.from(new Set(contentItems.map((item) => item.type)))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return <ContentLibrarySkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Library</h2>
          <p className="text-muted-foreground">Browse and manage your team's content library</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Enter a name for your new folder.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input
                  id="folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="My Folder"
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFolder}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={createContentDialogOpen} onOpenChange={setCreateContentDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
                <DialogDescription>Create a new content item in your team library.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="content-title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    placeholder="Enter title"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newContent.type}
                    onValueChange={(value) => setNewContent({ ...newContent, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Document">Document</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Template">Template</SelectItem>
                      <SelectItem value="Image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content-body" className="text-right pt-2">
                    Content
                  </Label>
                  <Textarea
                    id="content-body"
                    value={newContent.content}
                    onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                    placeholder="Enter content"
                    className="col-span-3 min-h-[150px]"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="content-tags"
                    value={newContent.tags}
                    onChange={(e) => setNewContent({ ...newContent, tags: e.target.value })}
                    placeholder="Enter tags separated by commas"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateContentDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContent}>Create Content</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center text-sm text-muted-foreground overflow-x-auto pb-2">
          <Button variant="link" className="p-0 h-auto font-normal" onClick={handleBackToRoot}>
            All Content
          </Button>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center">
              <span className="mx-2">/</span>
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => handleBreadcrumbClick(crumb.id)}>
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content..." className="pl-8" value={searchQuery} onChange={handleSearch} />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleContentTypeFilter(null)}>All Types</DropdownMenuItem>
              <DropdownMenuSeparator />
              {contentTypes.map((type) => (
                <DropdownMenuItem key={type} onClick={() => handleContentTypeFilter(type)}>
                  <div className="flex items-center gap-2">
                    {contentTypeIcons[type]}
                    {type}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortDirection === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleSortChange("title")}>By Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("updatedAt")}>By Last Updated</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("createdAt")}>By Created Date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Folders section */}
          {filteredFolders.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Folders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFolders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleFolderClick(folder.id)}
                    onDragOver={(e) => handleDragOver(e, folder, "folder")}
                    onDrop={handleDrop}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <FolderOpen className="h-8 w-8 text-blue-500 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{folder.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {folder.itemCount} {folder.itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setFolderToEdit(folder)
                              setNewFolderName(folder.name)
                              setEditFolderDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this folder and all its
                                  contents.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteFolder(folder.id)
                                  }}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Content items section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Content</h3>
            {sortedContentItems.length > 0 ? (
              <div className="grid gap-4">
                {sortedContentItems.map((item) => (
                  <ContentItemCard
                    key={item.id}
                    item={item}
                    onDelete={() => handleDeleteContent(item.id)}
                    onView={() => handleViewContent(item)}
                    onDragStart={(e) => handleDragStart(e, item, "content")}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <File className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No content found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? "Try a different search term" : "Create your first content item"}
                </p>
                <Button className="mt-4" onClick={() => setCreateContentDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="folders">
          {filteredFolders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFolders.map((folder) => (
                <Card
                  key={folder.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleFolderClick(folder.id)}
                  onDragOver={(e) => handleDragOver(e, folder, "folder")}
                  onDrop={handleDrop}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <FolderOpen className="h-8 w-8 text-blue-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{folder.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {folder.itemCount} {folder.itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setFolderToEdit(folder)
                            setNewFolderName(folder.name)
                            setEditFolderDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this folder and all its
                                contents.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFolder(folder.id)
                                }}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No folders found</h3>
              <p className="text-muted-foreground mt-1">Create a new folder to organize your content</p>
              <Button className="mt-4" onClick={() => setNewFolderDialogOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="content">
          {sortedContentItems.length > 0 ? (
            <div className="grid gap-4">
              {sortedContentItems.map((item) => (
                <ContentItemCard
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteContent(item.id)}
                  onView={() => handleViewContent(item)}
                  onDragStart={(e) => handleDragStart(e, item, "content")}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <File className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No content found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "Create your first content item"}
              </p>
              <Button className="mt-4" onClick={() => setCreateContentDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Folder Dialog */}
      <Dialog open={editFolderDialogOpen} onOpenChange={setEditFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Folder</DialogTitle>
            <DialogDescription>Enter a new name for this folder.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="edit-folder-name">Folder Name</Label>
            <Input
              id="edit-folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFolder}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content View Dialog */}
      <Dialog open={contentViewDialogOpen} onOpenChange={setContentViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedContent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedContent.type}</Badge>
                  <DialogTitle>{selectedContent.title}</DialogTitle>
                </div>
                <DialogDescription>
                  Created by {selectedContent.createdBy} on {formatDate(selectedContent.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {formatDate(selectedContent.updatedAt)}</span>
                  </div>
                  <div className="flex gap-1">
                    {selectedContent.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="whitespace-pre-wrap">{selectedContent.content}</div>
                </ScrollArea>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedContent(selectedContent)
                      setShareDialogOpen(true)
                      setContentViewDialogOpen(false)
                    }}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedContent.content)
                            toast({
                              title: "Content copied",
                              description: "Content has been copied to clipboard.",
                            })
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy content to clipboard</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this content.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleDeleteContent(selectedContent.id)
                            setContentViewDialogOpen(false)
                          }}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Content</DialogTitle>
            <DialogDescription>
              Share "{selectedContent?.title}" with team members or generate a shareable link.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label className="mb-2 block">Team Members</Label>
              <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMembers([...selectedMembers, member.id])
                        } else {
                          setSelectedMembers(selectedMembers.filter((id) => id !== member.id))
                        }
                      }}
                    />
                    <Label
                      htmlFor={`member-${member.id}`}
                      className="flex items-center gap-2 text-sm font-normal cursor-pointer flex-1"
                    >
                      <div
                        className="h-8 w-8 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${member.avatar})` }}
                      />
                      <div>
                        <p>{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Shareable Link</Label>
              <div className="flex gap-2">
                <Input readOnly value={`https://aicontentpilot.com/share/${selectedContent?.id}`} className="flex-1" />
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Switch id="public-link" />
                <Label htmlFor="public-link" className="text-sm font-normal">
                  Make link publicly accessible (no login required)
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShareContent} disabled={selectedMembers.length === 0}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ContentItemCardProps {
  item: ContentItem
  onDelete: () => void
  onView: () => void
  onDragStart: (e: React.DragEvent) => void
}

function ContentItemCard({ item, onDelete, onView, onDragStart }: ContentItemCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getContentTypeIcon = () => {
    switch (item.type) {
      case "Document":
        return <FileText className="h-4 w-4 mr-2" />
      case "Email":
        return <Mail className="h-4 w-4 mr-2" />
      case "Social Media":
        return <Users className="h-4 w-4 mr-2" />
      case "Template":
        return <Copy className="h-4 w-4 mr-2" />
      case "Image":
        return (<span className="h-4 w-4 mr-2">
          <ImageIcon />
        </span>
        );
      default:
        return <File className="h-4 w-4 mr-2" />
    }
  }

  return (
    <Card className="overflow-hidden" draggable onDragStart={onDragStart}>
      <CardContent className="p-0">
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getContentTypeIcon()}
                  {item.type}
                </Badge>
                <span className="text-xs text-muted-foreground">Updated {formatDate(item.updatedAt)}</span>
              </div>
              <h3 className="text-lg font-medium truncate">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Created by {item.createdBy} on {formatDate(item.createdAt)}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this content and remove it from the
                        team library.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ContentLibrarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}