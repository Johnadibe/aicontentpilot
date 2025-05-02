"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, ArrowLeftRight, RotateCcw, Clock, User, FileText, Eye } from "lucide-react"
import { format } from "date-fns"

type ContentVersion = {
  id: string
  versionNumber: number
  createdAt: string
  createdBy: string
  note: string
  isAutoSave: boolean
  content?: string
  changes?: {
    added: string[]
    removed: string[]
    modified: string[]
  }
}

type ContentVersionHistoryProps = {
  contentId: string
  versions?: ContentVersion[]
  isLoading?: boolean
  onRestoreVersion?: (versionId: string) => Promise<void>
  onFetchVersions?: () => Promise<void>
}

export function ContentVersionHistory({
  contentId,
  versions: initialVersions,
  isLoading = false,
  onRestoreVersion,
  onFetchVersions,
}: ContentVersionHistoryProps) {
  const [versions, setVersions] = useState<ContentVersion[]>(
    initialVersions || [
      {
        id: "v5",
        versionNumber: 5,
        createdAt: "2023-05-20T15:30:00Z",
        createdBy: "John Doe",
        note: "Final version with client feedback incorporated",
        isAutoSave: false,
        changes: {
          added: ["Added client testimonial section"],
          removed: [],
          modified: ["Updated conclusion paragraph", "Fixed typos in introduction"],
        },
      },
      {
        id: "v4",
        versionNumber: 4,
        createdAt: "2023-05-19T14:15:00Z",
        createdBy: "System",
        note: "Auto-saved version",
        isAutoSave: true,
        changes: {
          added: [],
          removed: [],
          modified: ["Minor edits to middle section"],
        },
      },
      {
        id: "v3",
        versionNumber: 3,
        createdAt: "2023-05-18T11:45:00Z",
        createdBy: "Jane Smith",
        note: "Added SEO optimizations and keywords",
        isAutoSave: false,
        changes: {
          added: ["Added meta description", "Added keyword section"],
          removed: [],
          modified: ["Restructured headings for better SEO"],
        },
      },
      {
        id: "v2",
        versionNumber: 2,
        createdAt: "2023-05-17T09:30:00Z",
        createdBy: "John Doe",
        note: "Expanded content with more examples",
        isAutoSave: false,
        changes: {
          added: ["Added case study section", "Added statistics section"],
          removed: ["Removed outdated information"],
          modified: ["Updated introduction"],
        },
      },
      {
        id: "v1",
        versionNumber: 1,
        createdAt: "2023-05-15T10:30:00Z",
        createdBy: "John Doe",
        note: "Initial draft",
        isAutoSave: false,
      },
    ],
  )

  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null)
  const [compareVersion, setCompareVersion] = useState<ContentVersion | null>(null)
  const [showCompareDialog, setShowCompareDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleCompare = (version: ContentVersion) => {
    setCompareVersion(version)
    setShowCompareDialog(true)
  }

  const handleViewVersion = (version: ContentVersion) => {
    setSelectedVersion(version)
    setShowVersionDialog(true)
  }

  const handleRestore = (version: ContentVersion) => {
    setSelectedVersion(version)
    setShowRestoreDialog(true)
  }

  const confirmRestore = async () => {
    if (!selectedVersion || !onRestoreVersion) return

    setIsRestoring(true)
    try {
      await onRestoreVersion(selectedVersion.id)
      setShowRestoreDialog(false)
      // Optionally refresh versions list
      if (onFetchVersions) {
        await onFetchVersions()
      }
    } catch (error) {
      console.error("Error restoring version:", error)
    } finally {
      setIsRestoring(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Version History</CardTitle>
        <Button variant="outline" size="sm" onClick={onFetchVersions} disabled={isLoading}>
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                    <div>
                      <div className="h-4 w-24 bg-muted rounded"></div>
                      <div className="h-3 w-40 bg-muted rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-3 w-3/4 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : versions.length > 0 ? (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div key={version.id} className="border rounded-md p-4 transition-colors hover:bg-accent/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                        <History className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Version {version.versionNumber}</span>
                          {index === 0 && <Badge className="bg-green-500">Current</Badge>}
                          {version.isAutoSave && (
                            <Badge variant="outline" className="text-xs">
                              Auto-saved
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(version.createdAt)}</span>
                          <span className="mx-1">•</span>
                          <User className="h-3 w-3" />
                          <span>{version.createdBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewVersion(version)} className="h-8">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {index !== 0 && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleRestore(version)} className="h-8">
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCompare(version)} className="h-8">
                            <ArrowLeftRight className="h-4 w-4 mr-1" />
                            Compare
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="text-sm">{version.note}</div>

                    {version.changes && (
                      <div className="mt-2 space-y-1 text-sm">
                        {version.changes.added.length > 0 && (
                          <div className="text-green-600 dark:text-green-400 flex items-start">
                            <span className="mr-1">+</span>
                            <span>Added: {version.changes.added.join(", ")}</span>
                          </div>
                        )}
                        {version.changes.removed.length > 0 && (
                          <div className="text-red-600 dark:text-red-400 flex items-start">
                            <span className="mr-1">-</span>
                            <span>Removed: {version.changes.removed.join(", ")}</span>
                          </div>
                        )}
                        {version.changes.modified.length > 0 && (
                          <div className="text-blue-600 dark:text-blue-400 flex items-start">
                            <span className="mr-1">~</span>
                            <span>Modified: {version.changes.modified.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No version history available</p>
            <p className="text-sm">Changes to this content will be tracked here</p>
          </div>
        )}
      </CardContent>

      {/* View Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Version {selectedVersion?.versionNumber} - {formatDate(selectedVersion?.createdAt || "")}
            </DialogTitle>
            <DialogDescription>
              Created by {selectedVersion?.createdBy} • {selectedVersion?.note}
            </DialogDescription>
          </DialogHeader>

          <div className="border rounded-md p-4 bg-muted/30 max-h-[60vh] overflow-auto">
            {selectedVersion?.content ? (
              <div dangerouslySetInnerHTML={{ __html: selectedVersion.content }} />
            ) : (
              <div className="text-muted-foreground italic">Content preview not available for this version</div>
            )}
          </div>

          <DialogFooter>
            {versions.findIndex((v) => v.id === selectedVersion?.id) !== 0 && (
              <Button
                onClick={() => {
                  setShowVersionDialog(false)
                  handleRestore(selectedVersion!)
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore This Version
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Compare Versions</DialogTitle>
            <DialogDescription>
              Comparing Version {compareVersion?.versionNumber} with Current Version
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="side-by-side" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
              <TabsTrigger value="inline">Inline Changes</TabsTrigger>
            </TabsList>
            <TabsContent value="side-by-side" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center justify-between">
                    <div>Version {compareVersion?.versionNumber}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(compareVersion?.createdAt || "")}</div>
                  </div>
                  <div className="border rounded-md p-4 bg-muted/30 h-[400px] overflow-auto">
                    {compareVersion?.content ? (
                      <div dangerouslySetInnerHTML={{ __html: compareVersion.content }} />
                    ) : (
                      <div className="text-muted-foreground italic">Content preview not available</div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center justify-between">
                    <div>Current Version</div>
                    <div className="text-xs text-muted-foreground">{formatDate(versions[0]?.createdAt || "")}</div>
                  </div>
                  <div className="border rounded-md p-4 bg-muted/30 h-[400px] overflow-auto">
                    {versions[0]?.content ? (
                      <div dangerouslySetInnerHTML={{ __html: versions[0].content }} />
                    ) : (
                      <div className="text-muted-foreground italic">Content preview not available</div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="inline" className="mt-4">
              <div className="border rounded-md p-4 bg-muted/30 h-[400px] overflow-auto">
                <div className="text-muted-foreground italic text-center">
                  Inline diff view would show changes with additions and deletions highlighted
                  <div className="mt-4 text-sm">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded mb-1">
                      + Added content would appear like this
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/30 p-1 rounded">
                      - Removed content would appear like this
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowCompareDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowCompareDialog(false)
                handleRestore(compareVersion!)
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore Version {compareVersion?.versionNumber}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version {selectedVersion?.versionNumber}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current version with version {selectedVersion?.versionNumber} from{" "}
              {formatDate(selectedVersion?.createdAt || "")}. The current version will be saved in the version history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                confirmRestore()
              }}
              disabled={isRestoring}
            >
              {isRestoring ? "Restoring..." : "Restore Version"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}