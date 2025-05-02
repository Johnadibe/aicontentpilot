"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface PromptBuilderProps {
  onPromptChange: (prompt: string) => void
  initialPrompt?: string
}

const subjectSuggestions = [
  "landscape",
  "portrait",
  "still life",
  "architecture",
  "animal",
  "food",
  "product",
  "abstract",
]

const styleSuggestions = ["photorealistic", "cartoon", "3D render", "pixel art", "watercolor", "oil painting", "sketch"]

const moodSuggestions = ["happy", "sad", "dramatic", "mysterious", "energetic", "calm", "tense"]

export function PromptBuilder({ onPromptChange, initialPrompt = "" }: PromptBuilderProps) {
  const [subject, setSubject] = useState("")
  const [style, setStyle] = useState("")
  const [mood, setMood] = useState("")
  const [details, setDetails] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const newTags = [...selectedTags, tag]
      setSelectedTags(newTags)
      buildPrompt(newTags)
    }
  }

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag)
    setSelectedTags(newTags)
    buildPrompt(newTags)
  }

  const buildPrompt = (tags: string[] = selectedTags) => {
    let prompt = ""

    if (subject) prompt += subject
    if (style && !tags.includes(style)) prompt += prompt ? `, ${style} style` : style + " style"
    if (mood && !tags.includes(mood)) prompt += prompt ? `, ${mood} mood` : mood + " mood"

    // Add all selected tags that aren't already in the prompt
    tags.forEach((tag) => {
      if (tag !== subject && tag !== style && tag !== mood && !prompt.includes(tag)) {
        prompt += prompt ? `, ${tag}` : tag
      }
    })

    // Add additional details
    if (details) {
      prompt += prompt ? `. ${details}` : details
    }

    onPromptChange(prompt)
    return prompt
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Prompt Builder</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="What is the main subject of your image?"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              buildPrompt()
            }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {subjectSuggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => {
                  setSubject(suggestion)
                  buildPrompt()
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Style</label>
          <Input
            placeholder="What style should the image have?"
            value={style}
            onChange={(e) => {
              setStyle(e.target.value)
              buildPrompt()
            }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {styleSuggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => {
                  setStyle(suggestion)
                  buildPrompt()
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mood</label>
          <Input
            placeholder="What mood or feeling should the image convey?"
            value={mood}
            onChange={(e) => {
              setMood(e.target.value)
              buildPrompt()
            }}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {moodSuggestions.map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => {
                  setMood(suggestion)
                  buildPrompt()
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Details</label>
          <Textarea
            placeholder="Add any additional details or specifications"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value)
              buildPrompt()
            }}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Selected Tags</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedTags([])
                  buildPrompt([])
                }}
              >
                Clear All
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags selected</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    addTag(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement
                  if (input.value) {
                    addTag(input.value)
                    input.value = ""
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
