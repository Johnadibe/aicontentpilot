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
import { generateAdCopy } from "@/lib/api-service"

const adCopySchema = z.object({
  platform: z.string(),
  ad_format: z.string(),
  product_name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  target_audience: z.string(),
  unique_selling_point: z.string().optional(),
  tone: z.string(),
  include_cta: z.boolean(),
  keywords: z.string().optional(),
  tags: z.string().optional(),
})

type AdCopyFormValues = z.infer<typeof adCopySchema>

export function AdCopyForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const form = useForm<AdCopyFormValues>({
    resolver: zodResolver(adCopySchema),
    defaultValues: {
      platform: "google_ads",
      ad_format: "responsive_search_ad",
      product_name: "",
      target_audience: "general",
      unique_selling_point: "",
      tone: "persuasive",
      include_cta: true,
      keywords: "",
      tags: "",
    },
  })

  // Get platform and format specific character limits
  const getPlatformLimits = (platform: string, format: string): { headline: number; description: number } => {
    const limits: Record<string, Record<string, { headline: number; description: number }>> = {
      google_ads: {
        responsive_search_ad: { headline: 30, description: 90 },
        display_ad: { headline: 25, description: 90 },
      },
      facebook_ads: {
        feed_ad: { headline: 40, description: 125 },
        carousel_ad: { headline: 40, description: 125 },
      },
      linkedin_ads: {
        sponsored_content: { headline: 150, description: 150 },
        text_ad: { headline: 25, description: 75 },
      },
    }

    return limits[platform]?.[format] || { headline: 30, description: 90 }
  }

  // Watch for platform and format changes to update character limits
  const watchPlatform = form.watch("platform")
  const watchFormat = form.watch("ad_format")
  const characterLimits = getPlatformLimits(watchPlatform, watchFormat)

  async function onSubmit(data: AdCopyFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)

      // Convert comma-separated keywords and tags to arrays
      const keywordsArray = data.keywords ? data.keywords.split(",").map((keyword) => keyword.trim()) : []
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Generate ad copy using AI
      const result = await generateAdCopy({
        platform: data.platform,
        ad_format: data.ad_format,
        product_name: data.product_name,
        target_audience: data.target_audience,
        unique_selling_point: data.unique_selling_point || undefined,
        tone: data.tone,
        include_cta: data.include_cta,
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
          title: `${data.platform} ${data.ad_format} for ${data.product_name}`,
          content: result.content,
          type: "AD_COPY",
          tags: tagsArray,
          metadata: {
            platform: data.platform,
            ad_format: data.ad_format,
            product_name: data.product_name,
            target_audience: data.target_audience,
            unique_selling_point: data.unique_selling_point,
            tone: data.tone,
            include_cta: data.include_cta,
            keywords: keywordsArray,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "Ad copy created",
        description: "Your ad copy has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating ad copy:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create ad copy",
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
                      <SelectItem value="google_ads">Google Ads</SelectItem>
                      <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
                      <SelectItem value="linkedin_ads">LinkedIn Ads</SelectItem>
                      <SelectItem value="twitter_ads">Twitter Ads</SelectItem>
                      <SelectItem value="instagram_ads">Instagram Ads</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the advertising platform.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ad_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="responsive_search_ad">Responsive Search Ad</SelectItem>
                      <SelectItem value="display_ad">Display Ad</SelectItem>
                      <SelectItem value="feed_ad">Feed Ad</SelectItem>
                      <SelectItem value="carousel_ad">Carousel Ad</SelectItem>
                      <SelectItem value="sponsored_content">Sponsored Content</SelectItem>
                      <SelectItem value="text_ad">Text Ad</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What type of ad do you want to create?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="product_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your product or service name" {...field} />
                </FormControl>
                <FormDescription>The product or service you're advertising.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unique_selling_point"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unique Selling Point (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="What makes your product or service unique?" className="resize-y" {...field} />
                </FormControl>
                <FormDescription>The main benefit or unique aspect of your product.</FormDescription>
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
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="students">Students</SelectItem>
                      <SelectItem value="parents">Parents</SelectItem>
                      <SelectItem value="business_owners">Business Owners</SelectItem>
                      <SelectItem value="tech_savvy">Tech-Savvy Users</SelectItem>
                      <SelectItem value="seniors">Seniors</SelectItem>
                      <SelectItem value="young_adults">Young Adults</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Who is this ad targeting?</FormDescription>
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
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What tone should the ad have?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="include_cta"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Call to Action</FormLabel>
                    <FormDescription>Add a strong call to action to your ad.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Character Limits</h3>
              <div className="rounded-lg border p-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Headline:</span> {characterLimits.headline} characters
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Description:</span> {characterLimits.description} characters
                  </p>
                </div>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="product, service, benefit (comma separated)" {...field} />
                </FormControl>
                <FormDescription>Keywords to include in your ad copy (comma separated).</FormDescription>
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
                  <Input placeholder="ads, marketing (comma separated)" {...field} />
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
              "Generate Ad Copy"
            )}
          </Button>
        </form>
      </Form>

      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Ad Copy</h2>
          <Card>
            <CardContent className="p-6">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
