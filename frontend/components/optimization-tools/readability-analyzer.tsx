"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, BookOpen, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { analyzeReadability } from "@/lib/optimization-service"

const readabilitySchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  target_audience: z.string().optional(),
})

type ReadabilityFormValues = z.infer<typeof readabilitySchema>

export function ReadabilityAnalyzer() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const form = useForm<ReadabilityFormValues>({
    resolver: zodResolver(readabilitySchema),
    defaultValues: {
      content: "",
      target_audience: "",
    },
  })

  async function onSubmit(data: ReadabilityFormValues) {
    try {
      setIsAnalyzing(true)
      setAnalysisResult(null)

      // Analyze readability using API
      const result = await analyzeReadability({
        content: data.content,
        target_audience: data.target_audience || undefined,
      })

      // Set the analysis result
      setAnalysisResult(result)

      toast({
        title: "Readability analysis complete",
        description: "Your content has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing readability:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze readability",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to get color based on grade level
  const getGradeLevelColor = (level: number) => {
    if (level <= 6) return "bg-green-500"
    if (level <= 9) return "bg-blue-500"
    if (level <= 12) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Helper function to get grade level label
  const getGradeLevelLabel = (level: number) => {
    if (level <= 6) return "Elementary School"
    if (level <= 9) return "Middle School"
    if (level <= 12) return "High School"
    return "College"
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
                <FormDescription>Paste your content here for readability analysis.</FormDescription>
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
                  <Input placeholder="e.g., general public, technical experts, children" {...field} />
                </FormControl>
                <FormDescription>Specify your target audience for more tailored recommendations.</FormDescription>
                <FormMessage />
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
              "Analyze Readability"
            )}
          </Button>
        </form>
      </Form>

      {analysisResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Readability Analysis Results</span>
                <Badge>{analysisResult.grade_level}</Badge>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Grade Level: {analysisResult.metrics.average_grade_level.toFixed(1)}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Readability Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Readability Metrics</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Flesch-Kincaid Grade Level</span>
                    <span>{analysisResult.metrics.flesch_kincaid.toFixed(1)}</span>
                  </div>
                  <Progress value={analysisResult.metrics.flesch_kincaid} max={18} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Gunning Fog Index</span>
                    <span>{analysisResult.metrics.gunning_fog.toFixed(1)}</span>
                  </div>
                  <Progress value={analysisResult.metrics.gunning_fog} max={18} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>SMOG Index</span>
                    <span>{analysisResult.metrics.smog.toFixed(1)}</span>
                  </div>
                  <Progress value={analysisResult.metrics.smog} max={18} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Grade Level</span>
                    <span>{analysisResult.metrics.average_grade_level.toFixed(1)}</span>
                  </div>
                  <Progress value={analysisResult.metrics.average_grade_level} max={18} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Elementary</span>
                    <span>Middle School</span>
                    <span>High School</span>
                    <span>College</span>
                  </div>
                </div>
              </div>

              {/* Sentence Structure */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Sentence Structure</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Sentence Length</p>
                    <p className="text-lg font-medium">
                      {analysisResult.metrics.average_sentence_length.toFixed(1)} words
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Passive Voice</p>
                    <p className="text-lg font-medium">
                      {(analysisResult.metrics.passive_voice_percentage * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Complex Words</p>
                    <p className="text-lg font-medium">
                      {(analysisResult.metrics.complex_word_percentage * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Complex Words */}
              {analysisResult.complex_words.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Complex Words</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {analysisResult.complex_words.map((word: { word: string; alternative?: string }, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-muted/50 rounded-md">
                        <span className="font-medium">{word.word}</span>
                        {word.alternative && <span className="text-muted-foreground">Try: {word.alternative}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Sentences */}
              {analysisResult.long_sentences.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Long Sentences</h3>
                  {analysisResult.long_sentences.map((sentence: { sentence: string; word_count: number }, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-sm">{sentence.sentence}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {sentence.word_count} words - Consider breaking this into shorter sentences
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Passive Voice */}
              {analysisResult.passive_sentences.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Passive Voice</h3>
                  {analysisResult.passive_sentences.map((sentence: { sentence: string }, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div>
                            <p className="text-sm">{sentence.sentence}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Consider using active voice for more direct and engaging writing
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Suggestions */}
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
