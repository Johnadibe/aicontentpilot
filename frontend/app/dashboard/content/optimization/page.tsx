"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SEOAnalyzer } from "@/components/optimization-tools/seo-analyzer"
import { ReadabilityAnalyzer } from "@/components/optimization-tools/readability-analyzer"
import { GrammarChecker } from "@/components/optimization-tools/grammar-checker"
import { SentimentAnalyzer } from "@/components/optimization-tools/sentiment-analyzer"
import { KeywordAnalyzer } from "@/components/optimization-tools/keyword-analyzer"
import { MetadataGenerator } from "@/components/optimization-tools/metadata-generator"
import { ContentImprover } from "@/components/optimization-tools/content-improver"

export default function ContentOptimizationPage() {
  const [activeTab, setActiveTab] = useState("seo-analyzer")

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Content Optimization Tools"
        text="Analyze and optimize your content for better performance."
      />

      <Tabs defaultValue="seo-analyzer" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8">
          <TabsTrigger value="seo-analyzer">SEO</TabsTrigger>
          <TabsTrigger value="readability">Readability</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="improver">Improver</TabsTrigger>
        </TabsList>

        <TabsContent value="seo-analyzer" className="space-y-4">
          <SEOAnalyzer />
        </TabsContent>

        <TabsContent value="readability" className="space-y-4">
          <ReadabilityAnalyzer />
        </TabsContent>

        <TabsContent value="grammar" className="space-y-4">
          <GrammarChecker />
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-4">
          <SentimentAnalyzer />
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <KeywordAnalyzer />
        </TabsContent>

        <TabsContent value="metadata" className="space-y-4">
          <MetadataGenerator />
        </TabsContent>

        <TabsContent value="improver" className="space-y-4">
          <ContentImprover />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
