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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { generateBlogPost } from "@/lib/api-service"
import { Badge } from "@/components/ui/badge"

const blogPostSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  topic: z.string().min(10, {
    message: "Topic must be at least 10 characters.",
  }),
  template: z.string(),
  target_audience: z.string(),
  industry: z.string(),
  tone: z.string(),
  word_count: z.coerce.number().min(300).max(3000),
  keywords: z.string().optional(),
})

type BlogPostFormValues = z.infer<typeof blogPostSchema>

export function BlogPostForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [sections, setSections] = useState<string[]>([])
  const [newSection, setNewSection] = useState("")

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      topic: "",
      template: "standard",
      target_audience: "general",
      industry: "general",
      tone: "professional",
      word_count: 800,
      keywords: "",
    },
  })

  const addSection = () => {
    if (newSection.trim()) {
      setSections([...sections, newSection.trim()])
      setNewSection("")
    }
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  async function onSubmit(data: BlogPostFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)

      // Convert comma-separated keywords to array
      const keywordsArray = data.keywords ? data.keywords.split(",").map((tag) => tag.trim()) : []

      // Generate blog post using AI
      const result = await generateBlogPost({
        title: data.title,
        topic: data.topic,
        template: data.template,
        target_audience: data.target_audience,
        industry: data.industry,
        tone: data.tone,
        sections: sections.length > 0 ? sections : undefined,
        word_count: data.word_count,
        keywords: keywordsArray,
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
          title: data.title,
          content: result.content,
          type: "BLOG_POST",
          tags: keywordsArray,
          metadata: {
            template: data.template,
            target_audience: data.target_audience,
            industry: data.industry,
            tone: data.tone,
            word_count: data.word_count,
            sections: sections,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "Blog post created",
        description: "Your blog post has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating blog post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post",
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
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blog Post Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your blog post" {...field} />
                  </FormControl>
                  <FormDescription>This will be the title of your blog post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Standard Article</SelectItem>
                      <SelectItem value="listicle">Listicle</SelectItem>
                      <SelectItem value="how-to">How-To Guide</SelectItem>
                      <SelectItem value="opinion">Opinion Piece</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                      <SelectItem value="comparison">Comparison</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of blog post you want to create.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the topic of your blog post in detail..."
                    className="min-h-24 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of what your blog post should be about.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
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
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="business-owners">Business Owners</SelectItem>
                      <SelectItem value="marketers">Marketers</SelectItem>
                      <SelectItem value="developers">Developers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Who is your blog post intended for?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Which industry is your blog post related to?</FormDescription>
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
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What tone should the blog post have?</FormDescription>
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
                  <FormDescription>Select the approximate word count for your blog post.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Sections (Optional)</FormLabel>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add a section (e.g., Introduction, Benefits, Conclusion)"
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSection()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addSection}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription className="mt-2">
              Add specific sections you want to include in your blog post.
            </FormDescription>

            {sections.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {sections.map((section, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {section}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeSection(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="seo, marketing, blog (comma separated)" {...field} />
                </FormControl>
                <FormDescription>Add keywords to help with SEO (comma separated).</FormDescription>
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
              "Generate Blog Post"
            )}
          </Button>
        </form>
      </Form>

      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Blog Post Preview</h2>
          <Card>
            <CardContent className="prose prose-slate dark:prose-invert max-w-none p-6">
              {generatedContent.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return <h1 key={index}>{paragraph.substring(2)}</h1>
                } else if (paragraph.startsWith("## ")) {
                  return <h2 key={index}>{paragraph.substring(3)}</h2>
                } else if (paragraph.startsWith("### ")) {
                  return <h3 key={index}>{paragraph.substring(4)}</h3>
                } else if (paragraph.trim() === "") {
                  return <br key={index} />
                } else {
                  return <p key={index}>{paragraph}</p>
                }
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
