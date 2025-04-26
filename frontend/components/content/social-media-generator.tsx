"use client"

import * as z from "zod"
import { DashboardHeader } from "@/components/dashboard/header"
import { ContentGeneratorForm } from "@/components/content/content-generator-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

// Define extra fields for social media content generation
const socialMediaExtraFields = z.object({
  platform: z.string(),
  contentType: z.string(),
  objective: z.string(),
  includeHashtags: z.boolean().default(true),
  includeEmojis: z.boolean().default(true),
  callToAction: z.string().optional(),
  numberOfPosts: z.number().min(1).max(10).default(1),
})

export function SocialMediaGenerator() {
  // Platform options
  const platformOptions = [
    { value: "twitter", label: "Twitter/X" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "pinterest", label: "Pinterest" },
    { value: "threads", label: "Threads" },
  ]

  // Content type options
  const contentTypeOptions = [
    { value: "text", label: "Text Post" },
    { value: "carousel", label: "Carousel" },
    { value: "poll", label: "Poll" },
    { value: "story", label: "Story" },
    { value: "reel", label: "Reel/Short Video Script" },
    { value: "thread", label: "Thread" },
  ]

  // Objective options
  const objectiveOptions = [
    { value: "engagement", label: "Engagement" },
    { value: "awareness", label: "Brand Awareness" },
    { value: "traffic", label: "Website Traffic" },
    { value: "leads", label: "Lead Generation" },
    { value: "sales", label: "Sales" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
  ]

  // Custom form fields for social media generator
  const SocialMediaExtraFormFields = () => (
    <>
      <FormField
        name="platform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Platform</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {platformOptions.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the social media platform</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="contentType"
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
                {contentTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the type of social media content</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="objective"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content Objective</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an objective" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {objectiveOptions.map((objective) => (
                  <SelectItem key={objective.value} value={objective.value}>
                    {objective.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>What is the goal of this content?</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="includeHashtags"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Include Hashtags</FormLabel>
                <FormDescription>Generate relevant hashtags</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="includeEmojis"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Include Emojis</FormLabel>
                <FormDescription>Add relevant emojis</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="callToAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Call to Action</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Click the link in bio, Sign up today" {...field} />
            </FormControl>
            <FormDescription>Specify a call to action (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="numberOfPosts"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Posts</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number.parseInt(value))}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of posts" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>How many posts to generate</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <>
      <DashboardHeader
        heading="Social Media Content Generator"
        text="Create engaging social media posts optimized for your platform"
      />
      <ContentGeneratorForm
        contentType="social"
        title="Social Media Post"
        description="Generate engaging social media content"
        extraFields={socialMediaExtraFields}
        extraFormFields={<SocialMediaExtraFormFields />}
        placeholders={{
          topic: "e.g. Product launch announcement, Industry trend, Company milestone",
          keywords: "e.g. social media, engagement, marketing",
          additionalContext: "Add any specific brand voice guidelines, campaign details, or key messages to include...",
        }}
        lengthRange={{ min: 50, max: 500, default: 200 }}
        toneOptions={[
          { value: "conversational", label: "Conversational" },
          { value: "professional", label: "Professional" },
          { value: "casual", label: "Casual" },
          { value: "enthusiastic", label: "Enthusiastic" },
          { value: "humorous", label: "Humorous" },
          { value: "inspirational", label: "Inspirational" },
          { value: "educational", label: "Educational" },
          { value: "promotional", label: "Promotional" },
        ]}
      />
    </>
  )
}
