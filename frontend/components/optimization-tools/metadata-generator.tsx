"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Copy, Check, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { generateMetadata } from "@/lib/optimization-service"

const metadataGeneratorSchema = z.object({
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }),
  primary_keyword: z.string().min(1, {
    message: "Primary keyword is required.",
  }),
  secondary_keywords: z.string().optional(),
  brand_name: z.string().optional(),
  character_limit_title: z.coerce.number().min(10).max(120).default(60),
  character_limit_description: z.coerce.number().min(50).max(320).default(160),
})

type MetadataGeneratorFormValues = z.infer<typeof metadataGeneratorSchema>

export function MetadataGenerator() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)
  const [copiedDescription, setCopiedDescription] = useState<string | null>(null)

  const form = useForm<MetadataGeneratorFormValues>({
    resolver: zodResolver(metadataGeneratorSchema),
    defaultValues: {
      content: "",
      primary_keyword: "",
      secondary_keywords: "",
      brand_name: "",
      character_limit_title: 60,
      character_limit_description: 160,
    },
  })

  async function onSubmit(data: MetadataGeneratorFormValues) {
    try {
      setIsGenerating(true)
      setGenerationResult(null)
      setCopiedTitle(null)
      setCopiedDescription(null)

      // Process secondary keywords
      const secondaryKeywords = data.secondary_keywords
        ? data.secondary_keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
        : undefined

      // Generate metadata using API
      const result = await generateMetadata({
        content: data.content,
        primary_keyword: data.primary_keyword,
        secondary_keywords: secondaryKeywords,
        brand_name: data.brand_name || undefined,
        character_limit_title: data.character_limit_title,
        character_limit_description: data.character_limit_description,
      })

      // Set the generation result
      setGenerationResult(result)

      toast({
        title: "Metadata generation complete",
        description: "Your metadata options have been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating metadata:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate metadata",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string, type: "title" | "description") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "title") {
        setCopiedTitle(text)
        setTimeout(() => setCopiedTitle(null), 2000)
      } else {
        setCopiedDescription(text)
        setTimeout(() => setCopiedDescription(null), 2000)
      }

      toast({
        title: "Copied to clipboard",
        description: `The ${type} has been copied to your clipboard.`,
      })
    })
  }

  // Helper function to get rating stars
  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating * 5)

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-muted-foreground" />)
      }
    }

    return <div className="flex">{stars}</div>
  }

  return (
    <div className="grid gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content to Generate Metadata For</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the content you want to generate metadata for..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Paste your content here to generate optimized title tags and meta descriptions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="primary_keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Keyword</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., content optimization" {...field} />
                  </FormControl>
                  <FormDescription>The main keyword you want to rank for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Keywords (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SEO, content analysis, optimization" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated list of secondary keywords.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FormField
              control={form.control}
              name="brand_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Your Company" {...field} />
                  </FormControl>
                  <FormDescription>Your brand name to include in metadata.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="character_limit_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Character Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Recommended: 50-60 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="character_limit_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description Character Limit</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Recommended: 150-160 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="gradient-primary" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Metadata"
            )}
          </Button>
        </form>
      </Form>

      {generationResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Title Tags</CardTitle>
              <CardDescription>Click on any title to copy it to your clipboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generationResult.title_options.map((title: string, index: number) => (
                <Card key={index} className="bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <CardContent className="p-4" onClick={() => copyToClipboard(title, "title")}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">
                          {title.length} characters
                          {title.length > form.getValues().character_limit_title && (
                            <span className="text-red-500"> (exceeds limit)</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {generationResult.title_ratings &&
                          title in generationResult.title_ratings &&
                          getRatingStars(generationResult.title_ratings[title])}
                        {copiedTitle === title ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Meta Descriptions</CardTitle>
              <CardDescription>Click on any description to copy it to your clipboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generationResult.meta_description_options.map((description: string, index: number) => (
                <Card key={index} className="bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                  <CardContent className="p-4" onClick={() => copyToClipboard(description, "description")}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p>{description}</p>
                        <p className="text-xs text-muted-foreground">
                          {description.length} characters
                          {description.length > form.getValues().character_limit_description && (
                            <span className="text-red-500"> (exceeds limit)</span>
                          )}
                        </p>
                      </div>
                      <div>
                        {copiedDescription === description ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* SERP Preview */}
          <Card>
            <CardHeader>
              <CardTitle>SERP Preview</CardTitle>
              <CardDescription>How your page might appear in search results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 space-y-1">
                <p className="text-blue-600 text-xl font-medium truncate">
                  {generationResult.title_options[0] || "Title"}
                </p>
                <p className="text-green-700 text-sm">
                  {form.getValues().brand_name ? `${form.getValues().brand_name} › Page` : "example.com › Page"}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {generationResult.meta_description_options[0] || "Description"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Placement Analysis */}
          {generationResult.keyword_placement_analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Keyword Placement Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(generationResult.keyword_placement_analysis).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm">{key.replace(/_/g, " ")}</span>
                      <Badge variant="outline"
                        className={value === true || value === "beginning" ? "bg-green-500 text-white" : ""}>
                        {typeof value === "boolean"
                          ? (value ? "Yes" : "No")
                          : (typeof value === "string" ? value : String(value))}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* CTR Optimization Tips */}
          {generationResult.ctr_optimization_tips && generationResult.ctr_optimization_tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>CTR Optimization Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {generationResult.ctr_optimization_tips.map((tip: string, index: number) => (
                    <li key={index} className="text-sm">
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
