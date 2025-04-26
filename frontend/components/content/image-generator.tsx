"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, Save, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/dashboard/header"
import { generateImage } from "@/lib/api/fastapi"
import Image from "next/image"

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  negativePrompt: z.string().optional(),
  style: z.string(),
  size: z.string(),
  quality: z.string(),
})

export function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generate")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      negativePrompt: "",
      style: "natural",
      size: "1024x1024",
      quality: "standard",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    try {
      // In a real app, this would call your backend API
      const result = await generateImage(values.prompt, {
        negativePrompt: values.negativePrompt,
        style: values.style,
        size: values.size,
        quality: values.quality,
      })

      setGeneratedImage(result.url)
      setActiveTab("preview")

      toast({
        title: "Image generated successfully",
        description: "Your image is ready to view and download.",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error generating image",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const regenerateImage = async () => {
    setIsGenerating(true)
    try {
      const values = form.getValues()
      const result = await generateImage(values.prompt, {
        negativePrompt: values.negativePrompt,
        style: values.style,
        size: values.size,
        quality: values.quality,
      })

      setGeneratedImage(result.url)

      toast({
        title: "Image regenerated",
        description: "Your image has been regenerated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error regenerating image",
        description: "There was an error regenerating your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = generatedImage
    link.download = `ai-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <DashboardHeader heading="AI Image Generator" text="Create stunning images with AI" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedImage}>
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generate" className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Prompt</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the image you want to generate in detail..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific and detailed about what you want to see in the image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="negativePrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Negative Prompt (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what you don't want to see in the image..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify elements you want to exclude from the generated image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="natural">Natural</SelectItem>
                              <SelectItem value="vivid">Vivid</SelectItem>
                              <SelectItem value="cinematic">Cinematic</SelectItem>
                              <SelectItem value="anime">Anime</SelectItem>
                              <SelectItem value="digital-art">Digital Art</SelectItem>
                              <SelectItem value="photographic">Photographic</SelectItem>
                              <SelectItem value="cartoon">Cartoon</SelectItem>
                              <SelectItem value="3d-render">3D Render</SelectItem>
                              <SelectItem value="pixel-art">Pixel Art</SelectItem>
                              <SelectItem value="oil-painting">Oil Painting</SelectItem>
                              <SelectItem value="watercolor">Watercolor</SelectItem>
                              <SelectItem value="sketch">Sketch</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Select the artistic style for your image</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select image size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                              <SelectItem value="1024x1792">Portrait (1024x1792)</SelectItem>
                              <SelectItem value="1792x1024">Landscape (1792x1024)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Select the dimensions of your image</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image Quality</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select image quality" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="hd">HD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Select the quality of your image</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-primary" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Image"
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="preview" className="py-4">
            {generatedImage ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 flex justify-center">
                    <div className="relative overflow-hidden rounded-lg border shadow-md">
                      <Image
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated AI image"
                        width={1024}
                        height={1024}
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("generate")}>
                    Back to Generator
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" onClick={regenerateImage} disabled={isGenerating}>
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Regenerate
                    </Button>
                    <Button variant="outline" onClick={downloadImage}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button className="gradient-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Save to Library
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No image generated yet. Go to the Generate tab to create an image.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  )
}
