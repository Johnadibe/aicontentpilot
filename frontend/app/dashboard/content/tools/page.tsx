"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ToneAnalyzer } from "@/components/content-tools/tone-analyzer"
import { ContentSummarizer } from "@/components/content-tools/content-summarizer"

export default function ContentToolsPage() {
  const [activeTab, setActiveTab] = useState("tone-analyzer")

  return (
    <DashboardShell>
      <DashboardHeader heading="Content Tools" text="Analyze and optimize your content." />

      <Tabs defaultValue="tone-analyzer" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="tone-analyzer">Tone Analyzer</TabsTrigger>
          <TabsTrigger value="content-summarizer">Content Summarizer</TabsTrigger>
        </TabsList>

        <TabsContent value="tone-analyzer" className="space-y-4">
          <ToneAnalyzer />
        </TabsContent>

        <TabsContent value="content-summarizer" className="space-y-4">
          <ContentSummarizer />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
