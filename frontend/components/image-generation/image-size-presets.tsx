"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SizePreset {
  name: string
  width: number
  height: number
  description: string
}

interface AspectRatio {
  name: string
  value: number
}

interface ImageSizePresetsProps {
  onSizeSelected: (width: number, height: number) => void
  className?: string
  initialWidth?: number
  initialHeight?: number
}

const socialMediaPresets: SizePreset[] = [
  { name: "Instagram Post", width: 1080, height: 1080, description: "Square post for Instagram feed" },
  { name: "Instagram Story", width: 1080, height: 1920, description: "Vertical format for Instagram stories" },
  { name: "Instagram Reel", width: 1080, height: 1920, description: "Vertical format for Instagram reels" },
  { name: "Facebook Post", width: 1200, height: 630, description: "Rectangular post for Facebook feed" },
  { name: "Facebook Cover", width: 1640, height: 624, description: "Cover image for Facebook pages" },
  { name: "Twitter Post", width: 1200, height: 675, description: "Landscape format for Twitter feed" },
  { name: "Twitter Header", width: 1500, height: 500, description: "Header image for Twitter profiles" },
  { name: "LinkedIn Post", width: 1200, height: 627, description: "Rectangular post for LinkedIn feed" },
  { name: "LinkedIn Banner", width: 1584, height: 396, description: "Banner for LinkedIn profiles" },
  { name: "Pinterest Pin", width: 1000, height: 1500, description: "Vertical format for Pinterest" },
  { name: "YouTube Thumbnail", width: 1280, height: 720, description: "Thumbnail for YouTube videos" },
  { name: "YouTube Banner", width: 2560, height: 1440, description: "Banner for YouTube channels" },
]

const webPresets: SizePreset[] = [
  { name: "Blog Header", width: 1200, height: 600, description: "Wide header image for blog posts" },
  { name: "Website Banner", width: 1920, height: 1080, description: "Full-width banner for websites" },
  { name: "Hero Image", width: 1440, height: 600, description: "Hero section background" },
  { name: "Email Header", width: 600, height: 200, description: "Header image for email campaigns" },
  { name: "Thumbnail", width: 400, height: 300, description: "Small thumbnail for listings" },
  { name: "Favicon", width: 32, height: 32, description: "Website favicon (small)" },
  { name: "App Icon", width: 512, height: 512, description: "Icon for web applications" },
]

const printPresets: SizePreset[] = [
  { name: "Business Card", width: 1050, height: 600, description: 'Standard business card (3.5" × 2")' },
  { name: "Postcard", width: 1875, height: 1275, description: 'Standard postcard (6.25" × 4.25")' },
  { name: "Flyer", width: 2550, height: 3300, description: 'Standard flyer (8.5" × 11")' },
  { name: "Poster - Small", width: 2550, height: 3300, description: 'Small poster (8.5" × 11")' },
  { name: "Poster - Medium", width: 3300, height: 5100, description: 'Medium poster (11" × 17")' },
  { name: "Poster - Large", width: 5100, height: 7650, description: 'Large poster (17" × 25.5")' },
]

const aspectRatios: AspectRatio[] = [
  { name: "1:1 (Square)", value: 1 },
  { name: "4:3 (Standard)", value: 4 / 3 },
  { name: "16:9 (Widescreen)", value: 16 / 9 },
  { name: "3:2 (Classic)", value: 3 / 2 },
  { name: "9:16 (Portrait)", value: 9 / 16 },
  { name: "2:3 (Portrait)", value: 2 / 3 },
  { name: "3:4 (Portrait)", value: 3 / 4 },
  { name: "21:9 (Ultrawide)", value: 21 / 9 },
]

const customSizes = [
  { width: 256, height: 256 },
  { width: 512, height: 512 },
  { width: 1024, height: 1024 },
  { width: 1024, height: 576 },
  { width: 576, height: 1024 },
  { width: 1024, height: 1024 },
  { width: 1536, height: 1536 },
  { width: 2048, height: 2048 },
]

