"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Copy, Check, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { improveContent } from "@/lib/optimization-service"

const contentImproverSchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  improvement_type: z.string({
    required_error: "Please select an improvement type.",
  }),
  transformation_level: z.number().min(1).max(100).default(50),
  preserve_keywords: z.string().optional(),
  target_audience: z.string().optional(),
})

type ContentImproverFormValues = z.infer<typeof contentImproverSchema>

export function ContentImprover() {
  const { toast } = useToast()
  const [isImproving, setIsImproving] = useState(false)
  const [improvementResult, setImprovementResult] = useState<any>(null)
  const [copiedContent, setCopiedContent] = useState(false)

  const form = useForm<ContentImproverFormValues>({
    resolver: zodResolver(contentImproverSchema),
    defaultValues: {
      content: "",
      improvement_type: "clarity",
      transformation_level: 50,
      preserve_keywords: "",
      target_audience: "",
    },
  })

  async function onSubmit(data: ContentImproverFormValues) {
    try {
      setIsImproving(true)
      setImprovementResult(null)
      setCopiedContent(false)

      // Process preserve keywords
      const preserveKeywords = data.preserve_keywords
        ? data.preserve_keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
        : undefined

      // Improve content using API
      const result = await improveContent({
        content: data.content,
        improvement_type: data.improvement_type,
        transformation_level: data.transformation_level,
        preserve_keywords: preserveKeywords,
        target_audience: data.target_audience || undefined,
      })

      // Set the improvement result
      setImprovementResult(result)

      toast({
        title: "Content improvement complete",
        description: "Your content has been improved successfully.",
      })
    } catch (error) {
      console.error("Error improving content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to improve content",
        variant: "destructive",
      })
    } finally {
      setIsImproving(false)
    }
  }

  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedContent(true)
      setTimeout(() => setCopiedContent(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The improved content has been copied to your clipboard.",
      })
    })
  }

  // Helper function to get improvement type label
  const getImprovementTypeLabel = (type: string) => {
    switch (type) {
      case "clarity":
        return "Clarity & Readability"
      case "engagement":
        return "Engagement & Interest"
      case "professional":
        return "Professional & Formal"
      case "simple":
        return "Simple & Concise"
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
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
                <FormLabel>Content to Improve</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the content you want to improve..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Paste your content here to improve its quality and effectiveness.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="improvement_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Improvement Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select improvement type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="clarity">Clarity & Readability</SelectItem>
                      <SelectItem value="engagement">Engagement & Interest</SelectItem>
                      <SelectItem value="professional">Professional & Formal</SelectItem>
                      <SelectItem value="simple">Simple & Concise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose how you want to improve your content.</FormDescription>
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
                    <Input placeholder="e.g., marketing professionals, general public" {...field} />
                  </FormControl>
                  <FormDescription>Specify your target audience for more tailored improvements.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="transformation_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transformation Level: {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                </FormControl>
                <FormDescription className="flex justify-between">
                  <span>Subtle Changes</span>
                  <span>Complete Rewrite</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preserve_keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preserve Keywords (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., important term, specific phrase, product name" {...field} />
                </FormControl>
                <FormDescription>Comma-separated list of keywords to preserve in the improved content.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="gradient-primary" disabled={isImproving}>
            {isImproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Improving...
              </>
            ) : (
              "Improve Content"
            )}
          </Button>
        </form>
      </Form>

      {improvementResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Improvement Results</span>
                <Badge>{getImprovementTypeLabel(form.getValues().improvement_type)}</Badge>
              </CardTitle>
              <CardDescription>Transformation Level: {form.getValues().transformation_level}%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Before and After */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Original Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{improvementResult.original_content}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Improved Content</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(improvementResult.improved_content)}
                      className="h-8 px-2"
                    >
                      {copiedContent ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{improvementResult.improved_content}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Improvement Metrics */}
              {improvementResult.improvement_metrics && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Improvement Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(improvementResult.improvement_metrics).map(([metric, value]) => (
                      <Card key={metric} className="bg-muted/50">
                        <CardContent className="p-4">
                          <p className="text-sm text-muted-foreground">{metric.replace(/_/g, " ")}</p>
                          <div className="flex items-center gap-2">
                            {metric.includes("before") ? (
                              <p className="text-lg font-medium">{Number(value).toFixed(1)}</p>
                            ) : (
                              <>
                                <ArrowRight className="h-4 w-4 text-green-500" />
                                <p className="text-lg font-medium">{Number(value).toFixed(1)}</p>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Changes Summary */}
              {improvementResult.changes_summary && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Changes Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(improvementResult.changes_summary).map(([change, count]) => (
                      <div key={change} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{change.replace(/_/g, " ")}</p>
                        <p className="text-2xl font-bold">{String(count)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Further Improvement Suggestions */}
              {improvementResult.suggestions_for_further_improvement &&
                improvementResult.suggestions_for_further_improvement.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Further Improvement Suggestions</h3>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <ul className="space-y-2 list-disc pl-5">
                          {improvementResult.suggestions_for_further_improvement.map((suggestion: string, index: number) => (
                            <li key={index} className="text-sm">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
