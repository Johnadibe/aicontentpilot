"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Wand2, RotateCcw, Download, Undo, Redo, Crop, FlipHorizontal, FlipVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ImageFiltersProps {
    imageUrl: string
    onSave?: (filteredImageUrl: string) => void
    className?: string
}

interface FilterState {
    brightness: number
    contrast: number
    saturation: number
    hue: number
    blur: number
    grayscale: number
    sepia: number
    invert: number
    opacity: number
    sharpness: number
    temperature: number
    vignette: number
    noise: number
    pixelate: number
    rotation: number
    flipX: boolean
    flipY: boolean
    crop: {
        x: number
        y: number
        width: number
        height: number
    } | null
}

const DEFAULT_FILTERS: FilterState = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    opacity: 100,
    sharpness: 0,
    temperature: 0,
    vignette: 0,
    noise: 0,
    pixelate: 0,
    rotation: 0,
    flipX: false,
    flipY: false,
    crop: null,
}

interface FilterPreset {
    name: string
    icon?: React.ReactNode
    filters: Partial<FilterState>
}

const FILTER_PRESETS: FilterPreset[] = [
    {
        name: "Original",
        filters: { ...DEFAULT_FILTERS },
    },
    {
        name: "Enhance",
        filters: {
            brightness: 105,
            contrast: 110,
            saturation: 110,
            sharpness: 15,
        },
    },
    {
        name: "Vintage",
        filters: {
            brightness: 95,
            contrast: 90,
            saturation: 85,
            sepia: 30,
            vignette: 30,
        },
    },
    {
        name: "B&W",
        filters: {
            grayscale: 100,
        },
    },
    {
        name: "Warm",
        filters: {
            temperature: 20,
            saturation: 110,
        },
    },
    {
        name: "Cool",
        filters: {
            temperature: -20,
            saturation: 105,
        },
    },
    {
        name: "Dramatic",
        filters: {
            contrast: 130,
            brightness: 95,
            saturation: 110,
            vignette: 40,
        },
    },
    {
        name: "Faded",
        filters: {
            contrast: 80,
            brightness: 110,
            saturation: 80,
            opacity: 90,
        },
    },
]

