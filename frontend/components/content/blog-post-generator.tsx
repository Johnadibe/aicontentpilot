"use client"

import { useState } from "react"
import * as z from "zod"
import { DashboardHeader } from "@/components/dashboard/header"
import { ContentGeneratorForm } from "@/components/content/content-generator-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, MinusCircle } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define extra fields for blog post generation
const blogExtraFields = z.object({
  blogType: z.string(),
  outline: z.array(z.string()).min(1, "At least one section is required"),
  includeFeaturedImage: z.boolean().default(false),
  includeTableOfContents: z.boolean().default(true),
})

export function BlogPostGenerator() {
  const [outlineFields, setOutlineFields] = useState<string[]>([
    "Introduction",
    "Main Point 1",
    "Main Point 2",
    "Conclusion",
  ])

  const addOutlineItem = () => {
    setOutlineFields([...outlineFields, `Section ${outlineFields.length + 1}`])
  }

  const removeOutlineItem = (index: number) => {
    if (outlineFields.length > 1) {
      setOutlineFields(outlineFields.filter((_, i) => i !== index))
    }
  }

  const updateOutlineItem = (index: number, value: string) => {
    const newOutline = [...outlineFields]
    newOutline[index] = value
    setOutlineFields(newOutline)
  }

  // Blog type options
  const blogTypeOptions = [
    { value: "how-to", label: "How-To Guide" },
    { value: "listicle", label: "Listicle" },
    { value: "tutorial", label: "Tutorial" },
    { value: "opinion", label: "Opinion Piece" },
    { value: "case-study", label: "Case Study" },
    { value: "review", label: "Review" },
    { value: "news", label: "News Article" },
    { value: "interview", label: "Interview" },
  ]

  // Custom form fields for blog post generator
  const BlogExtraFormFields = () => (
    <>
      <FormField
        name="blogType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blog Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a blog type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {blogTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the type of blog post to generate</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="outline"
        render={() => (
          <FormItem>
            <FormLabel>Blog Post Outline</FormLabel>
            <Card>
              <CardContent className="p-4 space-y-2">
                {outlineFields.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => updateOutlineItem(index, e.target.value)}
                      placeholder={`Section ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOutlineItem(index)}
                      disabled={outlineFields.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={addOutlineItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
            <FormDescription>Customize the structure of your blog post</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <>
      <DashboardHeader heading="Blog Post Generator" text="Create SEO-optimized blog posts with AI assistance" />
      <ContentGeneratorForm
        contentType="blog"
        title="Blog Post"
        description="Generate a comprehensive blog post on any topic"
        extraFields={blogExtraFields}
        extraFormFields={<BlogExtraFormFields />}
        placeholders={{
          topic: "e.g. Benefits of Meditation for Stress Reduction",
          keywords: "e.g. meditation, stress relief, mindfulness, mental health",
          additionalContext: "Add any specific requirements, target audience details, or key points to include...",
        }}
        lengthRange={{ min: 300, max: 3000, default: 800 }}
      />
    </>
  )
}
