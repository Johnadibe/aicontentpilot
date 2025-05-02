"use client"

import type React from "react"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Star, Eye, Clock, ArrowDownAZ, ArrowUpAZ } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface SortOption {
    value: string
    label: string
    icon: React.ReactNode
    description?: string
}

interface ImageSortingProps {
    defaultValue?: string
    onChange?: (value: string) => void
    className?: string
    variant?: "select" | "dropdown" | "buttons"
    showLabel?: boolean
    size?: "default" | "sm"
    disabled?: boolean
}

export function ImageSorting({
    defaultValue = "newest",
    onChange,
    className,
    variant = "select",
    showLabel = false,
    size = "default",
    disabled = false,
}: ImageSortingProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get the current sort value from URL or use default
    const currentSort = searchParams.get("sort") || defaultValue
    const [value, setValue] = useState(currentSort)

    // Sort options with icons
    const sortOptions: SortOption[] = [
        {
            value: "newest",
            label: "Newest first",
            icon: <Calendar className="h-4 w-4 mr-2" />,
            description: "Sort by creation date (newest first)",
        },
        {
            value: "oldest",
            label: "Oldest first",
            icon: <Clock className="h-4 w-4 mr-2" />,
            description: "Sort by creation date (oldest first)",
        },
        {
            value: "popular",
            label: "Most popular",
            icon: <Star className="h-4 w-4 mr-2" />,
            description: "Sort by popularity",
        },
        {
            value: "views",
            label: "Most viewed",
            icon: <Eye className="h-4 w-4 mr-2" />,
            description: "Sort by view count",
        },
        {
            value: "a-z",
            label: "Name (A-Z)",
            icon: <ArrowDownAZ className="h-4 w-4 mr-2" />,
            description: "Sort alphabetically (A-Z)",
        },
        {
            value: "z-a",
            label: "Name (Z-A)",
            icon: <ArrowUpAZ className="h-4 w-4 mr-2" />,
            description: "Sort alphabetically (Z-A)",
        },
    ]

    // Handle sort change
    const handleSortChange = (newValue: string) => {
        setValue(newValue)

        // Update URL with new sort parameter
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", newValue)

        // Replace the current URL with the new one including the sort parameter
        router.replace(`${pathname}?${params.toString()}`)

        // Call onChange callback if provided
        if (onChange) {
            onChange(newValue)
        }
    }

    // Update state when URL changes
    useEffect(() => {
        const sortParam = searchParams.get("sort")
        if (sortParam && sortParam !== value) {
            setValue(sortParam)
        }
    }, [searchParams, value])

    // Find the current sort option
    const currentSortOption = sortOptions.find((option) => option.value === value) || sortOptions[0]

    // Render different variants
    if (variant === "dropdown") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size={size}
                        className={cn("flex items-center gap-2", className)}
                        disabled={disabled}
                    >
                        {currentSortOption.icon}
                        {showLabel && <span className="mr-1">Sort:</span>}
                        <span>{currentSortOption.label}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sortOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={cn("flex items-center cursor-pointer", value === option.value && "bg-accent font-medium")}
                        >
                            {option.icon}
                            <div className="flex flex-col">
                                <span>{option.label}</span>
                                {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    if (variant === "buttons") {
        return (
            <div className={cn("flex flex-wrap gap-2", className)}>
                {showLabel && <span className="text-sm font-medium mr-2 self-center">Sort by:</span>}
                {sortOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant={value === option.value ? "default" : "outline"}
                        size={size}
                        onClick={() => handleSortChange(option.value)}
                        className="flex items-center gap-2"
                        disabled={disabled}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                    </Button>
                ))}
            </div>
        )
    }

    // Default select variant
    return (
        <div className={cn("flex items-center", className)}>
            {showLabel && <span className="text-sm font-medium mr-2">Sort by:</span>}
            <Select value={value} onValueChange={handleSortChange} disabled={disabled}>
                <SelectTrigger className={cn("w-[180px]", size === "sm" && "h-8 text-xs rounded-md")}>
                    <SelectValue placeholder="Select a sort option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Sort options</SelectLabel>
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center">
                                    {option.icon}
                                    <span>{option.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}