export function ImageSizePresets({
  onSizeSelected,
  className,
  initialWidth = 1024,
  initialHeight = 1024,
}: ImageSizePresetsProps) {
  const [width, setWidth] = useState<number>(initialWidth)
  const [height, setHeight] = useState<number>(initialHeight)
  const [openPreset, setOpenPreset] = useState(false)
  const [openRatio, setOpenRatio] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [selectedRatio, setSelectedRatio] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("social")

  const handleSizeChange = (width: number, height: number, presetName?: string) => {
    setWidth(width)
    setHeight(height)
    if (presetName) {
      setSelectedPreset(presetName)
      setSelectedRatio(null)
    }
    onSizeSelected(width, height)
  }

  const handleRatioChange = (ratio: number, name: string) => {
    setSelectedRatio(name)
    setSelectedPreset(null)

    // Maintain the larger dimension and adjust the smaller one
    if (width >= height) {
      const newHeight = Math.round(width / ratio)
      setHeight(newHeight)
      onSizeSelected(width, newHeight)
    } else {
      const newWidth = Math.round(height * ratio)
      setWidth(newWidth)
      onSizeSelected(newWidth, height)
    }
  }

  const handleCustomSizeClick = (width: number, height: number) => {
    setSelectedPreset(null)
    setSelectedRatio(null)
    setWidth(width)
    setHeight(height)
    onSizeSelected(width, height)
  }

  const handleManualInput = (dimension: "width" | "height", value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      if (dimension === "width") {
        setWidth(numValue)
        onSizeSelected(numValue, height)
      } else {
        setHeight(numValue)
        onSizeSelected(width, numValue)
      }
      setSelectedPreset(null)
      setSelectedRatio(null)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Tabs defaultValue="social" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="print">Print</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <input
                type="number"
                value={width}
                onChange={(e) => handleManualInput("width", e.target.value)}
                className="w-16 h-8 px-2 text-sm border rounded"
                min="1"
              />
              <span>×</span>
              <input
                type="number"
                value={height}
                onChange={(e) => handleManualInput("height", e.target.value)}
                className="w-16 h-8 px-2 text-sm border rounded"
                min="1"
              />
            </div>

            <Popover open={openRatio} onOpenChange={setOpenRatio}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                  {selectedRatio || "Ratio"}
                  <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <Command>
                  <CommandList>
                    <CommandEmpty>No ratio found.</CommandEmpty>
                    <CommandGroup>
                      {aspectRatios.map((ratio) => (
                        <CommandItem
                          key={ratio.name}
                          onSelect={() => {
                            handleRatioChange(ratio.value, ratio.name)
                            setOpenRatio(false)
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", selectedRatio === ratio.name ? "opacity-100" : "opacity-0")}
                          />
                          {ratio.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TabsContent value="social" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {socialMediaPresets.map((preset) => (
              <Card
                key={preset.name}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  selectedPreset === preset.name && "border-primary",
                )}
                onClick={() => handleSizeChange(preset.width, preset.height, preset.name)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">{preset.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {preset.width} × {preset.height}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="web" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {webPresets.map((preset) => (
              <Card
                key={preset.name}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  selectedPreset === preset.name && "border-primary",
                )}
                onClick={() => handleSizeChange(preset.width, preset.height, preset.name)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">{preset.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {preset.width} × {preset.height}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="print" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {printPresets.map((preset) => (
              <Card
                key={preset.name}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  selectedPreset === preset.name && "border-primary",
                )}
                onClick={() => handleSizeChange(preset.width, preset.height, preset.name)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">{preset.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {preset.width} × {preset.height}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="mt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {customSizes.map((size, index) => (
              <Card
                key={index}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  width === size.width &&
                  height === size.height &&
                  !selectedPreset &&
                  !selectedRatio &&
                  "border-primary",
                )}
                onClick={() => handleCustomSizeClick(size.width, size.height)}
              >
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <div className="text-sm font-medium">
                    {size.width} × {size.height}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {size.width === size.height ? "Square" : size.width > size.height ? "Landscape" : "Portrait"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Current size:{" "}
          <span className="font-medium">
            {width}×{height}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => {
              const temp = width
              setWidth(height)
              setHeight(temp)
              onSizeSelected(height, temp)
              setSelectedPreset(null)
              setSelectedRatio(null)
            }}
          >
            Swap Dimensions
          </Button>

          <Button variant="default" size="sm" onClick={() => onSizeSelected(width, height)}>
            Apply Size
          </Button>
        </div>
      </div>
    </div>
  )
}