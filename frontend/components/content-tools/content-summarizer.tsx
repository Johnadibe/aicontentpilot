"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { summarizeContent } from "@/lib/api-service"

const contentSummarizerSchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters to summarize.",
  }),
  target_length: z.string(),
  preserve_key_points: z.boolean(),
})

type ContentSummarizerFormValues = z.infer<typeof contentSummarizerSchema>

export function ContentSummarizer() {
  const { toast } = useToast()
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summaryResult, setSummaryResult] = useState<{
    original_length: number
    summarized_length: number
    summary: string
    key_points?: string[]
  } | null>(null)

  const form = useForm<ContentSummarizerFormValues>({
    resolver: zodResolver(contentSummarizerSchema),
    defaultValues: {
      content: "",
      target_length: "medium",
      preserve_key_points: true,
    },
  })

  async function onSubmit(data: ContentSummarizerFormValues) {
    try {
      setIsSummarizing(true)
      setSummaryResult(null)

      // Summarize content using AI
      const result = await summarizeContent({
        content: data.content,
        target_length: data.target_length,
        preserve_key_points: data.preserve_key_points,
      })

      // Set the summary result
      setSummaryResult(result)

      toast({
        title: "Content summarized",
        description: "Your content has been summarized successfully.",
      })
    } catch (error) {
      console.error("Error summarizing content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to summarize content",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
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
                <FormLabel>Content to Summarize</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the content you want to summarize..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Paste your content here for summarization.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="target_length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="snippet">Snippet (~50 words)</SelectItem>
                      <SelectItem value="short">Short (~100 words)</SelectItem>
                      <SelectItem value="medium">Medium (~200 words)</SelectItem>
                      <SelectItem value="long">Long (~400 words)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How long should the summary be?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preserve_key_points"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Preserve Key Points</FormLabel>
                    <FormDescription>Extract and maintain all key points in the summary.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="gradient-primary" disabled={isSummarizing}>
            {isSummarizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              "Summarize Content"
            )}
          </Button>
        </form>
      </Form>

      {summaryResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between text-sm">
                <span>Original length: {summaryResult.original_length} words</span>
                <span>Summarized length: {summaryResult.summarized_length} words</span>
                <span>
                  Reduction: {Math.round((1 - summaryResult.summarized_length / summaryResult.original_length) * 100)}%
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Summary</h3>
                <Card>
                  <CardContent className="p-4 whitespace-pre-wrap">{summaryResult.summary}</CardContent>
                </Card>
              </div>

              {summaryResult.key_points && summaryResult.key_points.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Key Points</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {summaryResult.key_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
