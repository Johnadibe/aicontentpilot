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
import { generateProductDescription } from "@/lib/api-service"
import { Badge } from "@/components/ui/badge"

const productDescriptionSchema = z.object({
  product_name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  product_category: z.string(),
  target_audience: z.string(),
  tone: z.string(),
  length: z.string(),
  include_technical_specs: z.boolean(),
  tags: z.string().optional(),
})

type ProductDescriptionFormValues = z.infer<typeof productDescriptionSchema>

export function ProductDescriptionForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState("")

  const form = useForm<ProductDescriptionFormValues>({
    resolver: zodResolver(productDescriptionSchema),
    defaultValues: {
      product_name: "",
      product_category: "electronics",
      target_audience: "general",
      tone: "professional",
      length: "standard",
      include_technical_specs: false,
      tags: "",
    },
  })

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()])
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  async function onSubmit(data: ProductDescriptionFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)

      // Convert comma-separated tags to array
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Generate product description using AI
      const result = await generateProductDescription({
        product_name: data.product_name,
        product_category: data.product_category,
        features: features,
        benefits: benefits,
        target_audience: data.target_audience,
        tone: data.tone,
        length: data.length,
        include_technical_specs: data.include_technical_specs,
        keywords: tagsArray,
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
          title: `Product Description: ${data.product_name}`,
          content: result.content,
          type: "PRODUCT_DESCRIPTION",
          tags: tagsArray,
          metadata: {
            product_name: data.product_name,
            product_category: data.product_category,
            features: features,
            benefits: benefits,
            target_audience: data.target_audience,
            tone: data.tone,
            length: data.length,
            include_technical_specs: data.include_technical_specs,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "Product description created",
        description: "Your product description has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating product description:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product description",
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
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your product name" {...field} />
                  </FormControl>
                  <FormDescription>The name of your product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="clothing">Clothing & Apparel</SelectItem>
                      <SelectItem value="home">Home & Kitchen</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="sports">Sports & Outdoors</SelectItem>
                      <SelectItem value="toys">Toys & Games</SelectItem>
                      <SelectItem value="books">Books & Media</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="software">Software & Apps</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The category your product belongs to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Features</FormLabel>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add a product feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addFeature()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription className="mt-2">Add key features of your product.</FormDescription>

            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <FormLabel>Benefits</FormLabel>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Add a product benefit"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addBenefit()
                  }
                }}
              />
              <Button type="button" size="icon" onClick={addBenefit}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormDescription className="mt-2">Add benefits that customers will get from your product.</FormDescription>

            {benefits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {benefits.map((benefit, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {benefit}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeBenefit(index)}
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
                      <SelectItem value="seniors">Seniors</SelectItem>
                      <SelectItem value="tech_enthusiasts">Tech Enthusiasts</SelectItem>
                      <SelectItem value="budget_conscious">Budget Conscious</SelectItem>
                      <SelectItem value="luxury_buyers">Luxury Buyers</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Who is this product intended for?</FormDescription>
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
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="luxurious">Luxurious</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What tone should the description have?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">Short (~100 words)</SelectItem>
                      <SelectItem value="standard">Standard (~200 words)</SelectItem>
                      <SelectItem value="detailed">Detailed (~400 words)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How detailed should the description be?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="include_technical_specs"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Technical Specifications</FormLabel>
                    <FormDescription>Add technical specifications in a structured format.</FormDescription>
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
                  <Input placeholder="product, ecommerce (comma separated)" {...field} />
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
              "Generate Product Description"
            )}
          </Button>
        </form>
      </Form>

      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Product Description</h2>
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
