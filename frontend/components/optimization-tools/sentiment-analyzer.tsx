"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Smile, Meh, Frown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { analyzeSentiment } from "@/lib/optimization-service"

const sentimentAnalyzerSchema = z.object({
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  detailed: z.boolean().default(false),
})

type SentimentAnalyzerFormValues = z.infer<typeof sentimentAnalyzerSchema>

export function SentimentAnalyzer() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const form = useForm<SentimentAnalyzerFormValues>({
    resolver: zodResolver(sentimentAnalyzerSchema),
    defaultValues: {
      content: "",
      detailed: false,
    },
  })

  async function onSubmit(data: SentimentAnalyzerFormValues) {
    try {
      setIsAnalyzing(true)
      setAnalysisResult(null)

      // Analyze sentiment using API
      const result = await analyzeSentiment({
        content: data.content,
        detailed: data.detailed,
      })

      // Set the analysis result
      setAnalysisResult(result)

      toast({
        title: "Sentiment analysis complete",
        description: "Your content has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze sentiment",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to get sentiment icon
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="h-6 w-6 text-green-500" />
      case "neutral":
        return <Meh className="h-6 w-6 text-blue-500" />
      case "negative":
        return <Frown className="h-6 w-6 text-red-500" />
      default:
        return <Meh className="h-6 w-6" />
    }
  }

  // Helper function to get sentiment badge
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-500">Positive</Badge>
      case "neutral":
        return <Badge className="bg-blue-500">Neutral</Badge>
      case "negative":
        return <Badge className="bg-red-500">Negative</Badge>
      default:
        return <Badge>Unknown</Badge>
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
                    placeholder="Enter the content you want to analyze for sentiment..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Paste your content here for sentiment analysis.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detailed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Detailed Analysis</FormLabel>
                  <FormDescription>Include sentence-level breakdown and emotional analysis</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="gradient-primary" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Sentiment"
            )}
          </Button>
        </form>
      </Form>

      {analysisResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sentiment Analysis Results</span>
                {getSentimentBadge(analysisResult.overall_sentiment)}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {getSentimentIcon(analysisResult.overall_sentiment)}
                <span>Your content has an overall {analysisResult.overall_sentiment} sentiment</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sentiment Score */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sentiment Score</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Positive</span>
                      <span>{(analysisResult.sentiment_score.positive * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={analysisResult.sentiment_score.positive * 100}
                      className="h-2 bg-muted"
                      style={{
                        '--progress-foreground': 'rgb(34, 197, 94)'
                      } as React.CSSProperties} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Neutral</span>
                      <span>{(analysisResult.sentiment_score.neutral * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={analysisResult.sentiment_score.neutral * 100}
                      className="h-2 bg-muted"
                      style={{
                        '--progress-foreground': 'rgb(59, 130, 246)'
                      } as React.CSSProperties} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Negative</span>
                      <span>{(analysisResult.sentiment_score.negative * 100).toFixed(1)}%</span>
                    </div>
                    <Progress
                      value={analysisResult.sentiment_score.negative * 100}
                      className="h-2 bg-muted"
                      style={{
                        '--progress-foreground': 'rgb(239, 68, 68)'
                      } as React.CSSProperties} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Compound Score</span>
                    <span>{analysisResult.sentiment_score.compound.toFixed(2)}</span>
                  </div>
                  <Progress
                    value={(analysisResult.sentiment_score.compound + 1) * 50}
                    className="h-2 bg-muted"
                    style={{
                      '--progress-foreground': analysisResult.sentiment_score.compound > 0.05
                        ? 'rgb(34, 197, 94)'  // green-500
                        : analysisResult.sentiment_score.compound < -0.05
                          ? 'rgb(239, 68, 68)'  // red-500
                          : 'rgb(59, 130, 246)'  // blue-500
                    } as React.CSSProperties}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>-1.0 (Very Negative)</span>
                    <span>0.0 (Neutral)</span>
                    <span>+1.0 (Very Positive)</span>
                  </div>
                </div>
              </div>

              {/* Emotions */}
              {analysisResult.emotions && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Emotional Analysis</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(analysisResult.emotions).map(([emotion, score]) => (
                      <div key={emotion} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
                          <span>{(Number(score) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={Number(score) * 100} className="h-2 bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentence Analysis */}
              {analysisResult.sentence_analysis && analysisResult.sentence_analysis.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sentence-Level Analysis</h3>
                  {analysisResult.sentence_analysis.map((item: { sentiment: string; sentence: string; score: number }, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">{getSentimentIcon(item.sentiment)}</div>
                          <div className="flex-1">
                            <p className="text-sm">{item.sentence}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="outline">{item.sentiment}</Badge>
                              <span className="text-sm text-muted-foreground">Score: {item.score.toFixed(2)}</span>
                            </div>
                          </div>
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
                        <p className="text-sm">{suggestion}</p>
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
