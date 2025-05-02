"use client"

import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { Search, Filter, ImageIcon, Grid, List, ChevronLeft, ChevronRight, X, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Types for the image search results
interface ImageResult {
    id: string
    title: string
    url: string
    thumbnailUrl: string
    width: number
    height: number
    source: string
    sourceUrl: string
    tags: string[]
    license?: string
    author?: string
}

interface ImageSearchProps {
    onSelect?: (image: ImageResult) => void
    onMultiSelect?: (images: ImageResult[]) => void
    multiSelect?: boolean
    defaultQuery?: string
    className?: string
    defaultValue?: string;
}

export function ImageSearch({
    onSelect,
    onMultiSelect,
    multiSelect = false,
    defaultQuery = '',
    className,
    defaultValue
}: ImageSearchProps) {
    // Search state
    const [query, setQuery] = useState(defaultQuery)
    const [debouncedQuery] = useDebounce(query, 500)
    const [results, setResults] = useState<ImageResult[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedImages, setSelectedImages] = useState<ImageResult[]>([])
    const [previewImage, setPreviewImage] = useState<ImageResult | null>(null)

    // Filter state
    const [filters, setFilters] = useState({
        size: 'any',
        orientation: 'any',
        color: 'any',
        license: 'any',
        source: 'all',
        safeSearch: true,
        minWidth: 0,
        minHeight: 0
    })

    // Mock API call - replace with actual API integration
    const searchImages = async (searchQuery: string, pageNum: number, searchFilters: typeof filters) => {
        if (!searchQuery.trim()) {
            setResults([])
            setTotalPages(0)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // In a real implementation, this would be an API call
            // For now, we'll simulate a delay and return mock data
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock data generation
            const mockResults: ImageResult[] = Array.from({ length: 20 }, (_, i) => ({
                id: `img-${pageNum}-${i}`,
                title: `${searchQuery} image ${i + 1}`,
                url: `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(`${searchQuery} ${i + 1}`)}`,
                thumbnailUrl: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(`${searchQuery} ${i + 1}`)}`,
                width: 800,
                height: 600,
                source: ['Unsplash', 'Pexels', 'Pixabay'][Math.floor(Math.random() * 3)],
                sourceUrl: 'https://example.com/image',
                tags: [searchQuery, 'photo', 'stock', `tag-${i}`],
                license: 'Free to use',
                author: `Photographer ${i + 1}`
            }))

            setResults(mockResults)
            setTotalPages(5) // Mock total pages
        } catch (err) {
            console.error('Error searching for images:', err)
            setError('Failed to search for images. Please try again.')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    // Effect to trigger search when query or filters change
    useEffect(() => {
        if (debouncedQuery) {
            searchImages(debouncedQuery, page, filters)
        }
    }, [debouncedQuery, page, filters])

    // Handle image selection
    const handleImageSelect = (image: ImageResult) => {
        if (multiSelect) {
            const isSelected = selectedImages.some(img => img.id === image.id)

            if (isSelected) {
                setSelectedImages(selectedImages.filter(img => img.id !== image.id))
            } else {
                setSelectedImages([...selectedImages, image])
            }

            if (onMultiSelect) {
                onMultiSelect(isSelected
                    ? selectedImages.filter(img => img.id !== image.id)
                    : [...selectedImages, image]
                )
            }
        } else {
            if (onSelect) {
                onSelect(image)
            }
        }
    }

    // Handle image preview
    const handleImagePreview = (image: ImageResult) => {
        setPreviewImage(image)
    }

    // Clear all selections
    const clearSelections = () => {
        setSelectedImages([])
        if (onMultiSelect) {
            onMultiSelect([])
        }
    }

    // Pagination handlers
    const goToNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1)
        }
    }

    const goToPrevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    // Reset filters to default
    const resetFilters = () => {
        setFilters({
            size: 'any',
            orientation: 'any',
            color: 'any',
            license: 'any',
            source: 'all',
            safeSearch: true,
            minWidth: 0,
            minHeight: 0
        })
    }

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Search header */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for images..."
                        className="pl-8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="gap-1.5">
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">Filters</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Search Filters</SheetTitle>
                            <SheetDescription>
                                Refine your image search results
                            </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="size">Size</Label>
                                <Select
                                    value={filters.size}
                                    onValueChange={(value) => setFilters({ ...filters, size: value })}
                                >
                                    <SelectTrigger id="size">
                                        <SelectValue placeholder="Any size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any size</SelectItem>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="orientation">Orientation</Label>
                                <Select
                                    value={filters.orientation}
                                    onValueChange={(value) => setFilters({ ...filters, orientation: value })}
                                >
                                    <SelectTrigger id="orientation">
                                        <SelectValue placeholder="Any orientation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any orientation</SelectItem>
                                        <SelectItem value="landscape">Landscape</SelectItem>
                                        <SelectItem value="portrait">Portrait</SelectItem>
                                        <SelectItem value="square">Square</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <Select
                                    value={filters.color}
                                    onValueChange={(value) => setFilters({ ...filters, color: value })}
                                >
                                    <SelectTrigger id="color">
                                        <SelectValue placeholder="Any color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any color</SelectItem>
                                        <SelectItem value="red">Red</SelectItem>
                                        <SelectItem value="orange">Orange</SelectItem>
                                        <SelectItem value="yellow">Yellow</SelectItem>
                                        <SelectItem value="green">Green</SelectItem>
                                        <SelectItem value="blue">Blue</SelectItem>
                                        <SelectItem value="purple">Purple</SelectItem>
                                        <SelectItem value="pink">Pink</SelectItem>
                                        <SelectItem value="black">Black</SelectItem>
                                        <SelectItem value="white">White</SelectItem>
                                        <SelectItem value="gray">Gray</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="license">License</Label>
                                <Select
                                    value={filters.license}
                                    onValueChange={(value) => setFilters({ ...filters, license: value })}
                                >
                                    <SelectTrigger id="license">
                                        <SelectValue placeholder="Any license" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="any">Any license</SelectItem>
                                        <SelectItem value="free">Free to use</SelectItem>
                                        <SelectItem value="commercial">Commercial use</SelectItem>
                                        <SelectItem value="modify">Free to modify</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Select
                                    value={filters.source}
                                    onValueChange={(value) => setFilters({ ...filters, source: value })}
                                >
                                    <SelectTrigger id="source">
                                        <SelectValue placeholder="All sources" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All sources</SelectItem>
                                        <SelectItem value="unsplash">Unsplash</SelectItem>
                                        <SelectItem value="pexels">Pexels</SelectItem>
                                        <SelectItem value="pixabay">Pixabay</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="safe-search"
                                    checked={filters.safeSearch}
                                    onCheckedChange={(checked) => setFilters({ ...filters, safeSearch: checked })}
                                />
                                <Label htmlFor="safe-search">Safe search</Label>
                            </div>

                            <div className="space-y-2">
                                <Label>Minimum dimensions</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="min-width" className="text-xs">Width: {filters.minWidth}px</Label>
                                        <Slider
                                            id="min-width"
                                            min={0}
                                            max={4000}
                                            step={100}
                                            value={[filters.minWidth]}
                                            onValueChange={(value) => setFilters({ ...filters, minWidth: value[0] })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="min-height" className="text-xs">Height: {filters.minHeight}px</Label>
                                        <Slider
                                            id="min-height"
                                            min={0}
                                            max={4000}
                                            step={100}
                                            value={[filters.minHeight]}
                                            onValueChange={(value) => setFilters({ ...filters, minHeight: value[0] })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button onClick={resetFilters} variant="outline" className="w-full">
                                Reset Filters
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(viewMode === 'grid' ? 'bg-muted' : '')}
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={cn(viewMode === 'list' ? 'bg-muted' : '')}
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Selected images count */}
            {multiSelect && selectedImages.length > 0 && (
                <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <span className="text-sm font-medium">
                        {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearSelections}>
                        <X className="h-4 w-4 mr-1" /> Clear
                    </Button>
                </div>
            )}

            {/* Search results */}
            <div className="min-h-[300px]">
                {loading ? (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"
                    )}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="aspect-video w-full rounded-md" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-60 text-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">{error}</p>
                        <Button variant="outline" className="mt-4" onClick={() => searchImages(debouncedQuery, page, filters)}>
                            Try Again
                        </Button>
                    </div>
                ) : results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-60 text-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                            {debouncedQuery ? 'No images found. Try a different search term.' : 'Enter a search term to find images.'}
                        </p>
                    </div>
                ) : (
                    <div className={cn(
                        "grid gap-4",
                        viewMode === 'grid' ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1"
                    )}>
                        {results.map((image) => (
                            <Card
                                key={image.id}
                                className={cn(
                                    "overflow-hidden transition-all",
                                    multiSelect && selectedImages.some(img => img.id === image.id) && "ring-2 ring-primary",
                                    viewMode === 'list' && "flex"
                                )}
                            >
                                <CardContent className={cn(
                                    "p-0",
                                    viewMode === 'list' && "flex"
                                )}>
                                    <div
                                        className={cn(
                                            "relative group cursor-pointer",
                                            viewMode === 'list' ? "w-1/3" : "w-full"
                                        )}
                                        onClick={() => handleImagePreview(image)}
                                    >
                                        <img
                                            src={image.thumbnailUrl || "/placeholder.svg"}
                                            alt={image.title}
                                            className="w-full h-full object-cover aspect-video"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="secondary" size="sm">
                                                Preview
                                            </Button>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "p-3 space-y-2",
                                        viewMode === 'list' ? "w-2/3" : "w-full"
                                    )}>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-sm line-clamp-1">{image.title}</h3>
                                            {multiSelect ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => handleImageSelect(image)}
                                                >
                                                    <div className={cn(
                                                        "h-4 w-4 rounded border",
                                                        selectedImages.some(img => img.id === image.id)
                                                            ? "bg-primary border-primary"
                                                            : "border-input"
                                                    )}>
                                                        {selectedImages.some(img => img.id === image.id) && (
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary-foreground">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => handleImageSelect(image)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                    </svg>
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <span>{image.width} × {image.height}</span>
                                            <span className="mx-1">•</span>
                                            <span>{image.source}</span>
                                        </div>

                                        {viewMode === 'list' && (
                                            <div className="flex flex-wrap gap-1">
                                                {image.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {results.length > 0 && (
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={page === 1 || loading}
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>

                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={page === totalPages || loading}
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}

            {/* Image preview modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold">{previewImage.title}</h2>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewImage(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-auto p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="md:w-2/3">
                                    <div className="bg-muted rounded-md flex items-center justify-center">
                                        <img
                                            src={previewImage.url || "/placeholder.svg"}
                                            alt={previewImage.title}
                                            className="max-w-full max-h-[60vh] object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="md:w-1/3 space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Details</h3>
                                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                                            <dt className="text-muted-foreground">Dimensions:</dt>
                                            <dd>{previewImage.width} × {previewImage.height}</dd>

                                            <dt className="text-muted-foreground">Source:</dt>
                                            <dd>{previewImage.source}</dd>

                                            {previewImage.license && (
                                                <>
                                                    <dt className="text-muted-foreground">License:</dt>
                                                    <dd>{previewImage.license}</dd>
                                                </>
                                            )}

                                            {previewImage.author && (
                                                <>
                                                    <dt className="text-muted-foreground">Author:</dt>
                                                    <dd>{previewImage.author}</dd>
                                                </>
                                            )}
                                        </dl>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Tags</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {previewImage.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-2">
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                handleImageSelect(previewImage)
                                                setPreviewImage(null)
                                            }}
                                        >
                                            {multiSelect && selectedImages.some(img => img.id === previewImage.id)
                                                ? 'Remove from Selection'
                                                : 'Select Image'
                                            }
                                        </Button>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" className="w-full">
                                                <Download className="h-4 w-4 mr-1" /> Download
                                            </Button>

                                            <Button variant="outline" className="w-full" asChild>
                                                <a href={previewImage.sourceUrl} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-4 w-4 mr-1" /> Source
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}