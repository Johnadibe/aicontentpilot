"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Grid2X2,
  List,
  MoreHorizontal,
  Search,
  Filter,
  FileText,
  ImageIcon,
  Calendar,
  Tag,
  Folder,
  Download,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { ContentListSkeleton } from "@/components/skeletons/content-list-skeleton"

type ContentItem = {
  id: string
  title: string
  type: "blog" | "social" | "email" | "ad" | "product" | "seo"
  status: "draft" | "published" | "scheduled"
  createdAt: string
  updatedAt: string
  tags: string[]
  folder?: string
}

export function ContentLibrary() {
  const router = useRouter()
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState<ContentItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<ContentItem | null>(null)

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockData: ContentItem[] = [
      {
        id: "1",
        title: "How to Improve Your SEO Strategy in 2023",
        type: "blog",
        status: "published",
        createdAt: "2023-05-15T10:30:00Z",
        updatedAt: "2023-05-16T14:20:00Z",
        tags: ["seo", "marketing", "strategy"],
      },
      {
        id: "2",
        title: "Summer Sale Announcement",
        type: "email",
        status: "scheduled",
        createdAt: "2023-05-17T09:15:00Z",
        updatedAt: "2023-05-17T11:45:00Z",
        tags: ["promotion", "sale"],
        folder: "Campaigns",
      },
      {
        id: "3",
        title: "New Product Launch - Eco-friendly Water Bottle",
        type: "product",
        status: "draft",
        createdAt: "2023-05-18T16:20:00Z",
        updatedAt: "2023-05-18T17:30:00Z",
        tags: ["product", "eco-friendly"],
        folder: "Products",
      },
      {
        id: "4",
        title: "Instagram Post for World Environment Day",
        type: "social",
        status: "scheduled",
        createdAt: "2023-05-19T13:10:00Z",
        updatedAt: "2023-05-19T15:25:00Z",
        tags: ["social media", "environment"],
        folder: "Social Media",
      },
      {
        id: "5",
        title: "Google Ads Copy for Summer Collection",
        type: "ad",
        status: "published",
        createdAt: "2023-05-20T11:05:00Z",
        updatedAt: "2023-05-21T09:15:00Z",
        tags: ["ads", "summer", "collection"],
        folder: "Campaigns",
      },
      {
        id: "6",
        title: "Meta Description Optimization for Product Pages",
        type: "seo",
        status: "draft",
        createdAt: "2023-05-22T14:30:00Z",
        updatedAt: "2023-05-22T16:45:00Z",
        tags: ["seo", "meta", "optimization"],
      },
    ]

    setTimeout(() => {
      setContent(mockData)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and sort content
  const filteredContent = content
    .filter((item) => {
      // Search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Type filter
      if (filterType && item.type !== filterType) {
        return false
      }

      // Status filter
      if (filterStatus && item.status !== filterStatus) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected field
      const aValue = a[sortBy as keyof ContentItem]
      const bValue = b[sortBy as keyof ContentItem]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredContent.map((item) => item.id))
    }
  }

  const handleDelete = () => {
    // In a real app, this would call an API to delete the selected items
    setContent((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/content/${id}`)
  }

  const handlePreview = (item: ContentItem) => {
    setPreviewContent(item)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Published
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-500">
            <Clock className="mr-1 h-3 w-3" /> Scheduled
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-yellow-500">
            <AlertCircle className="mr-1 h-3 w-3" /> Draft
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
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

  if (isLoading) {
    return <ContentListSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
            <Grid2X2 className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilterType(null)}>All Types</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("blog")}>Blog Posts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("social")}>Social Media</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("email")}>Email Copy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("ad")}>Ad Copy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("product")}>Product Descriptions</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("seo")}>SEO Content</DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("draft")}>Drafts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("published")}>Published</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>Scheduled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="updatedAt">Updated</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Tag className="mr-1 h-4 w-4" />
              Tag
            </Button>
            <Button variant="outline" size="sm">
              <Folder className="mr-1 h-4 w-4" />
              Move
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                    {getTypeIcon(item.type)}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <CardTitle className="text-lg mt-2 line-clamp-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {item.folder && (
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Folder className="h-3 w-3 mr-1" />
                    {item.folder}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handlePreview(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredContent.length > 0 && selectedItems.length === filteredContent.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.title}</div>
                    {item.folder && (
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Folder className="h-3 w-3 mr-1" />
                        {item.folder}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getTypeIcon(item.type)}
                      <span className="ml-2 capitalize">{item.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handlePreview(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredContent.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No content found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery || filterType || filterStatus
              ? "Try adjusting your search or filters"
              : "Create your first content piece to get started"}
          </p>
          {(searchQuery || filterType || filterStatus) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setFilterType(null)
                setFilterStatus(null)
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      <Dialog open={!!previewContent} onOpenChange={(open) => !open && setPreviewContent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewContent?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                {previewContent && getTypeIcon(previewContent.type)}
                <span className="capitalize">{previewContent?.type}</span>
                <span className="mx-2">•</span>
                {previewContent && getStatusBadge(previewContent.status)}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-muted-foreground">
              This is a preview of the content. In a real application, the actual content would be displayed here.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies,
                nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
              </p>
              <p className="mt-2">
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum
                tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {previewContent?.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <div>Created: {previewContent && new Date(previewContent.createdAt).toLocaleString()}</div>
              <div>Last updated: {previewContent && new Date(previewContent.updatedAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewContent(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (previewContent) {
                  handleEdit(previewContent.id)
                  setPreviewContent(null)
                }
              }}
            >
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
