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
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { generateSocialMedia } from "@/lib/api-service"

const socialMediaSchema = z.object({
  platform: z.string(),
  content_type: z.string(),
  objective: z.string(),
  topic: z.string().min(10, {
    message: "Topic must be at least 10 characters.",
  }),
  tone: z.string(),
  include_hashtags: z.boolean(),
  include_emojis: z.boolean(),
  tags: z.string().optional(),
})

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>

export function SocialMediaForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [characterCount, setCharacterCount] = useState<number | null>(null)

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      platform: "twitter",
      content_type: "text_post",
      objective: "engagement",
      topic: "",
      tone: "casual",
      include_hashtags: true,
      include_emojis: true,
      tags: "",
    },
  })

  // Get platform character limit
  const getPlatformLimit = (platform: string): number => {
    const limits: Record<string, number> = {
      twitter: 280,
      linkedin: 3000,
      facebook: 5000,
      instagram: 2200,
    }
    return limits[platform] || 1000
  }

  // Watch for platform changes to update character limit
  const watchPlatform = form.watch("platform")
  const characterLimit = getPlatformLimit(watchPlatform)

  async function onSubmit(data: SocialMediaFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)
      setCharacterCount(null)

      // Convert comma-separated tags to array
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Generate social media content using AI
      const result = await generateSocialMedia({
        platform: data.platform,
        content_type: data.content_type,
        objective: data.objective,
        topic: data.topic,
        tone: data.tone,
        include_hashtags: data.include_hashtags,
        include_emojis: data.include_emojis,
        character_limit: characterLimit,
      })

      // Set the generated content
      setGeneratedContent(result.content)
      setCharacterCount(result.content.length)

      // Save to database
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${data.platform} ${data.content_type}`,
          content: result.content,
          type: "SOCIAL_MEDIA",
          tags: tagsArray,
          metadata: {
            platform: data.platform,
            content_type: data.content_type,
            objective: data.objective,
            tone: data.tone,
            include_hashtags: data.include_hashtags,
            include_emojis: data.include_emojis,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "Social media content created",
        description: "Your social media content has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating social media content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create social media content",
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
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the social media platform.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <SelectItem value="text_post">Text Post</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                      <SelectItem value="poll">Poll</SelectItem>
                      <SelectItem value="thread">Thread</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What type of content do you want to create?</FormDescription>
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
                  <Textarea placeholder="What do you want to post about?" className="min-h-24 resize-y" {...field} />
                </FormControl>
                <FormDescription>Describe what your social media post should be about.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objective</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="awareness">Awareness</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                      <SelectItem value="leads">Lead Generation</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What is the goal of your social media post?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What tone should the post have?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="include_hashtags"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Hashtags</FormLabel>
                    <FormDescription>
                      Automatically generate and include relevant hashtags in your post.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_emojis"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Emojis</FormLabel>
                    <FormDescription>Add appropriate emojis to make your post more engaging.</FormDescription>
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
                  <Input placeholder="social, marketing (comma separated)" {...field} />
                </FormControl>
                <FormDescription>Add tags to help organize your content (comma separated).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Social Media Post"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">Character limit: {characterLimit}</p>
          </div>
        </form>
      </Form>

      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Social Media Post</h2>
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Character count: {characterCount} / {characterLimit}
                  {characterCount && characterCount > characterLimit ? (
                    <span className="text-destructive ml-2">Exceeds limit!</span>
                  ) : null}
                </p>
              </div>
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
