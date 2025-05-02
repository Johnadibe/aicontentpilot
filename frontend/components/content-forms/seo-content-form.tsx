"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { generateSEOContent } from "@/lib/api-service"
import { Badge } from "@/components/ui/badge"

const seoContentSchema = z.object({
  primary_keyword: z.string().min(2, {
    message: "Primary keyword must be at least 2 characters.",
  }),
  content_type: z.string(),
  target_audience: z.string(),
  word_count: z.coerce.number().min(300).max(3000),
  include_faq: z.boolean(),
  meta_description: z.boolean(),
  tone: z.string(),
  serp_analysis: z.boolean(),
  semantic_keywords: z.boolean(),
  header_optimization: z.boolean(),
  internal_linking: z.boolean(),
  featured_snippet: z.boolean(),
  readability_optimization: z.boolean(),
  tags: z.string().optional(),
})

type SEOContentFormValues = z.infer<typeof seoContentSchema>

export function SEOContentForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")

  const form = useForm<SEOContentFormValues>({
    resolver: zodResolver(seoContentSchema),
    defaultValues: {
      primary_keyword: "",
      content_type: "article",
      target_audience: "general",
      word_count: 1000,
      include_faq: true,
      meta_description: true,
      tone: "informative",
      serp_analysis: true,
      semantic_keywords: true,
      header_optimization: true,
      internal_linking: false,
      featured_snippet: true,
      readability_optimization: true,
      tags: "",
    },
  })

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setSecondaryKeywords([...secondaryKeywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    setSecondaryKeywords(secondaryKeywords.filter((_, i) => i !== index))
  }

  async function onSubmit(data: SEOContentFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)

      // Convert comma-separated tags to array
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Generate SEO content using AI
      const result = await generateSEOContent({
        primary_keyword: data.primary_keyword,
        secondary_keywords: secondaryKeywords,
        content_type: data.content_type,
        target_audience: data.target_audience,
        word_count: data.word_count,
        include_faq: data.include_faq,
        meta_description: data.meta_description,
        tone: data.tone,
        serp_analysis: data.serp_analysis,
        semantic_keywords: data.semantic_keywords,
        header_optimization: data.header_optimization,
        internal_linking: data.internal_linking,
        featured_snippet: data.featured_snippet,
        readability_optimization: data.readability_optimization,
      })

      // Set the generated content
      setGeneratedContent(result.content)

      // Save to database
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `SEO Content: ${data.primary_keyword}`,
          content: result.content,
          type: "SEO_CONTENT",
          tags: tagsArray,
          metadata: {
            primary_keyword: data.primary_keyword,
            secondary_keywords: secondaryKeywords,
            content_type: data.content_type,
            target_audience: data.target_audience,
            word_count: data.word_count,
            include_faq: data.include_faq,
            meta_description: data.meta_description,
            tone: data.tone,
            serp_analysis: data.serp_analysis,
            semantic_keywords: data.semantic_keywords,
            header_optimization: data.header_optimization,
            internal_linking: data.internal_linking,
            featured_snippet: data.featured_snippet,
            readability_optimization: data.readability_optimization,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "SEO content created",
        description: "Your SEO content has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating SEO content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create SEO content",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="primary_keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Keyword</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your main target keyword" {...field} />
                </FormControl>
                <FormDescription>The main keyword you want to rank for.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Secondary Keywords</FormLabel>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add a secondary keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addKeyword()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription className="mt-2">Add related keywords to include in your content.</FormDescription>

            {secondaryKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {secondaryKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeKeyword(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="content_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="blog_post">Blog Post</SelectItem>
                      <SelectItem value="landing_page">Landing Page</SelectItem>
                      <SelectItem value="product_page">Product Page</SelectItem>
                      <SelectItem value="category_page">Category Page</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="how_to">How-To</SelectItem>
                      <SelectItem value="listicle">Listicle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What type of content do you want to create?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="business_owners">Business Owners</SelectItem>
                      <SelectItem value="consumers">Consumers</SelectItem>
                      <SelectItem value="researchers">Researchers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Who is this content intended for?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What tone should the content have?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="word_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word Count: {field.value}</FormLabel>
                  <FormControl>
                    <Input type="range" min="300" max="3000" step="100" {...field} />
                  </FormControl>
                  <FormDescription>Select the approximate word count for your content.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="include_faq"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include FAQ Section</FormLabel>
                    <FormDescription>Add a frequently asked questions section to improve SEO.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Generate Meta Description</FormLabel>
                    <FormDescription>Create an SEO-optimized meta description (150-160 characters).</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="serp_analysis"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">SERP Analysis</FormLabel>
                    <FormDescription>Analyze top search results to optimize content structure.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semantic_keywords"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Semantic Keywords</FormLabel>
                    <FormDescription>Include semantically related keywords to improve relevance.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="header_optimization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Header Optimization</FormLabel>
                    <FormDescription>Optimize H1, H2, and H3 headers for SEO.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featured_snippet"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Snippet Optimization</FormLabel>
                    <FormDescription>Structure content to target featured snippets.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="readability_optimization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Readability Optimization</FormLabel>
                    <FormDescription>Improve content readability for better user experience.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="internal_linking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Internal Linking Suggestions</FormLabel>
                    <FormDescription>Include suggestions for internal linking opportunities.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="seo, content (comma separated)" {...field} />
                </FormControl>
                <FormDescription>Add tags to help organize your content (comma separated).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate SEO Content"
            )}
          </Button>
        </form>
      </Form>

      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated SEO Content</h2>
          <Card>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
