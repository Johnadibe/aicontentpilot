"use client"

import * as z from "zod"
import { DashboardHeader } from "@/components/dashboard/header"
import { ContentGeneratorForm } from "@/components/content/content-generator-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle } from "lucide-react"
import { useState } from "react"

// Define extra fields for ad copy generation
const adCopyExtraFields = z.object({
  adPlatform: z.string(),
  adFormat: z.string(),
  uniqueSellingPoints: z.array(z.string()).min(1, "At least one selling point is required"),
  includeNumbers: z.boolean().default(true),
  includeEmojis: z.boolean().default(false),
  callToAction: z.string().optional(),
  targetUrl: z.string().optional(),
  numberOfVariations: z.number().min(1).max(5).default(3),
})

export function AdCopyGenerator() {
  const [sellingPoints, setSellingPoints] = useState<string[]>(["Unique selling point 1"])

  const addSellingPoint = () => {
    setSellingPoints([...sellingPoints, `Unique selling point ${sellingPoints.length + 1}`])
  }

  const removeSellingPoint = (index: number) => {
    if (sellingPoints.length > 1) {
      setSellingPoints(sellingPoints.filter((_, i) => i !== index))
    }
  }

  const updateSellingPoint = (index: number, value: string) => {
    const newPoints = [...sellingPoints]
    newPoints[index] = value
    setSellingPoints(newPoints)
  }

  // Ad platform options
  const adPlatformOptions = [
    { value: "google", label: "Google Ads" },
    { value: "facebook", label: "Facebook Ads" },
    { value: "instagram", label: "Instagram Ads" },
    { value: "linkedin", label: "LinkedIn Ads" },
    { value: "twitter", label: "Twitter Ads" },
    { value: "tiktok", label: "TikTok Ads" },
    { value: "youtube", label: "YouTube Ads" },
    { value: "pinterest", label: "Pinterest Ads" },
  ]

  // Ad format options
  const adFormatOptions = [
    { value: "search", label: "Search Ad" },
    { value: "display", label: "Display Ad" },
    { value: "video", label: "Video Ad" },
    { value: "carousel", label: "Carousel Ad" },
    { value: "story", label: "Story Ad" },
    { value: "responsive", label: "Responsive Ad" },
    { value: "shopping", label: "Shopping Ad" },
    { value: "app", label: "App Install Ad" },
  ]

  // Custom form fields for ad copy generator
  const AdCopyExtraFormFields = () => (
    <>
      <FormField
        name="adPlatform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad Platform</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an ad platform" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {adPlatformOptions.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the advertising platform</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="adFormat"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad Format</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an ad format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {adFormatOptions.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the ad format</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="uniqueSellingPoints"
        render={() => (
          <FormItem>
            <FormLabel>Unique Selling Points</FormLabel>
            <Card>
              <CardContent className="p-4 space-y-2">
                {sellingPoints.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={point}
                      onChange={(e) => updateSellingPoint(index, e.target.value)}
                      placeholder={`Selling point ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSellingPoint(index)}
                      disabled={sellingPoints.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={addSellingPoint}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Selling Point
                </Button>
              </CardContent>
            </Card>
            <FormDescription>List the key selling points of your product or service</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="includeNumbers"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Include Numbers</FormLabel>
                <FormDescription>Use numbers in headlines</FormDescription>
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
              <Input placeholder="e.g. Buy Now, Learn More, Sign Up Today" {...field} />
            </FormControl>
            <FormDescription>Specify the primary call to action (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="targetUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target URL</FormLabel>
            <FormControl>
              <Input placeholder="e.g. https://example.com/landing-page" {...field} />
            </FormControl>
            <FormDescription>Enter the destination URL (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="numberOfVariations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Variations</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(Number.parseInt(value))}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of variations" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>How many ad copy variations to generate</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <>
      <DashboardHeader heading="Ad Copy Generator" text="Create high-converting ad copy for different platforms" />
      <ContentGeneratorForm
        contentType="ad"
        title="Ad Copy"
        description="Generate compelling advertising copy"
        extraFields={adCopyExtraFields}
        extraFormFields={<AdCopyExtraFormFields />}
        placeholders={{
          topic: "e.g. New Product Launch, Limited Time Offer, Free Trial",
          keywords: "e.g. affordable, premium, exclusive, limited time",
          additionalContext: "Add any specific campaign details, target audience information, or brand guidelines...",
        }}
        lengthRange={{ min: 50, max: 500, default: 150 }}
        toneOptions={[
          { value: "persuasive", label: "Persuasive" },
          { value: "urgent", label: "Urgent" },
          { value: "professional", label: "Professional" },
          { value: "friendly", label: "Friendly" },
          { value: "enthusiastic", label: "Enthusiastic" },
          { value: "promotional", label: "Promotional" },
          { value: "humorous", label: "Humorous" },
          { value: "luxurious", label: "Luxurious" },
        ]}
      />
    </>
  )
}
