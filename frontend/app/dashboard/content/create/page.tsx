"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { generateContent } from "@/lib/api-service"

const contentFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  type: z.enum(["BLOG_POST", "SOCIAL_MEDIA", "EMAIL", "AD_COPY", "PRODUCT_DESCRIPTION", "SEO_CONTENT", "OTHER"]),
  tags: z.string().optional(),
})

type ContentFormValues = z.infer<typeof contentFormSchema>

export default function CreateContentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: {
      title: "",
      prompt: "",
      type: "BLOG_POST",
      tags: "",
    },
  })

  async function onSubmit(data: ContentFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)

      // Convert comma-separated tags to array
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Generate content using AI
      const result = await generateContent({
        title: data.title,
        prompt: data.prompt,
        type: data.type,
        tags: tagsArray,
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
          type: data.type,
          tags: tagsArray,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "Content created",
        description: "Your content has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create content",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Content" text="Generate new content using AI." />
      <div className="grid gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your content" {...field} />
                  </FormControl>
                  <FormDescription>This will be the title of your generated content.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BLOG_POST">Blog Post</SelectItem>
                      <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="AD_COPY">Ad Copy</SelectItem>
                      <SelectItem value="PRODUCT_DESCRIPTION">Product Description</SelectItem>
                      <SelectItem value="SEO_CONTENT">SEO Content</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the type of content you want to generate.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you want the AI to generate..."
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a detailed prompt for the AI to generate your content.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="marketing, seo, blog (comma separated)" {...field} />
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
                "Generate Content"
              )}
            </Button>
          </form>
        </Form>

        {generatedContent && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Generated Content Preview</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none border rounded-md p-6 bg-card">
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
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
