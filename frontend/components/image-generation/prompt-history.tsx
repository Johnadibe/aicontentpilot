"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { History, Star, Sparkles, Trash2 } from "lucide-react"

interface PromptHistoryProps {
  onSelectPrompt: (prompt: string) => void
}

interface PromptItem {
  text: string
  timestamp: number
  isFavorite: boolean
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const [history, setHistory] = useState<PromptItem[]>([])
  const [favorites, setFavorites] = useState<PromptItem[]>([])

  // Load history and favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("promptHistory")
      const savedFavorites = localStorage.getItem("promptFavorites")

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading prompt history:", error)
    }
  }, [])

  // Save history and favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("promptHistory", JSON.stringify(history))
    } catch (error) {
      console.error("Error saving prompt history:", error)
    }
  }, [history])

  useEffect(() => {
    try {
      localStorage.setItem("promptFavorites", JSON.stringify(favorites))
    } catch (error) {
      console.error("Error saving prompt favorites:", error)
    }
  }, [favorites])

  const toggleFavorite = (prompt: PromptItem) => {
    if (prompt.isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter((p) => p.text !== prompt.text))

      // Update in history
      setHistory(history.map((p) => (p.text === prompt.text ? { ...p, isFavorite: false } : p)))
    } else {
      // Add to favorites
      const newFavorite = { ...prompt, isFavorite: true }
      setFavorites([newFavorite, ...favorites])

      // Update in history
      setHistory(history.map((p) => (p.text === prompt.text ? { ...p, isFavorite: true } : p)))
    }
  }

  const clearHistory = () => {
    // Keep favorited items
    const favoritedItems = history.filter((p) => p.isFavorite)
    setHistory(favoritedItems)
  }

  const removePrompt = (prompt: PromptItem) => {
    setHistory(history.filter((p) => p.text !== prompt.text))
    if (prompt.isFavorite) {
      setFavorites(favorites.filter((p) => p.text !== prompt.text))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Prompts</h3>
              <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>
                <History className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            <ScrollArea className="h-[200px]">
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((prompt, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <p className="text-sm line-clamp-1">{prompt.text}</p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(prompt)} className="h-8 w-8">
                          <Star className="h-4 w-4" fill={prompt.isFavorite ? "currentColor" : "none"} />
                          <span className="sr-only">{prompt.isFavorite ? "Unfavorite" : "Favorite"}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectPrompt(prompt.text)}
                          className="h-8 w-8"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span className="sr-only">Use</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removePrompt(prompt)} className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
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
        <CardContent className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Favorite Prompts</h3>
            <ScrollArea className="h-[200px]">
              {favorites.length > 0 ? (
                <div className="space-y-2">
                  {favorites.map((prompt, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md border p-3">
                      <p className="text-sm line-clamp-1">{prompt.text}</p>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(prompt)} className="h-8 w-8">
                          <Star className="h-4 w-4" fill="currentColor" />
                          <span className="sr-only">Unfavorite</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectPrompt(prompt.text)}
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
    </div>
  )
}
