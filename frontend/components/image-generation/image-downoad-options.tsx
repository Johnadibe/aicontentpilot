"use client"

import { useState } from "react"
import { Download, Loader2, Copy, Share2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"

interface ImageDownloadOptionsProps {
    imageUrl: string
    imageName?: string
    imageId?: string
    onDownloadComplete?: () => void
    isGenerating?: boolean
    allowMultipleFormats?: boolean
    showAdvancedOptions?: boolean
    metadata?: {
        prompt?: string
        model?: string
        createdAt?: string
        width?: number
        height?: number
    }
}

export function ImageDownloadOptions({
    imageUrl,
    imageName = "generated-image",
    imageId,
    onDownloadComplete,
    isGenerating = false,
    allowMultipleFormats = true,
    showAdvancedOptions = true,
    metadata,
}: ImageDownloadOptionsProps) {
    const [isDownloading, setIsDownloading] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState<string>("png")
    const [quality, setQuality] = useState<number>(100)
    const [includeMetadata, setIncludeMetadata] = useState<boolean>(true)
    const [selectedSize, setSelectedSize] = useState<string>("original")
    const [isCopying, setIsCopying] = useState(false)
    const [isSharing, setIsSharing] = useState(false)

    const handleDownload = async () => {
        if (isGenerating || isDownloading) return

        setIsDownloading(true)
        try {
            // In a real implementation, you might want to call an API to convert the image format
            // For this example, we'll just simulate a download of the original image

            // Simulate API call for format conversion if needed
            const downloadUrl = imageUrl

            // Create a temporary link element
            const link = document.createElement("a")
            link.href = downloadUrl
            link.download = `${imageName}.${selectedFormat}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast({
                title: "Download complete",
                description: `Image downloaded as ${imageName}.${selectedFormat}`,
            })

            if (onDownloadComplete) {
                onDownloadComplete()
            }
        } catch (error) {
            console.error("Error downloading image:", error)
            toast({
                title: "Download failed",
                description: "There was an error downloading your image. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsDownloading(false)
        }
    }

    const handleCopyToClipboard = async () => {
        if (isGenerating || isCopying) return

        setIsCopying(true)
        try {
            // Fetch the image as a blob
            const response = await fetch(imageUrl)
            const blob = await response.blob()

            // Copy to clipboard using the Clipboard API
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ])

            toast({
                title: "Copied to clipboard",
                description: "Image copied to clipboard successfully",
            })
        } catch (error) {
            console.error("Error copying image to clipboard:", error)
            toast({
                title: "Copy failed",
                description: "There was an error copying the image. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsCopying(false)
        }
    }

    const handleShare = async () => {
        if (isGenerating || isSharing) return

        setIsSharing(true)
        try {
            if (navigator.share) {
                await navigator.share({
                    title: imageName,
                    text: "Check out this AI-generated image!",
                    url: imageUrl,
                })

                toast({
                    title: "Shared successfully",
                    description: "Image shared successfully",
                })
            } else {
                // Fallback for browsers that don't support the Web Share API
                await navigator.clipboard.writeText(imageUrl)
                toast({
                    title: "Link copied",
                    description: "Image URL copied to clipboard",
                })
            }
        } catch (error) {
            console.error("Error sharing image:", error)
            if (error instanceof Error && error.name !== "AbortError") {
                toast({
                    title: "Share failed",
                    description: "There was an error sharing the image. Please try again.",
                    variant: "destructive",
                })
            }
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="basic">Basic Options</TabsTrigger>
                        {showAdvancedOptions && <TabsTrigger value="advanced">Advanced Options</TabsTrigger>}
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                        {allowMultipleFormats && (
                            <div className="space-y-2">
                                <Label>Format</Label>
                                <RadioGroup
                                    defaultValue="png"
                                    value={selectedFormat}
                                    onValueChange={setSelectedFormat}
                                    className="grid grid-cols-4 gap-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="png" id="png" />
                                        <Label htmlFor="png">PNG</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="jpg" id="jpg" />
                                        <Label htmlFor="jpg">JPG</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="webp" id="webp" />
                                        <Label htmlFor="webp">WebP</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="svg" id="svg" />
                                        <Label htmlFor="svg">SVG</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button onClick={handleDownload} className="flex-1" disabled={isGenerating || isDownloading}>
                                {isDownloading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="mr-2 h-4 w-4" />
                                )}
                                {isDownloading ? "Downloading..." : "Download"}
                            </Button>

                            <Button variant="outline" onClick={handleCopyToClipboard} disabled={isGenerating || isCopying}>
                                {isCopying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
                                Copy
                            </Button>

                            <Button variant="outline" onClick={handleShare} disabled={isGenerating || isSharing}>
                                {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                                Share
                            </Button>
                        </div>
                    </TabsContent>

                    {showAdvancedOptions && (
                        <TabsContent value="advanced" className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="quality">Quality: {quality}%</Label>
                                </div>
                                <Slider
                                    id="quality"
                                    min={10}
                                    max={100}
                                    step={5}
                                    value={[quality]}
                                    onValueChange={(value) => setQuality(value[0])}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="size">Size</Label>
                                <Select value={selectedSize} onValueChange={setSelectedSize}>
                                    <SelectTrigger id="size">
                                        <SelectValue placeholder="Select size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="original">Original Size</SelectItem>
                                        <SelectItem value="large">Large (2048px)</SelectItem>
                                        <SelectItem value="medium">Medium (1024px)</SelectItem>
                                        <SelectItem value="small">Small (512px)</SelectItem>
                                        <SelectItem value="thumbnail">Thumbnail (256px)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="include-metadata" checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                                <div className="grid gap-1.5">
                                    <div className="flex items-center">
                                        <Label htmlFor="include-metadata" className="mr-2">
                                            Include metadata
                                        </Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-4 w-4 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Includes generation details in the image metadata</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>

                {metadata && includeMetadata && (
                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                        <h4 className="font-medium text-foreground mb-2">Image Details</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {metadata.prompt && (
                                <div>
                                    <span className="font-medium">Prompt:</span>{" "}
                                    {metadata.prompt.length > 30 ? `${metadata.prompt.substring(0, 30)}...` : metadata.prompt}
                                </div>
                            )}
                            {metadata.model && (
                                <div>
                                    <span className="font-medium">Model:</span> {metadata.model}
                                </div>
                            )}
                            {metadata.width && metadata.height && (
                                <div>
                                    <span className="font-medium">Dimensions:</span> {metadata.width}×{metadata.height}
                                </div>
                            )}
                            {metadata.createdAt && (
                                <div>
                                    <span className="font-medium">Created:</span> {new Date(metadata.createdAt).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}