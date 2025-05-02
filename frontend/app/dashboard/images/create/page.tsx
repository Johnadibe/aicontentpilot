"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles, History, Star } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import { generateImage } from "@/lib/api-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const imageFormSchema = z.object({
  prompt: z.string().min(10, {
    message: "Prompt must be at least 10 characters.",
  }),
  width: z.number().min(256).max(1024),
  height: z.number().min(256).max(1024),
  numImages: z.number().min(1).max(4),
  tags: z.string().optional(),
  style: z.string().default("photorealistic"),
  mood: z.string().default("neutral"),
  colorPalette: z.string().optional(),
  lighting: z.string().default("natural"),
  composition: z.string().optional(),
  format: z.string().default("png"),
  enhancePrompt: z.boolean().default(true),
})

type ImageFormValues = z.infer<typeof imageFormSchema>

const styles = [
  { value: "photorealistic", label: "Photorealistic" },
  { value: "cartoon", label: "Cartoon" },
  { value: "3d", label: "3D Render" },
  { value: "pixel", label: "Pixel Art" },
  { value: "abstract", label: "Abstract" },
  { value: "sketch", label: "Sketch" },
  { value: "painting", label: "Painting" },
  { value: "watercolor", label: "Watercolor" },
  { value: "digital", label: "Digital Art" },
]

const moods = [
  { value: "neutral", label: "Neutral" },
  { value: "happy", label: "Happy" },
  { value: "sad", label: "Sad" },
  { value: "dramatic", label: "Dramatic" },
  { value: "mysterious", label: "Mysterious" },
  { value: "energetic", label: "Energetic" },
  { value: "calm", label: "Calm" },
  { value: "tense", label: "Tense" },
]

const lightingOptions = [
  { value: "natural", label: "Natural" },
  { value: "studio", label: "Studio" },
  { value: "dramatic", label: "Dramatic" },
  { value: "soft", label: "Soft" },
  { value: "harsh", label: "Harsh" },
  { value: "backlit", label: "Backlit" },
  { value: "night", label: "Night" },
  { value: "golden-hour", label: "Golden Hour" },
]

const colorPalettes = [
  { value: "vibrant", label: "Vibrant" },
  { value: "muted", label: "Muted" },
  { value: "monochrome", label: "Monochrome" },
  { value: "pastel", label: "Pastel" },
  { value: "warm", label: "Warm" },
  { value: "cool", label: "Cool" },
  { value: "neon", label: "Neon" },
  { value: "earthy", label: "Earthy" },
]

const compositions = [
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "closeup", label: "Close-up" },
  { value: "wide-angle", label: "Wide Angle" },
  { value: "overhead", label: "Overhead" },
  { value: "symmetrical", label: "Symmetrical" },
  { value: "rule-of-thirds", label: "Rule of Thirds" },
  { value: "minimalist", label: "Minimalist" },
]

const formats = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "webp", label: "WebP" },
]

const sizePresets = [
  { name: "Instagram Post", width: 1080, height: 1080 },
  { name: "Instagram Story", width: 1080, height: 1920 },
  { name: "Twitter Post", width: 1200, height: 675 },
  { name: "Facebook Post", width: 1200, height: 630 },
  { name: "LinkedIn Post", width: 1200, height: 627 },
  { name: "Pinterest Pin", width: 1000, height: 1500 },
  { name: "YouTube Thumbnail", width: 1280, height: 720 },
  { name: "Blog Header", width: 1200, height: 600 },
]

const recentPrompts = [
  "A serene mountain landscape at sunset with reflections in a lake",
  "Futuristic city skyline with flying vehicles and neon lights",
  "Abstract geometric patterns in vibrant colors",
  "Vintage botanical illustration of exotic flowers",
]

const initialFavoritePrompts = [
  "Cyberpunk cityscape at night with rain and neon reflections",
  "Minimalist product photography on a white background",
]

