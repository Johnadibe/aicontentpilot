"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, CheckCircle, BarChart2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { analyzeKeywordDensity } from "@/lib/optimization-service"

const keywordAnalyzerSchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  primary_keyword: z.string().min(1, {
    message: "Primary keyword is required.",
  }),
  secondary_keywords: z.string().optional(),
  analyze_competitors: z.boolean().default(false),
  competitor_urls: z.string().optional(),
})

type KeywordAnalyzerFormValues = z.infer<typeof keywordAnalyzerSchema>

export function KeywordAnalyzer() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const form = useForm<KeywordAnalyzerFormValues>({
    resolver: zodResolver(keywordAnalyzerSchema),
    defaultValues: {
      content: "",
      primary_keyword: "",
      secondary_keywords: "",
      analyze_competitors: false,
      competitor_urls: "",
    },
  })

  const analyzeCompetitors = form.watch("analyze_competitors")

  async function onSubmit(data: KeywordAnalyzerFormValues) {
    try {
      setIsAnalyzing(true)
      setAnalysisResult(null)

      // Process secondary keywords
      const secondaryKeywords = data.secondary_keywords
        ? data.secondary_keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
        : undefined

      // Process competitor URLs
      const competitorUrls =
        data.competitor_urls && data.analyze_competitors
          ? data.competitor_urls
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url.length > 0)
          : undefined

      // Analyze keyword density using API
      const result = await analyzeKeywordDensity({
        content: data.content,
        primary_keyword: data.primary_keyword,
        secondary_keywords: secondaryKeywords,
        analyze_competitors: data.analyze_competitors,
        competitor_urls: competitorUrls,
      })

      // Set the analysis result
      setAnalysisResult(result)

      toast({
        title: "Keyword analysis complete",
        description: "Your content has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing keywords:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze keywords",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to determine if density is optimal
  const getDensityStatus = (density: number, isSecondary = false) => {
    const min = isSecondary ? 0.005 : 0.01
    const max = isSecondary ? 0.015 : 0.03

    if (density < min) return "low"
    if (density > max) return "high"
    return "optimal"
  }

  // Helper function to get color based on density status
  const getDensityColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-500"
      case "high":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content to Analyze</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the content you want to analyze for keyword density..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Paste your content here for keyword density analysis.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="primary_keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Keyword</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., content optimization" {...field} />
                  </FormControl>
                  <FormDescription>The main keyword you want to track.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SEO, content analysis, optimization" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of secondary keywords.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="analyze_competitors"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Analyze Competitors</FormLabel>
                  <FormDescription>Compare your keyword usage with competitors</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          {analyzeCompetitors && (
            <FormField
              control={form.control}
              name="competitor_urls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor URLs</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="https://competitor1.com/page, https://competitor2.com/page"
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Comma-separated list of competitor URLs to analyze.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="gradient-primary" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Keywords"
            )}
          </Button>
        </form>
      </Form>

      {analysisResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Keyword Density Analysis</span>
                <BarChart2 className="h-5 w-5" />
              </CardTitle>
              <CardDescription>Analysis of keyword usage and distribution in your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Keyword */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Primary Keyword</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{analysisResult.primary_keyword}</span>
                    <span>{(analysisResult.primary_keyword_density * 100).toFixed(2)}%</span>
                  </div>
                  <Progress
                    value={analysisResult.primary_keyword_density * 100}
                    max={5}
                    className={`h-2 bg-muted ${getDensityColor(getDensityStatus(analysisResult.primary_keyword_density))}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>1% (Min)</span>
                    <span>2% (Optimal)</span>
                    <span>3% (Max)</span>
                    <span>5%</span>
                  </div>
                  <Badge
                    className={
                      getDensityStatus(analysisResult.primary_keyword_density) === "optimal"
                        ? "bg-green-500"
                        : getDensityStatus(analysisResult.primary_keyword_density) === "high"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }
                  >
                    {getDensityStatus(analysisResult.primary_keyword_density) === "optimal"
                      ? "Optimal Density"
                      : getDensityStatus(analysisResult.primary_keyword_density) === "high"
                        ? "Over-optimized"
                        : "Under-optimized"}
                  </Badge>
                </div>
              </div>

              {/* Secondary Keywords */}
              {Object.keys(analysisResult.secondary_keyword_densities).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Secondary Keywords</h3>
                  {Object.entries(analysisResult.secondary_keyword_densities).map(([keyword, density]) => (
                    <div key={keyword} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{keyword}</span>
                        <span>{(Number(density) * 100).toFixed(2)}%</span>
                      </div>
                      <Progress
                        value={Number(density) * 100}
                        max={3}
                        className={`h-2 bg-muted ${getDensityColor(getDensityStatus(Number(density), true))}`}
                      />
                      <Badge
                        className={
                          getDensityStatus(Number(density), true) === "optimal"
                            ? "bg-green-500"
                            : getDensityStatus(Number(density), true) === "high"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }
                      >
                        {getDensityStatus(Number(density), true) === "optimal"
                          ? "Optimal Density"
                          : getDensityStatus(Number(density), true) === "high"
                            ? "Over-optimized"
                            : "Under-optimized"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Keyword Distribution */}
              {Object.keys(analysisResult.keyword_distribution).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Keyword Distribution</h3>
                  <div className="space-y-4">
                    {Object.entries(analysisResult.keyword_distribution).map(([keyword, positions]) => (
                      <div key={keyword} className="space-y-2">
                        <p className="text-sm font-medium">{keyword}</p>
                        <div className="h-8 bg-muted rounded-md relative">
                          {Array.isArray(positions) &&
                            positions.map((position, index) => (
                              <div
                                key={index}
                                className="absolute h-full w-1 bg-primary"
                                style={{
                                  left: `${(Number(position) / 20) * 100}%`,
                                  transform: "translateX(-50%)",
                                }}
                              />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Beginning</span>
                          <span>Middle</span>
                          <span>End</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Semantic Keywords */}
              {analysisResult.semantic_keywords && analysisResult.semantic_keywords.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Semantic Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.semantic_keywords.map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {analysisResult.overoptimization_warnings && analysisResult.overoptimization_warnings.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Warnings</h3>
                  {analysisResult.overoptimization_warnings.map((warning: string, index: number) => (
                    <Card key={index} className="bg-yellow-50 border-yellow-200">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <p className="text-sm">{warning}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Improvement Suggestions</h3>
                  {analysisResult.suggestions.map((suggestion: string, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <p className="text-sm">{suggestion}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
