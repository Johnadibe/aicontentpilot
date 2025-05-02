"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentLibrary } from "@/components/content-management/content-library"
import { ContentOrganization } from "@/components/content-management/content-organization"
import { ContentEditor } from "@/components/content-management/content-editor"
import { ExportOptions } from "@/components/content-management/export-options"
import { ContentVersionHistory } from "@/components/content-management/content-version-history"
import { ContentScheduling } from "@/components/content-management/content-scheduling"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default function ContentManagementPage() {
  const [selectedContent, setSelectedContent] = useState<any>(null)

  return (
    <DashboardShell>
      <DashboardHeader heading="Content Management" description="Manage, organize, edit, and schedule your content" />

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          <ContentLibrary />
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <ContentOrganization />
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <ContentEditor contentId={selectedContent?.id} />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <ExportOptions content={selectedContent} />
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          <ContentVersionHistory contentId={selectedContent?.id} />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <ContentScheduling />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
