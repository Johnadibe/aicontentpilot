"use client"

import * as z from "zod"
import { DashboardHeader } from "@/components/dashboard/header"
import { ContentGeneratorForm } from "@/components/content/content-generator-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle } from "lucide-react"
import { useState } from "react"

// Define extra fields for SEO content generation
const seoContentExtraFields = z.object({
  primaryKeyword: z.string().min(1, "Primary keyword is required"),
  secondaryKeywords: z.array(z.string()).min(1, "At least one secondary keyword is required"),
  contentType: z.string(),
  includeMetaDescription: z.boolean().default(true),
  includeHeaderStructure: z.boolean().default(true),
  includeFAQs: z.boolean().default(false),
  targetSearchIntent: z.string(),
  competitorUrls: z.string().optional(),
})

export function SeoContentGenerator() {
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>(["Secondary keyword 1"])

  const addKeyword = () => {
    setSecondaryKeywords([...secondaryKeywords, `Secondary keyword ${secondaryKeywords.length + 1}`])
  }

  const removeKeyword = (index: number) => {
    if (secondaryKeywords.length > 1) {
      setSecondaryKeywords(secondaryKeywords.filter((_, i) => i !== index))
    }
  }

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...secondaryKeywords]
    newKeywords[index] = value
    setSecondaryKeywords(newKeywords)
  }

  // Content type options
  const contentTypeOptions = [
    { value: "blog-post", label: "Blog Post" },
    { value: "landing-page", label: "Landing Page" },
    { value: "product-page", label: "Product Page" },
    { value: "category-page", label: "Category Page" },
    { value: "service-page", label: "Service Page" },
    { value: "about-page", label: "About Page" },
    { value: "pillar-content", label: "Pillar Content" },
    { value: "guide", label: "Comprehensive Guide" },
  ]

  // Search intent options
  const searchIntentOptions = [
    { value: "informational", label: "Informational" },
    { value: "navigational", label: "Navigational" },
    { value: "commercial", label: "Commercial" },
    { value: "transactional", label: "Transactional" },
  ]

  // Custom form fields for SEO content generator
  const SeoContentExtraFormFields = () => (
    <>
      <FormField
        name="primaryKeyword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Keyword</FormLabel>
            <FormControl>
              <Input placeholder="e.g. best wireless headphones" {...field} />
            </FormControl>
            <FormDescription>Enter the main keyword you want to rank for</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="secondaryKeywords"
        render={() => (
          <FormItem>
            <FormLabel>Secondary Keywords</FormLabel>
            <Card>
              <CardContent className="p-4 space-y-2">
                {secondaryKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      placeholder={`Secondary keyword ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeKeyword(index)}
                      disabled={secondaryKeywords.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={addKeyword}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Keyword
                </Button>
              </CardContent>
            </Card>
            <FormDescription>Add related keywords to include in the content</FormDescription>
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
                  <SelectValue placeholder="Select a content type" />
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
            <FormDescription>Select the type of content to generate</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="targetSearchIntent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Search Intent</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select search intent" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {searchIntentOptions.map((intent) => (
                  <SelectItem key={intent.value} value={intent.value}>
                    {intent.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the search intent you're targeting</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-3 gap-4">
        <FormField
          name="includeMetaDescription"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Meta Description</FormLabel>
                <FormDescription>Generate meta description</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="includeHeaderStructure"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Header Structure</FormLabel>
                <FormDescription>Include H1, H2, H3 tags</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="includeFAQs"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Include FAQs</FormLabel>
                <FormDescription>Add FAQ section</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="competitorUrls"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Competitor URLs</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g. https://competitor1.com/page, https://competitor2.com/page"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>Enter competitor URLs to analyze (optional, comma separated)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <>
      <DashboardHeader heading="SEO Content Generator" text="Create search engine optimized content that ranks" />
      <ContentGeneratorForm
        contentType="seo"
        title="SEO Content"
        description="Generate SEO-optimized content"
        extraFields={seoContentExtraFields}
        extraFormFields={<SeoContentExtraFormFields />}
        placeholders={{
          topic: "e.g. Best Wireless Headphones 2025, How to Start a Blog",
          keywords: "e.g. wireless headphones, bluetooth headphones, noise cancelling",
          additionalContext:
            "Add any specific content requirements, target audience details, or competitor insights...",
        }}
        lengthRange={{ min: 500, max: 3000, default: 1200 }}
        toneOptions={[
          { value: "informative", label: "Informative" },
          { value: "professional", label: "Professional" },
          { value: "conversational", label: "Conversational" },
          { value: "authoritative", label: "Authoritative" },
          { value: "educational", label: "Educational" },
          { value: "friendly", label: "Friendly" },
          { value: "persuasive", label: "Persuasive" },
        ]}
      />
    </>
  )
}
