"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import { generateContent } from "@/lib/api/fastapi"
import type { ContentGenerationParams } from "@/lib/types"

// Define the base schema for content generation
const baseFormSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  keywords: z.string().optional(),
  audience: z.string(),
  tone: z.string(),
  length: z.number().min(100).max(5000),
  additionalContext: z.string().optional(),
})

// Props for the content generator form
interface ContentGeneratorFormProps {
  contentType: string
  title: string
  description: string
  extraFields?: z.ZodTypeAny
  extraFormFields?: React.ReactNode
  placeholders?: {
    topic?: string
    keywords?: string
    additionalContext?: string
  }
  toneOptions?: { value: string; label: string }[]
  audienceOptions?: { value: string; label: string }[]
  lengthRange?: { min: number; max: number; default: number }
  onSuccess?: (content: any) => void
}

export function ContentGeneratorForm({
  contentType,
  title,
  description,
  extraFields,
  extraFormFields,
  placeholders = {},
  toneOptions,
  audienceOptions,
  lengthRange = { min: 100, max: 5000, default: 800 },
  onSuccess,
}: ContentGeneratorFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [activeTab, setActiveTab] = useState("generate")
  const [aiProvider, setAiProvider] = useState("openai")

  // Create the form schema with any extra fields
  const formSchema = extraFields ? baseFormSchema.merge(extraFields) : baseFormSchema

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      keywords: "",
      audience: "general",
      tone: "professional",
      length: lengthRange.default,
      additionalContext: "",
    },
  })

  // Default tone options if not provided
  const defaultToneOptions = [
    { value: "professional", label: "Professional" },
    { value: "conversational", label: "Conversational" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "humorous", label: "Humorous" },
    { value: "authoritative", label: "Authoritative" },
    { value: "friendly", label: "Friendly" },
    { value: "technical", label: "Technical" },
  ]

  // Default audience options if not provided
  const defaultAudienceOptions = [
    { value: "general", label: "General" },
    { value: "beginners", label: "Beginners" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced/Expert" },
    { value: "business", label: "Business Professionals" },
    { value: "technical", label: "Technical Audience" },
    { value: "students", label: "Students" },
    { value: "seniors", label: "Seniors" },
    { value: "parents", label: "Parents" },
  ]

  // Use provided options or defaults
  const tones = toneOptions || defaultToneOptions
  const audiences = audienceOptions || defaultAudienceOptions

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      // Prepare the parameters for the API call
      const params: ContentGenerationParams = {
        ...values,
      }

      // In a real app, this would call your backend API
      const result = await generateContent(contentType, params)
      setGeneratedContent(result.content)
      setActiveTab("preview")

      toast({
        title: `${title} generated successfully`,
        description: "Your content is ready to review and edit.",
      })

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Error generating content",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const regenerateContent = async () => {
    setIsGenerating(true)
    try {
      const values = form.getValues()
      const params: ContentGenerationParams = {
        ...values,
      }

      const result = await generateContent(contentType, params)
      setGeneratedContent(result.content)

      toast({
        title: "Content regenerated",
        description: "Your content has been regenerated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error regenerating content",
        description: "There was an error regenerating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="preview" disabled={!generatedContent}>
            Preview & Edit
          </TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder={placeholders.topic || `e.g. ${title} topic`} {...field} />
                        </FormControl>
                        <FormDescription>Enter the main topic for your content</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={placeholders.keywords || "e.g. keyword1, keyword2, keyword3"}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Enter keywords separated by commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {audiences.map((audience) => (
                              <SelectItem key={audience.value} value={audience.value}>
                                {audience.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Who will be reading this content?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tones.map((tone) => (
                              <SelectItem key={tone.value} value={tone.value}>
                                {tone.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the writing style for your content</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>Content Length: {value} words</FormLabel>
                        <FormControl>
                          <Slider
                            onValueChange={(values) => onChange(values[0])}
                            defaultValue={[value]}
                            min={lengthRange.min}
                            max={lengthRange.max}
                            step={100}
                          />
                        </FormControl>
                        <FormDescription>Drag to adjust the length of the generated content</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalContext"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Context</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              placeholders.additionalContext ||
                              "Add any additional information or specific requirements..."
                            }
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Provide any additional context or specific requirements</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Render any extra form fields */}
                  {extraFormFields}

                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <FormLabel>AI Provider</FormLabel>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant={aiProvider === "openai" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAiProvider("openai")}
                        >
                          OpenAI
                        </Button>
                        <Button
                          type="button"
                          variant={aiProvider === "deepseek" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAiProvider("deepseek")}
                        >
                          DeepSeek
                        </Button>
                      </div>
                    </div>
                    <FormDescription>Select the AI provider to use for content generation</FormDescription>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  `Generate ${title}`
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="preview" className="py-4">
          {generatedContent ? (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("generate")}>
                  Back to Generator
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={regenerateContent} disabled={isGenerating}>
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Regenerate
                  </Button>
                  <Button variant="outline">Download</Button>
                  <Button className="gradient-primary">Save to Library</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No content generated yet. Go to the Generate tab to create content.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