export function ImageFilters({ imageUrl, onSave, className }: ImageFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS })
    const [history, setHistory] = useState<FilterState[]>([{ ...DEFAULT_FILTERS }])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [activeTab, setActiveTab] = useState("basic")
    const [isImageLoaded, setIsImageLoaded] = useState(false)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const cropCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isCropping, setIsCropping] = useState(false)
    const [cropStart, setCropStart] = useState({ x: 0, y: 0 })
    const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 })

    // Load image and apply filters
    useEffect(() => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imageUrl

        img.onload = () => {
            imageRef.current = img
            setIsImageLoaded(true)
            applyFilters()
        }
    }, [imageUrl])

    // Apply filters whenever they change
    useEffect(() => {
        if (isImageLoaded) {
            applyFilters()
        }
    }, [filters, isImageLoaded])

    // Apply all filters to the canvas
    const applyFilters = () => {
        const canvas = canvasRef.current
        const img = imageRef.current

        if (!canvas || !img) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        canvas.width = img.width
        canvas.height = img.height

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Apply rotation and flip
        ctx.save()

        // Move to center, rotate, then move back
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((filters.rotation * Math.PI) / 180)
        if (filters.flipX) ctx.scale(-1, 1)
        if (filters.flipY) ctx.scale(1, -1)
        ctx.translate(-canvas.width / 2, -canvas.height / 2)

        // Draw the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        ctx.restore()

        // Apply crop if set
        if (filters.crop) {
            const { x, y, width, height } = filters.crop
            const imageData = ctx.getImageData(x, y, width, height)

            // Resize canvas to crop dimensions
            canvas.width = width
            canvas.height = height

            // Clear and draw cropped portion
            ctx.clearRect(0, 0, width, height)
            ctx.putImageData(imageData, 0, 0)
        }

        // Apply CSS filters
        const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
      opacity(${filters.opacity}%)
    `

        // Apply CSS filters
        ctx.filter = filterString

        // Draw with filters
        if (!filters.crop) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        } else {
            // If already cropped, redraw with filters
            const tempCanvas = document.createElement("canvas")
            tempCanvas.width = canvas.width
            tempCanvas.height = canvas.height
            const tempCtx = tempCanvas.getContext("2d")
            if (tempCtx) {
                tempCtx.drawImage(canvas, 0, 0)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(tempCanvas, 0, 0)
            }
        }

        // Apply temperature (color balance)
        if (filters.temperature !== 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data

            for (let i = 0; i < data.length; i += 4) {
                // Adjust red and blue channels based on temperature
                if (filters.temperature > 0) {
                    // Warmer: increase red, decrease blue
                    data[i] = Math.min(255, data[i] + filters.temperature * 2)
                    data[i + 2] = Math.max(0, data[i + 2] - filters.temperature)
                } else {
                    // Cooler: increase blue, decrease red
                    data[i] = Math.max(0, data[i] + filters.temperature)
                    data[i + 2] = Math.min(255, data[i + 2] - filters.temperature * 2)
                }
            }

            ctx.putImageData(imageData, 0, 0)
        }

        // Apply vignette effect
        if (filters.vignette > 0) {
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2
            const radius = Math.max(centerX, centerY)
            const strength = filters.vignette / 100

            ctx.save()

            // Create radial gradient for vignette
            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius)

            gradient.addColorStop(0, "rgba(0,0,0,0)")
            gradient.addColorStop(1, `rgba(0,0,0,${strength})`)

            // Draw vignette
            ctx.fillStyle = gradient
            ctx.globalCompositeOperation = "multiply"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.restore()
        }

        // Apply noise
        if (filters.noise > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const intensity = (filters.noise / 100) * 50

            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * intensity
                data[i] = Math.min(255, Math.max(0, data[i] + noise))
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
            }

            ctx.putImageData(imageData, 0, 0)
        }

        // Apply pixelate
        if (filters.pixelate > 0) {
            const pixelSize = Math.max(1, Math.floor(filters.pixelate / 5))
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            for (let y = 0; y < canvas.height; y += pixelSize) {
                for (let x = 0; x < canvas.width; x += pixelSize) {
                    // Get the color of the first pixel in the block
                    const pixelIndex = (y * canvas.width + x) * 4
                    const r = imageData.data[pixelIndex]
                    const g = imageData.data[pixelIndex + 1]
                    const b = imageData.data[pixelIndex + 2]

                    // Fill the block with this color
                    ctx.fillStyle = `rgb(${r},${g},${b})`
                    ctx.fillRect(x, y, pixelSize, pixelSize)
                }
            }
        }

        // Apply sharpness
        if (filters.sharpness > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const width = canvas.width
            const height = canvas.height
            const strength = (filters.sharpness / 100) * 0.5

            // Create a copy of the image data
            const tempData = new Uint8ClampedArray(data)

            // Apply convolution for sharpening
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    const centerIdx = (y * width + x) * 4

                    for (let c = 0; c < 3; c++) {
                        const channel = centerIdx + c

                        // Apply sharpening kernel
                        const val =
                            5 * tempData[channel] -
                            tempData[channel - 4] - // left
                            tempData[channel + 4] - // right
                            tempData[channel - width * 4] - // top
                            tempData[channel + width * 4] // bottom

                        // Mix with original based on strength
                        data[channel] = Math.min(255, Math.max(0, tempData[channel] * (1 - strength) + val * strength))
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0)
        }
    }

    // Handle filter changes
    const updateFilter = (name: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [name]: value }
        setFilters(newFilters)

        // Add to history if this is a new state
        if (historyIndex < history.length - 1) {
            // If we're in the middle of the history, truncate
            setHistory(history.slice(0, historyIndex + 1).concat(newFilters))
            setHistoryIndex(historyIndex + 1)
        } else {
            setHistory([...history, newFilters])
            setHistoryIndex(history.length)
        }
    }

    // Reset all filters
    const resetFilters = () => {
        setFilters({ ...DEFAULT_FILTERS })
        setHistory([{ ...DEFAULT_FILTERS }])
        setHistoryIndex(0)
    }

    // Apply a preset
    const applyPreset = (preset: FilterPreset) => {
        const newFilters = { ...filters, ...preset.filters }
        setFilters(newFilters)
        setHistory([...history, newFilters])
        setHistoryIndex(history.length)
    }

    // Undo/Redo
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
            setFilters(history[historyIndex - 1])
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1)
            setFilters(history[historyIndex + 1])
        }
    }

    // Start crop mode
    const startCrop = () => {
        setIsCropping(true)

        // Create a temporary canvas for cropping
        const canvas = canvasRef.current
        const cropCanvas = cropCanvasRef.current

        if (!canvas || !cropCanvas) return

        cropCanvas.width = canvas.width
        cropCanvas.height = canvas.height

        const ctx = cropCanvas.getContext("2d")
        if (!ctx) return

        ctx.drawImage(canvas, 0, 0)
    }

    // Handle crop selection
    const handleCropMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isCropping) return

        const canvas = cropCanvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        setCropStart({ x, y })
        setCropEnd({ x, y })
    }

    const handleCropMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isCropping) return

        const canvas = cropCanvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        const x = (e.clientX - rect.left) * scaleX
        const y = (e.clientY - rect.top) * scaleY

        setCropEnd({ x, y })

        // Draw crop overlay
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Redraw original image
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(canvasRef.current!, 0, 0)

        // Draw semi-transparent overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Calculate crop rectangle
        const cropX = Math.min(cropStart.x, x)
        const cropY = Math.min(cropStart.y, y)
        const cropWidth = Math.abs(x - cropStart.x)
        const cropHeight = Math.abs(y - cropStart.y)

        // Clear the crop area
        ctx.clearRect(cropX, cropY, cropWidth, cropHeight)

        // Draw border around crop area
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.strokeRect(cropX, cropY, cropWidth, cropHeight)
    }

    const handleCropMouseUp = () => {
        if (!isCropping) return

        const canvas = canvasRef.current
        if (!canvas) return

        // Calculate crop dimensions
        const cropX = Math.min(cropStart.x, cropEnd.x)
        const cropY = Math.min(cropStart.y, cropEnd.y)
        const cropWidth = Math.abs(cropEnd.x - cropStart.x)
        const cropHeight = Math.abs(cropEnd.y - cropStart.y)

        // Apply crop if it's a valid selection
        if (cropWidth > 10 && cropHeight > 10) {
            updateFilter("crop", { x: cropX, y: cropY, width: cropWidth, height: cropHeight })
        }

        // Exit crop mode
        setIsCropping(false)
    }

    // Save the filtered image
    const saveImage = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const dataUrl = canvas.toDataURL("image/png")

        if (onSave) {
            onSave(dataUrl)
        } else {
            // Download the image if no save callback provided
            const link = document.createElement("a")
            link.download = "filtered-image.png"
            link.href = dataUrl
            link.click()
        }
    }

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Preview area */}
            <div className="relative bg-muted rounded-lg overflow-hidden">
                <div className="aspect-video w-full flex items-center justify-center">
                    {!isImageLoaded ? (
                        <div className="animate-pulse bg-muted-foreground/20 w-full h-full" />
                    ) : (
                        <>
                            <canvas
                                ref={canvasRef}
                                className="max-w-full max-h-full object-contain"
                                style={{ display: isCropping ? "none" : "block" }}
                            />

                            {isCropping && (
                                <canvas
                                    ref={cropCanvasRef}
                                    className="max-w-full max-h-full object-contain cursor-crosshair"
                                    onMouseDown={handleCropMouseDown}
                                    onMouseMove={handleCropMouseMove}
                                    onMouseUp={handleCropMouseUp}
                                    onMouseLeave={handleCropMouseUp}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Filter controls */}
            <div className="space-y-4">
                {/* Action buttons */}
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex === 0}>
                        <Undo className="h-4 w-4 mr-1" /> Undo
                    </Button>

                    <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                        <Redo className="h-4 w-4 mr-1" /> Redo
                    </Button>

                    <Button variant="outline" size="sm" onClick={resetFilters}>
                        <RotateCcw className="h-4 w-4 mr-1" /> Reset
                    </Button>

                    <Button variant="outline" size="sm" onClick={startCrop} disabled={isCropping}>
                        <Crop className="h-4 w-4 mr-1" /> Crop
                    </Button>

                    <Button variant="default" size="sm" onClick={saveImage} className="ml-auto">
                        <Download className="h-4 w-4 mr-1" /> Save
                    </Button>
                </div>

                {/* Filter presets */}
                <div className="space-y-2">
                    <Label>Presets</Label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {FILTER_PRESETS.map((preset) => (
                            <Button
                                key={preset.name}
                                variant="outline"
                                size="sm"
                                className="h-auto py-2 flex flex-col gap-1"
                                onClick={() => applyPreset(preset)}
                            >
                                {preset.icon || <Wand2 className="h-4 w-4" />}
                                <span className="text-xs">{preset.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Filter tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="color">Color</TabsTrigger>
                        <TabsTrigger value="effects">Effects</TabsTrigger>
                        <TabsTrigger value="transform">Transform</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="brightness">Brightness</Label>
                                    <span className="text-xs text-muted-foreground">{filters.brightness}%</span>
                                </div>
                                <Slider
                                    id="brightness"
                                    min={0}
                                    max={200}
                                    step={1}
                                    value={[filters.brightness]}
                                    onValueChange={(value) => updateFilter("brightness", value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="contrast">Contrast</Label>
                                    <span className="text-xs text-muted-foreground">{filters.contrast}%</span>
                                </div>
                                <Slider
                                    id="contrast"
                                    min={0}
                                    max={200}
                                    step={1}
                                    value={[filters.contrast]}
                                    onValueChange={(value) => updateFilter("contrast", value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="saturation">Saturation</Label>
                                    <span className="text-xs text-muted-foreground">{filters.saturation}%</span>
                                </div>
                                <Slider
                                    id="saturation"
                                    min={0}
                                    max={200}
                                    step={1}
                                    value={[filters.saturation]}
                                    onValueChange={(value) => updateFilter("saturation", value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="sharpness">Sharpness</Label>
                                    <span className="text-xs text-muted-foreground">{filters.sharpness}%</span>
                                </div>
                                <Slider
                                    id="sharpness"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[filters.sharpness]}
                                    onValueChange={(value) => updateFilter("sharpness", value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="opacity">Opacity</Label>
                                    <span className="text-xs text-muted-foreground">{filters.opacity}%</span>
                                </div>
                                <Slider
                                    id="opacity"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[filters.opacity]}
                                    onValueChange={(value) => updateFilter("opacity", value[0])}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="color" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="hue">Hue</Label>
                                    <span className="text-xs text-muted-foreground">{filters.hue}°</span>
                                </div>
                                <Slider
                                    id="hue"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={[filters.hue]}
                                    onValueChange={(value) => updateFilter("hue", value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="temperature">Temperature</Label>
                                    <span className="text-xs text-muted-foreground">
                                        {filters.temperature > 0 ? "+" : ""}
                                        {filters.temperature}
                                    </span>
                                </div>
                                <Slider
                                    id="temperature"
                                    min={-50}
                                    max={50}
                                    step={1}
                                    value={[filters.temperature]}
                                    onValueChange={(value) => updateFilter("temperature", value[0])}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="effects" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="blur">Blur</Label>
                                    <span className="text-xs text-muted-foreground">{filters.blur}px</span>
                                </div>
                                <Slider
                                    id="blur"
                                    min={0}
                                    max={20}
                                    step={0.5}
                                    value={[filters.blur]}
                                    onValueChange={(value) => updateFilter("blur", value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="vignette">Vignette</Label>
                                    <span className="text-xs text-muted-foreground">{filters.vignette}%</span>
                                </div>
                                <Slider
                                    id="vignette"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[filters.vignette]}
                                    onValueChange={(value) => updateFilter("vignette", value[0])}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="grayscale">Grayscale</Label>
                                        <span className="text-xs text-muted-foreground">{filters.grayscale}%</span>
                                    </div>
                                    <Slider
                                        id="grayscale"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[filters.grayscale]}
                                        onValueChange={(value) => updateFilter("grayscale", value[0])}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="sepia">Sepia</Label>
                                        <span className="text-xs text-muted-foreground">{filters.sepia}%</span>
                                    </div>
                                    <Slider
                                        id="sepia"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[filters.sepia]}
                                        onValueChange={(value) => updateFilter("sepia", value[0])}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="invert">Invert</Label>
                                        <span className="text-xs text-muted-foreground">{filters.invert}%</span>
                                    </div>
                                    <Slider
                                        id="invert"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[filters.invert]}
                                        onValueChange={(value) => updateFilter("invert", value[0])}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor="noise">Noise</Label>
                                        <span className="text-xs text-muted-foreground">{filters.noise}%</span>
                                    </div>
                                    <Slider
                                        id="noise"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[filters.noise]}
                                        onValueChange={(value) => updateFilter("noise", value[0])}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="pixelate">Pixelate</Label>
                                    <span className="text-xs text-muted-foreground">{filters.pixelate}%</span>
                                </div>
                                <Slider
                                    id="pixelate"
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[filters.pixelate]}
                                    onValueChange={(value) => updateFilter("pixelate", value[0])}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="transform" className="space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="rotation">Rotation</Label>
                                    <span className="text-xs text-muted-foreground">{filters.rotation}°</span>
                                </div>
                                <Slider
                                    id="rotation"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={[filters.rotation]}
                                    onValueChange={(value) => updateFilter("rotation", value[0])}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant={filters.flipX ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateFilter("flipX", !filters.flipX)}
                                >
                                    <FlipHorizontal className="h-4 w-4 mr-1" /> Flip Horizontal
                                </Button>

                                <Button
                                    variant={filters.flipY ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateFilter("flipY", !filters.flipY)}
                                >
                                    <FlipVertical className="h-4 w-4 mr-1" /> Flip Vertical
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}