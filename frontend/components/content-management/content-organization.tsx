"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Folder, FolderPlus, Tag, X, Edit2, Trash2 } from "lucide-react"

type FolderType = {
  id: string
  name: string
  parentId: string | null
  contentCount: number
}

type TagType = {
  id: string
  name: string
  color: string
  contentCount: number
}

export function ContentOrganization() {
  const [folders, setFolders] = useState<FolderType[]>([
    { id: "1", name: "Blog Posts", parentId: null, contentCount: 12 },
    { id: "2", name: "Social Media", parentId: null, contentCount: 8 },
    { id: "3", name: "Email Campaigns", parentId: null, contentCount: 5 },
    { id: "4", name: "Product Descriptions", parentId: null, contentCount: 7 },
    { id: "5", name: "SEO Content", parentId: null, contentCount: 3 },
    { id: "6", name: "Summer Campaign", parentId: "3", contentCount: 2 },
    { id: "7", name: "Winter Campaign", parentId: "3", contentCount: 3 },
  ])

  const [tags, setTags] = useState<TagType[]>([
    { id: "1", name: "marketing", color: "bg-blue-500", contentCount: 15 },
    { id: "2", name: "seo", color: "bg-green-500", contentCount: 8 },
    { id: "3", name: "product", color: "bg-yellow-500", contentCount: 10 },
    { id: "4", name: "promotion", color: "bg-purple-500", contentCount: 6 },
    { id: "5", name: "social media", color: "bg-pink-500", contentCount: 12 },
    { id: "6", name: "email", color: "bg-orange-500", contentCount: 5 },
  ])

  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("bg-blue-500")

  const rootFolders = folders.filter((folder) => folder.parentId === null)

  const getChildFolders = (parentId: string) => {
    return folders.filter((folder) => folder.parentId === parentId)
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderType = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        parentId: newFolderParent,
        contentCount: 0,
      }
      setFolders([...folders, newFolder])
      setNewFolderName("")
      setNewFolderParent(null)
      setNewFolderDialogOpen(false)
    }
  }

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag: TagType = {
        id: `tag-${Date.now()}`,
        name: newTagName.toLowerCase(),
        color: newTagColor,
        contentCount: 0,
      }
      setTags([...tags, newTag])
      setNewTagName("")
      setNewTagDialogOpen(false)
    }
  }

  const handleDeleteFolder = (id: string) => {
    // In a real app, you would want to confirm this action
    // and handle moving content to another folder
    setFolders(folders.filter((folder) => folder.id !== id && folder.parentId !== id))
  }

  const handleDeleteTag = (id: string) => {
    // In a real app, you would want to confirm this action
    // and handle removing the tag from content
    setTags(tags.filter((tag) => tag.id !== id))
  }

  const tagColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-teal-500",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Folders</CardTitle>
          <Button size="sm" onClick={() => setNewFolderDialogOpen(true)}>
            <FolderPlus className="h-4 w-4 mr-1" />
            New Folder
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rootFolders.map((folder) => (
              <div key={folder.id} className="space-y-2">
                <div className="flex items-center justify-between group">
                  <div className="flex items-center">
                    <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{folder.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {folder.contentCount}
                    </Badge>
                  </div>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleDeleteFolder(folder.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {getChildFolders(folder.id).map((childFolder) => (
                  <div key={childFolder.id} className="pl-6 flex items-center justify-between group">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{childFolder.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {childFolder.contentCount}
                      </Badge>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => handleDeleteFolder(childFolder.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {rootFolders.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No folders created yet</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tags</CardTitle>
          <Button size="sm" onClick={() => setNewTagDialogOpen(true)}>
            <Tag className="h-4 w-4 mr-1" />
            New Tag
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center bg-muted rounded-md pl-2 pr-1 py-1 group">
                <div className={`h-2 w-2 rounded-full ${tag.color} mr-1`} />
                <span className="text-sm">{tag.name}</span>
                <Badge variant="outline" className="ml-1 text-xs">
                  {tag.contentCount}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 text-destructive"
                  onClick={() => handleDeleteTag(tag.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {tags.length === 0 && (
              <div className="text-center py-4 w-full text-muted-foreground">No tags created yet</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for your new folder.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="parentFolder" className="text-sm font-medium">
                Parent Folder (Optional)
              </label>
              <select
                id="parentFolder"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newFolderParent || ""}
                onChange={(e) => setNewFolderParent(e.target.value || null)}
              >
                <option value="">None (Root level)</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={newTagDialogOpen} onOpenChange={setNewTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>Enter a name and select a color for your new tag.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="tagName" className="text-sm font-medium">
                Tag Name
              </label>
              <Input
                id="tagName"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tag Color</label>
              <div className="flex flex-wrap gap-2">
                {tagColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-6 w-6 rounded-full ${color} ${
                      newTagColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag}>Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
