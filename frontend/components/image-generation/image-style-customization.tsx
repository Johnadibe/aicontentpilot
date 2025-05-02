"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HexColorPicker } from "react-colorful"
import { SunIcon, MoonIcon, CloudIcon, PaintbrushIcon, UploadIcon } from "lucide-react"

export type StyleSettings = {
  style: string
  mood: number
  colorPalette: string[]
  lighting: string
  composition: string
  texture: string
  referenceImageUrl?: string
  mixingStrength?: number
}

interface ImageStyleCustomizationProps {
  onChange: (settings: StyleSettings) => void
  initialSettings?: Partial<StyleSettings>
}

const visualStyles = [
  { id: "photorealistic", name: "Photorealistic" },
  { id: "cartoon", name: "Cartoon" },
  { id: "abstract", name: "Abstract" },
  { id: "3d", name: "3D Render" },
  { id: "painting", name: "Painting" },
  { id: "sketch", name: "Sketch" },
  { id: "pixel", name: "Pixel Art" },
  { id: "minimalist", name: "Minimalist" },
]

const lightingOptions = [
  { id: "natural", name: "Natural", icon: <SunIcon className="h-4 w-4" /> },
  { id: "studio", name: "Studio", icon: <SunIcon className="h-4 w-4" /> },
  { id: "dramatic", name: "Dramatic", icon: <MoonIcon className="h-4 w-4" /> },
  { id: "soft", name: "Soft", icon: <CloudIcon className="h-4 w-4" /> },
]

const compositionOptions = [
  { id: "centered", name: "Centered" },
  { id: "rule-of-thirds", name: "Rule of Thirds" },
  { id: "diagonal", name: "Diagonal" },
  { id: "symmetrical", name: "Symmetrical" },
  { id: "asymmetrical", name: "Asymmetrical" },
]

const textureOptions = [
  { id: "smooth", name: "Smooth" },
  { id: "rough", name: "Rough" },
  { id: "grainy", name: "Grainy" },
  { id: "metallic", name: "Metallic" },
  { id: "glossy", name: "Glossy" },
  { id: "matte", name: "Matte" },
]

const defaultColorPalette = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"]

export default function ImageStyleCustomization({ onChange, initialSettings }: ImageStyleCustomizationProps) {
  const [settings, setSettings] = useState<StyleSettings>({
    style: initialSettings?.style || "photorealistic",
    mood: initialSettings?.mood || 50,
    colorPalette: initialSettings?.colorPalette || defaultColorPalette,
    lighting: initialSettings?.lighting || "natural",
    composition: initialSettings?.composition || "centered",
    texture: initialSettings?.texture || "smooth",
    referenceImageUrl: initialSettings?.referenceImageUrl,
    mixingStrength: initialSettings?.mixingStrength || 50,
  })

  const [activeColorIndex, setActiveColorIndex] = useState(0)
  const [referenceImage, setReferenceImage] = useState<File | null>(null)

  const updateSettings = (newSettings: Partial<StyleSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    onChange(updated)
  }

  const updateColorPalette = (color: string) => {
    const newPalette = [...settings.colorPalette]
    newPalette[activeColorIndex] = color
    updateSettings({ colorPalette: newPalette })
  }

  const handleReferenceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReferenceImage(file)

      // Create a URL for the image
      const imageUrl = URL.createObjectURL(file)
      updateSettings({ referenceImageUrl: imageUrl })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <PaintbrushIcon className="mr-2 h-5 w-5" />
          Image Style Customization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="style">Visual Style</TabsTrigger>
            <TabsTrigger value="mood">Mood & Color</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-4">
            <div className="space-y-2">
              <Label>Visual Style</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {visualStyles.map((style) => (
                  <Button
                    key={style.id}
                    variant={settings.style === style.id ? "default" : "outline"}
                    onClick={() => updateSettings({ style: style.id })}
                    className="h-auto py-2 justify-start"
                  >
                    {style.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Texture</Label>
              <RadioGroup
                value={settings.texture}
                onValueChange={(value) => updateSettings({ texture: value })}
                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {textureOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`texture-${option.id}`} />
                    <Label htmlFor={`texture-${option.id}`}>{option.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="mood" className="space-y-4">
            <div className="space-y-2">
              <Label>Mood/Tone Adjustment</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Calm</span>
                <Slider
                  value={[settings.mood]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => updateSettings({ mood: value[0] })}
                  className="flex-1"
                />
                <span className="text-sm">Energetic</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color Palette</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {settings.colorPalette.map((color, index) => (
                  <div
                    key={index}
                    className={`h-8 w-8 rounded-full cursor-pointer ${activeColorIndex === index ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setActiveColorIndex(index)}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <HexColorPicker color={settings.colorPalette[activeColorIndex]} onChange={updateColorPalette} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lighting</Label>
              <RadioGroup
                value={settings.lighting}
                onValueChange={(value) => updateSettings({ lighting: value })}
                className="grid grid-cols-2 md:grid-cols-4 gap-2"
              >
                {lightingOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`lighting-${option.id}`} />
                    <Label htmlFor={`lighting-${option.id}`} className="flex items-center">
                      {option.icon}
                      <span className="ml-1">{option.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-4">
            <div className="space-y-2">
              <Label>Composition Layout</Label>
              <RadioGroup
                value={settings.composition}
                onValueChange={(value) => updateSettings({ composition: value })}
                className="grid grid-cols-1 gap-2"
              >
                {compositionOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={`composition-${option.id}`} />
                    <Label htmlFor={`composition-${option.id}`}>{option.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="reference" className="space-y-4">
            <div className="space-y-2">
              <Label>Style Reference Image</Label>
              <div className="grid gap-4">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 h-40">
                  {settings.referenceImageUrl ? (
                    <div className="relative w-full h-full">
                      <img
                        src={settings.referenceImageUrl || "/placeholder.svg"}
                        alt="Reference"
                        className="object-contain w-full h-full"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => {
                          setReferenceImage(null)
                          updateSettings({ referenceImageUrl: undefined })
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Upload a reference image</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="reference-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReferenceImageChange}
                />
                <Button variant="outline" onClick={() => document.getElementById("reference-image")?.click()}>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Reference Image
                </Button>
              </div>

              {settings.referenceImageUrl && (
                <div className="space-y-2 mt-4">
                  <Label>Style Mixing Strength</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Subtle</span>
                    <Slider
                      value={[settings.mixingStrength || 50]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateSettings({ mixingStrength: value[0] })}
                      className="flex-1"
                    />
                    <span className="text-sm">Strong</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
