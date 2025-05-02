"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { analyzeSEO } from "@/lib/optimization-service"

const seoAnalyzerSchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  primary_keyword: z.string().optional(),
  secondary_keywords: z.string().optional(),
  url: z.string().url().optional().or(z.literal("")),
  target_audience: z.string().optional(),
})

type SEOAnalyzerFormValues = z.infer<typeof seoAnalyzerSchema>

export function SEOAnalyzer() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const form = useForm<SEOAnalyzerFormValues>({
    resolver: zodResolver(seoAnalyzerSchema),
    defaultValues: {
      content: "",
      primary_keyword: "",
      secondary_keywords: "",
      url: "",
      target_audience: "",
    },
  })

  async function onSubmit(data: SEOAnalyzerFormValues) {
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

      // Analyze SEO using API
      const result = await analyzeSEO({
        content: data.content,
        primary_keyword: data.primary_keyword || undefined,
        secondary_keywords: secondaryKeywords,
        url: data.url || undefined,
        target_audience: data.target_audience || undefined,
      })

      // Set the analysis result
      setAnalysisResult(result)

      toast({
        title: "SEO analysis complete",
        description: "Your content has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing SEO:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze SEO",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
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
                    placeholder="Enter the content you want to analyze..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Paste your content here for SEO analysis.</FormDescription>
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
                  <FormLabel>Primary Keyword (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., content optimization" {...field} />
                  </FormControl>
                  <FormDescription>The main keyword you want to rank for.</FormDescription>
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

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/page" {...field} />
                  </FormControl>
                  <FormDescription>URL of the page if already published.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., marketing professionals" {...field} />
                  </FormControl>
                  <FormDescription>Who is this content intended for?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="gradient-primary" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze SEO"
            )}
          </Button>
        </form>
      </Form>

      {analysisResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>SEO Analysis Results</span>
                <Badge
                  variant={
                    analysisResult.overall_score >= 70
                      ? "secondary"
                      : analysisResult.overall_score >= 50
                        ? "outline"
                        : "destructive"
                  }
                  className={
                    analysisResult.overall_score >= 70
                      ? "bg-green-500 text-white"
                      : analysisResult.overall_score >= 50
                        ? "bg-yellow-500 text-white"
                        : ""
                  }
                >
                  Score: {analysisResult.overall_score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall SEO Score</span>
                  <span>{analysisResult.overall_score}/100</span>
                </div>
                <Progress value={analysisResult.overall_score} className="h-2" />
              </div>

              {/* Content Structure */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Content Structure</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Word Count</p>
                    <p className="text-lg font-medium">{analysisResult.content_structure.word_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Headers</p>
                    <p className="text-lg font-medium">{analysisResult.content_structure.headers_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paragraphs</p>
                    <p className="text-lg font-medium">{analysisResult.content_structure.paragraph_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Images</p>
                    <p className="text-lg font-medium">{analysisResult.content_structure.images_count}</p>
                  </div>
                </div>
              </div>

              {/* Keyword Density */}
              {Object.keys(analysisResult.keyword_density).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Keyword Density</h3>
                  {Object.entries(analysisResult.keyword_density).map(([keyword, density]) => (
                    <div key={keyword} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{keyword}</span>
                        <span>{(Number(density) * 100).toFixed(2)}%</span>
                      </div>
                      <Progress value={Number(density) * 100} max={5} className="h-2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Readability */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Readability Score</h3>
                <div className="flex justify-between text-sm">
                  <span>Flesch Reading Ease</span>
                  <span>{analysisResult.readability_score.toFixed(1)}</span>
                </div>
                <Progress value={analysisResult.readability_score} max={100} className="h-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {analysisResult.readability_score >= 80
                    ? "Very easy to read"
                    : analysisResult.readability_score >= 70
                      ? "Easy to read"
                      : analysisResult.readability_score >= 60
                        ? "Standard/average"
                        : analysisResult.readability_score >= 50
                          ? "Fairly difficult"
                          : analysisResult.readability_score >= 30
                            ? "Difficult"
                            : "Very difficult"}
                </p>
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Improvement Suggestions</h3>
                {analysisResult.suggestions.map((suggestion: { priority: string; issue: string; suggestion: string; category: string }, index: number) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {suggestion.priority === "high" ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : suggestion.priority === "medium" ? (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{suggestion.issue}</p>
                          <p className="text-sm text-muted-foreground">{suggestion.suggestion}</p>
                          <Badge variant="outline" className="mt-2">
                            {suggestion.category.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
