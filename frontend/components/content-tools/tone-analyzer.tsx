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
import { useToast } from "@/hooks/use-toast"
import { analyzeTone } from "@/lib/api-service"
import { Progress } from "@/components/ui/progress"

const toneAnalyzerSchema = z.object({
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  target_tone: z.string().optional(),
  industry: z.string().optional(),
})

type ToneAnalyzerFormValues = z.infer<typeof toneAnalyzerSchema>

export function ToneAnalyzer() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    current_tone: string
    tone_analysis: Record<string, number>
    suggestions: string[]
    adjusted_content?: string
  } | null>(null)

  const form = useForm<ToneAnalyzerFormValues>({
    resolver: zodResolver(toneAnalyzerSchema),
    defaultValues: {
      content: "",
      target_tone: "",
      industry: "",
    },
  })

  async function onSubmit(data: ToneAnalyzerFormValues) {
    try {
      setIsAnalyzing(true)
      setAnalysisResult(null)

      // Analyze tone using AI
      const result = await analyzeTone({
        content: data.content,
        target_tone: data.target_tone || undefined,
        industry: data.industry || undefined,
      })

      // Set the analysis result
      setAnalysisResult(result)

      toast({
        title: "Tone analysis complete",
        description: "Your content has been analyzed successfully.",
      })
    } catch (error) {
      console.error("Error analyzing tone:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze tone",
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
                <FormDescription>Paste your content here for tone analysis.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="target_tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Tone (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no_target">No specific target</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>If selected, we'll provide suggestions to adjust to this tone.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no_industry">No specific industry</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Helps provide industry-specific tone recommendations.</FormDescription>
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
              "Analyze Tone"
            )}
          </Button>
        </form>
      </Form>

      {analysisResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tone Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Current Tone: {analysisResult.current_tone}</h3>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Tone Breakdown</h3>
                {Object.entries(analysisResult.tone_analysis).map(([tone, percentage]) => (
                  <div key={tone} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{tone}</span>
                      <span>{Math.round(percentage * 100)}%</span>
                    </div>
                    <Progress value={percentage * 100} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-medium">Improvement Suggestions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              {analysisResult.adjusted_content && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Adjusted Content</h3>
                  <Card>
                    <CardContent className="p-4 whitespace-pre-wrap">{analysisResult.adjusted_content}</CardContent>
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