export default function CreateImagePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("basic")
  const [promptHistory, setPromptHistory] = useState<string[]>(recentPrompts)
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>(initialFavoritePrompts)
  const [selectedPrompt, setSelectedPrompt] = useState<string>("")

  const form = useForm<ImageFormValues>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      width: 1024,
      height: 1024,
      numImages: 1,
      tags: "",
      style: "photorealistic",
      mood: "neutral",
      lighting: "natural",
      format: "png",
      enhancePrompt: true,
    },
  })

  const enhancePrompt = (prompt: string, style: string, mood: string, lighting: string): string => {
    if (!form.getValues().enhancePrompt) return prompt

    let enhancedPrompt = prompt

    // Add style if not already mentioned
    if (!prompt.toLowerCase().includes(style.toLowerCase())) {
      enhancedPrompt += `, ${style} style`
    }

    // Add mood if not already mentioned
    if (!prompt.toLowerCase().includes(mood.toLowerCase()) && mood !== "neutral") {
      enhancedPrompt += `, ${mood} mood`
    }

    // Add lighting if not already mentioned
    if (!prompt.toLowerCase().includes(lighting.toLowerCase()) && lighting !== "natural") {
      enhancedPrompt += `, ${lighting} lighting`
    }

    return enhancedPrompt
  }

  async function onSubmit(data: ImageFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedImages([])

      // Save to prompt history
      if (!promptHistory.includes(data.prompt)) {
        setPromptHistory([data.prompt, ...promptHistory].slice(0, 10))
      }

      // Convert comma-separated tags to array
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Enhance the prompt if enabled
      const finalPrompt = enhancePrompt(data.prompt, data.style, data.mood, data.lighting)

      // Generate images using AI
      const result = await generateImage({
        prompt: finalPrompt,
        width: data.width,
        height: data.height,
        numImages: data.numImages,
        style: data.style,
        mood: data.mood,
        colorPalette: data.colorPalette,
        lighting: data.lighting,
        composition: data.composition,
        format: data.format,
      })

      // Set the generated images
      setGeneratedImages(result.images)

      // Save to database (for each image)
      for (const imageUrl of result.images) {
        const response = await fetch("/api/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: data.prompt,
            url: imageUrl,
            width: data.width,
            height: data.height,
            format: data.format,
            tags: tagsArray,
            metadata: {
              style: data.style,
              mood: data.mood,
              colorPalette: data.colorPalette,
              lighting: data.lighting,
              composition: data.composition,
              enhancedPrompt: finalPrompt !== data.prompt ? finalPrompt : undefined,
            },
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || "Failed to save image")
        }
      }

      toast({
        title: "Images generated",
        description: `Successfully generated ${result.images.length} image(s).`,
      })
    } catch (error) {
      console.error("Error generating images:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate images",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFavorite = (prompt: string) => {
    if (favoritePrompts.includes(prompt)) {
      setFavoritePrompts(favoritePrompts.filter((p) => p !== prompt))
    } else {
      setFavoritePrompts([prompt, ...favoritePrompts])
    }
  }

  const applyPreset = (width: number, height: number) => {
    form.setValue("width", width)
    form.setValue("height", height)
  }

  const handleUsePrompt = (prompt: string) => {
    form.setValue("prompt", prompt)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Create Images" text="Generate images using AI." />
      <div className="grid gap-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="style">Style & Composition</TabsTrigger>
            <TabsTrigger value="history">History & Favorites</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="basic" className="space-y-6">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the image you want to generate..."
                          className="min-h-32 resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Be detailed and specific about what you want in the image. Include style, mood, colors, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider
                            min={256}
                            max={1024}
                            step={64}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>Select the width of the generated image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height: {field.value}px</FormLabel>
                        <FormControl>
                          <Slider
                            min={256}
                            max={1024}
                            step={64}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>Select the height of the generated image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="numImages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Images: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={4}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </FormControl>
                        <FormDescription>Select how many images to generate.</FormDescription>
                        <FormMessage />
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
                        <Input placeholder="art, landscape, portrait (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>Add tags to help organize your images (comma separated).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Size Presets</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {sizePresets.map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            className="h-auto py-2 px-3 justify-start"
                            onClick={() => applyPreset(preset.width, preset.height)}
                            type="button"
                          >
                            <div className="text-left">
                              <div className="font-medium">{preset.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {preset.width}×{preset.height}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the file format for your generated images.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enhancePrompt"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enhance Prompt</FormLabel>
                        <FormDescription>Automatically enhance your prompt with style and mood details</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="style" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visual Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {styles.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the visual style for your image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mood/Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select mood" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {moods.map((mood) => (
                              <SelectItem key={mood.value} value={mood.value}>
                                {mood.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Set the emotional tone of the image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="colorPalette"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Palette</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select color palette" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorPalettes.map((palette) => (
                              <SelectItem key={palette.value} value={palette.value}>
                                {palette.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose the color scheme for your image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lighting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lighting</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lighting" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lightingOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Set the lighting style for your image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="composition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Composition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select composition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {compositions.map((comp) => (
                            <SelectItem key={comp.value} value={comp.value}>
                              {comp.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the compositional layout for your image.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Recent Prompts</h3>
                        <Button variant="ghost" size="sm" disabled={promptHistory.length === 0}>
                          <History className="mr-2 h-4 w-4" />
                          Clear
                        </Button>
                      </div>
                      <ScrollArea className="h-[200px]">
                        {promptHistory.length > 0 ? (
                          <div className="space-y-2">
                            {promptHistory.map((prompt, index) => (
                              <div key={index} className="flex items-center justify-between rounded-md border p-3">
                                <p className="text-sm line-clamp-1">{prompt}</p>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleFavorite(prompt)}
                                    className="h-8 w-8"
                                  >
                                    <Star
                                      className="h-4 w-4"
                                      fill={favoritePrompts.includes(prompt) ? "currentColor" : "none"}
                                    />
                                    <span className="sr-only">Favorite</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUsePrompt(prompt)}
                                    className="h-8 w-8"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                    <span className="sr-only">Use</span>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-8">No prompt history yet</p>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Favorite Prompts</h3>
                      <ScrollArea className="h-[200px]">
                        {favoritePrompts.length > 0 ? (
                          <div className="space-y-2">
                            {favoritePrompts.map((prompt, index) => (
                              <div key={index} className="flex items-center justify-between rounded-md border p-3">
                                <p className="text-sm line-clamp-1">{prompt}</p>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleFavorite(prompt)}
                                    className="h-8 w-8"
                                  >
                                    <Star className="h-4 w-4" fill="currentColor" />
                                    <span className="sr-only">Unfavorite</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUsePrompt(prompt)}
                                    className="h-8 w-8"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                    <span className="sr-only">Use</span>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted-foreground py-8">No favorite prompts yet</p>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Images"
                )}
              </Button>
            </form>
          </Form>
        </Tabs>

        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Generated Images</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="overflow-hidden rounded-lg border bg-card">
                  <div className="relative aspect-square">
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">
                        {form.getValues().width}×{form.getValues().height}
                      </Badge>
                      <Badge variant="outline">{form.getValues().style}</Badge>
                      {form.getValues().mood !== "neutral" && <Badge variant="outline">{form.getValues().mood}</Badge>}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => window.open(imageUrl, "_blank")}>
                        Open Full Size
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Download</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(imageUrl, "_blank")}>
                            Original Size
                          </DropdownMenuItem>
                          <DropdownMenuItem>PNG Format</DropdownMenuItem>
                          <DropdownMenuItem>JPG Format</DropdownMenuItem>
                          <DropdownMenuItem>WebP Format</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
