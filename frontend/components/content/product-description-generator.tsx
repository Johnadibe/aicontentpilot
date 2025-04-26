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

// Define extra fields for product description generation
const productDescriptionExtraFields = z.object({
  productCategory: z.string(),
  productFeatures: z.array(z.string()).min(1, "At least one feature is required"),
  includeTechnicalSpecs: z.boolean().default(true),
  includeProductBenefits: z.boolean().default(true),
  targetAudience: z.string(),
  pricePoint: z.string().optional(),
  descriptionLength: z.enum(["short", "standard", "detailed"]).default("standard"),
})

export function ProductDescriptionGenerator() {
  const [productFeatures, setProductFeatures] = useState<string[]>(["Feature 1"])

  const addFeature = () => {
    setProductFeatures([...productFeatures, `Feature ${productFeatures.length + 1}`])
  }

  const removeFeature = (index: number) => {
    if (productFeatures.length > 1) {
      setProductFeatures(productFeatures.filter((_, i) => i !== index))
    }
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...productFeatures]
    newFeatures[index] = value
    setProductFeatures(newFeatures)
  }

  // Product category options
  const productCategoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing & Apparel" },
    { value: "home", label: "Home & Kitchen" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "health", label: "Health & Wellness" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "toys", label: "Toys & Games" },
    { value: "books", label: "Books & Media" },
    { value: "food", label: "Food & Beverages" },
    { value: "furniture", label: "Furniture" },
    { value: "automotive", label: "Automotive" },
    { value: "jewelry", label: "Jewelry & Accessories" },
    { value: "pet", label: "Pet Supplies" },
    { value: "office", label: "Office Supplies" },
    { value: "software", label: "Software & Digital Products" },
  ]

  // Description length options
  const descriptionLengthOptions = [
    { value: "short", label: "Short (50-100 words)" },
    { value: "standard", label: "Standard (100-200 words)" },
    { value: "detailed", label: "Detailed (200-400 words)" },
  ]

  // Custom form fields for product description generator
  const ProductDescriptionExtraFormFields = () => (
    <>
      <FormField
        name="productCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {productCategoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the product category</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="productFeatures"
        render={() => (
          <FormItem>
            <FormLabel>Product Features</FormLabel>
            <Card>
              <CardContent className="p-4 space-y-2">
                {productFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature(index)}
                      disabled={productFeatures.length <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2 w-full" onClick={addFeature}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>
            <FormDescription>List the key features of your product</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="includeTechnicalSpecs"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Technical Specs</FormLabel>
                <FormDescription>Include technical specifications</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="includeProductBenefits"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Product Benefits</FormLabel>
                <FormDescription>Highlight product benefits</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="pricePoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price Point</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Budget-friendly, Premium, Luxury, $99.99" {...field} />
            </FormControl>
            <FormDescription>Indicate the price point or pricing tier (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="descriptionLength"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description Length</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select description length" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {descriptionLengthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the desired description length</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  return (
    <>
      <DashboardHeader
        heading="Product Description Generator"
        text="Create compelling product descriptions that sell"
      />
      <ContentGeneratorForm
        contentType="product"
        title="Product Description"
        description="Generate persuasive product descriptions"
        extraFields={productDescriptionExtraFields}
        extraFormFields={<ProductDescriptionExtraFormFields />}
        placeholders={{
          topic: "e.g. Wireless Bluetooth Headphones, Organic Cotton T-Shirt",
          keywords: "e.g. comfortable, durable, premium, high-quality",
          additionalContext: "Add any specific product details, competitive advantages, or brand voice guidelines...",
        }}
        lengthRange={{ min: 50, max: 500, default: 200 }}
        toneOptions={[
          { value: "persuasive", label: "Persuasive" },
          { value: "professional", label: "Professional" },
          { value: "enthusiastic", label: "Enthusiastic" },
          { value: "luxurious", label: "Luxurious" },
          { value: "friendly", label: "Friendly" },
          { value: "technical", label: "Technical" },
          { value: "casual", label: "Casual" },
          { value: "formal", label: "Formal" },
        ]}
      />
    </>
  )
}
