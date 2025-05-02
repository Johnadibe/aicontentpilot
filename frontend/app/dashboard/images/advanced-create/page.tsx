"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ImageIcon, SaveIcon, RefreshCw } from "lucide-react"
import ImageStyleCustomization, { type StyleSettings } from "@/components/image-generation/image-style-customization"
import { ImageSizePresets } from "@/components/image-generation/image-size-presets"
import { PromptBuilder } from "@/components/image-generation/prompt-builder"
import { PromptHistory } from "@/components/image-generation/prompt-history"
import { PromptSuggestions } from "@/components/image-generation/prompt-suggestions"
import { ImageDownloadOptions } from "@/components/image-generation/image-downoad-options"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  width: number
  height: number
  createdAt: string
}

export default function AdvancedImageCreationPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    style: "photorealistic",
    mood: 50,
    colorPalette: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"],
    lighting: "natural",
    composition: "centered",
    texture: "smooth",
  })
  const [imageSize, setImageSize] = useState({ width: 1024, height: 1024 })
  const [numVariations, setNumVariations] = useState(4)
  const [activeTab, setActiveTab] = useState("prompt")

  const handleGenerateImages = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a text prompt to generate images.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Construct the enhanced prompt with style settings
      const enhancedPrompt = constructEnhancedPrompt(prompt, styleSettings)

      // Mock API call - in a real app, this would call your backend
      const mockGeneratedImages = Array.from({ length: numVariations }, (_, i) => ({
        id: `img-${Date.now()}-${i}`,
        url: `/placeholder.svg?height=${imageSize.height}&width=${imageSize.width}&query=${encodeURIComponent(prompt)}`,
        prompt: enhancedPrompt,
        width: imageSize.width,
        height: imageSize.height,
        createdAt: new Date().toISOString(),
      }))

      // In a real implementation, you would call your API:
      // const response = await fetch('/api/images/generate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     prompt: enhancedPrompt,
      //     width: imageSize.width,
      //     height: imageSize.height,
      //     numVariations,
      //     styleSettings,
      //   }),
      // })
      // const data = await response.json()

      setGeneratedImages(mockGeneratedImages)
      setSelectedImageIndex(0)
      setActiveTab("results")

      toast({
        title: "Images Generated",
        description: `Successfully generated ${numVariations} images.`,
      })
    } catch (error) {
      console.error("Error generating images:", error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const constructEnhancedPrompt = (basePrompt: string, style: StyleSettings): string => {
    let enhancedPrompt = basePrompt

    // Add style information
    enhancedPrompt += `, ${style.style} style`

    // Add mood
    if (style.mood < 30) enhancedPrompt += ", calm, serene atmosphere"
    else if (style.mood > 70) enhancedPrompt += ", energetic, dynamic atmosphere"

    // Add lighting
    enhancedPrompt += `, ${style.lighting} lighting`

    // Add composition
    enhancedPrompt += `, ${style.composition} composition`

    // Add texture
    enhancedPrompt += `, ${style.texture} texture`

    return enhancedPrompt
  }

  const handleSaveImage = async () => {
    if (selectedImageIndex === null) return

    const selectedImage = generatedImages[selectedImageIndex]

    try {
      // In a real implementation, you would call your API:
      // await fetch('/api/images', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     url: selectedImage.url,
      //     prompt: selectedImage.prompt,
      //     width: selectedImage.width,
      //     height: selectedImage.height,
      //   }),
      // })

      toast({
        title: "Image Saved",
        description: "The image has been saved to your library.",
      })

      // Navigate to the images library
      router.push("/dashboard/images")
    } catch (error) {
      console.error("Error saving image:", error)
      toast({
        title: "Save Failed",
        description: "There was an error saving your image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePromptUpdate = (newPrompt: string) => {
    setPrompt(newPrompt)
  }

  const handleSizeUpdate = (width: number, height: number) => {
    setImageSize({ width, height })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Image Generation</h1>
          <p className="text-muted-foreground">Create custom AI-generated images with advanced controls</p>
        </div>
        <Button onClick={() => router.push("/dashboard/images")}>Back to Image Library</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="prompt">Create & Customize</TabsTrigger>
          <TabsTrigger value="results" disabled={generatedImages.length === 0}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5" />
                    Image Prompt
                  </CardTitle>
                  <CardDescription>Describe the image you want to generate in detail</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="A serene mountain landscape with a lake reflecting the sunset, pine trees in the foreground..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={handleGenerateImages} disabled={isGenerating || !prompt.trim()} className="flex-1">
                      {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Generate {numVariations} Images
                    </Button>
                    <Select
                      value={numVariations.toString()}
                      onValueChange={(value) => setNumVariations(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Number of variations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Variation</SelectItem>
                        <SelectItem value="2">2 Variations</SelectItem>
                        <SelectItem value="4">4 Variations</SelectItem>
                        <SelectItem value="8">8 Variations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <PromptBuilder onPromptChange={handlePromptUpdate} />

              <ImageStyleCustomization onChange={setStyleSettings} initialSettings={styleSettings} />
            </div>

            <div className="space-y-6">
              <ImageSizePresets onSizeSelected={handleSizeUpdate} />

              <PromptSuggestions onSelectPrompt={handlePromptUpdate} />

              <PromptHistory onSelectPrompt={handlePromptUpdate} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Images</CardTitle>
                    <CardDescription>Select an image to view and download</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {generatedImages.map((image, index) => (
                        <div
                          key={image.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? "border-primary" : "border-transparent"
                            }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={image.url || "/placeholder.svg"}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-auto aspect-square object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedImageIndex !== null && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Image</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <img
                        src={generatedImages[selectedImageIndex].url || "/placeholder.svg"}
                        alt="Selected generated image"
                        className="max-w-full max-h-[500px] object-contain rounded-lg"
                      />

                      <div className="w-full mt-4 flex flex-wrap gap-2">
                        <Button onClick={handleSaveImage} className="flex-1">
                          <SaveIcon className="mr-2 h-4 w-4" />
                          Save to Library
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setActiveTab("prompt")
                            setPrompt(generatedImages[selectedImageIndex].prompt)
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refine & Regenerate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                {selectedImageIndex !== null && (
                  <>
                    <ImageDownloadOptions imageUrl={generatedImages[selectedImageIndex].url} />

                    <Card>
                      <CardHeader>
                        <CardTitle>Image Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Prompt</Label>
                          <p className="text-sm mt-1">{generatedImages[selectedImageIndex].prompt}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Width</Label>
                            <p className="text-sm mt-1">{generatedImages[selectedImageIndex].width}px</p>
                          </div>
                          <div>
                            <Label>Height</Label>
                            <p className="text-sm mt-1">{generatedImages[selectedImageIndex].height}px</p>
                          </div>
                        </div>
                        <div>
                          <Label>Created</Label>
                          <p className="text-sm mt-1">
                            {new Date(generatedImages[selectedImageIndex].createdAt).toLocaleString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
