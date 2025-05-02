"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Grid, List } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageViewToggleProps {
    defaultView?: "grid" | "list"
    onChange?: (view: "grid" | "list") => void
    className?: string
    variant?: "toggle" | "buttons"
    disabled?: boolean
}

export function ImageViewToggle({
    defaultView = "grid",
    onChange,
    className,
    variant = "toggle",
    disabled = false,
}: ImageViewToggleProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get the current view from URL or use default
    const currentView = (searchParams.get("view") as "grid" | "list") || defaultView
    const [view, setView] = useState<"grid" | "list">(currentView)

    // Handle view change
    const handleViewChange = (newView: "grid" | "list") => {
        setView(newView)

        // Update URL with new view parameter
        const params = new URLSearchParams(searchParams.toString())
        params.set("view", newView)

        // Replace the current URL with the new one including the view parameter
        router.replace(`${pathname}?${params.toString()}`)

        // Call onChange callback if provided
        if (onChange) {
            onChange(newView)
        }
    }

    // Update state when URL changes
    useEffect(() => {
        const viewParam = searchParams.get("view") as "grid" | "list" | null
        if (viewParam && viewParam !== view) {
            setView(viewParam)
        }
    }, [searchParams, view])

    // Render toggle variant
    if (variant === "toggle") {
        return (
            <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => {
                    if (value) handleViewChange(value as "grid" | "list")
                }}
                className={cn("border rounded-md", className)}
                disabled={disabled}
            >
                <ToggleGroupItem value="grid" aria-label="Grid view" className="data-[state=on]:bg-muted">
                    <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-muted">
                    <List className="h-4 w-4" />
                </ToggleGroupItem>
            </ToggleGroup>
        )
    }

    // Default buttons variant
    return (
        <div className={cn("flex space-x-1", className)}>
            <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => handleViewChange("grid")}
                disabled={disabled}
            >
                <Grid className="h-4 w-4" />
            </Button>
            <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => handleViewChange("list")}
                disabled={disabled}
            >
                <List className="h-4 w-4" />
            </Button>
        </div>
    )
}