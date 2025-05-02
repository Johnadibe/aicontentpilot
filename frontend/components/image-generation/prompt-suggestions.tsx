"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles } from "lucide-react"

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void
}

const promptSuggestions = [
  {
    category: "Landscapes",
    prompts: [
      "A serene mountain landscape at sunset with reflections in a lake",
      "Lush tropical rainforest with a hidden waterfall",
      "Desert landscape with dramatic sand dunes and a starry night sky",
      "Foggy forest with sunbeams breaking through the trees",
      "Coastal cliffs with crashing waves during a storm",
    ],
  },
  {
    category: "Portraits",
    prompts: [
      "Professional headshot of a business person with neutral background",
      "Artistic portrait with dramatic side lighting",
      "Candid street photography style portrait in an urban setting",
      "Fantasy character portrait with elaborate costume and makeup",
      "Vintage-style portrait with sepia tones",
    ],
  },
  {
    category: "Abstract",
    prompts: [
      "Geometric abstract composition with vibrant colors",
      "Fluid art with swirling patterns and complementary colors",
      "Minimalist abstract design with simple shapes and negative space",
      "Glitch art with digital distortion effects",
      "Abstract expressionist composition with bold brushstrokes",
    ],
  },
  {
    category: "Product",
    prompts: [
      "Minimalist product photography on a white background",
      "Lifestyle product shot in a natural setting",
      "Product with splashing liquid for dynamic effect",
      "Flatlay arrangement of products with complementary props",
      "Product in use showing its functionality",
    ],
  },
]

export function PromptSuggestions({ onSelectPrompt }: PromptSuggestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Prompt Suggestions</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {promptSuggestions.map((category) => (
            <div key={category.category} className="space-y-3">
              <h4 className="font-medium text-sm">{category.category}</h4>
              <div className="space-y-2">
                {category.prompts.map((prompt, index) => (
                  <Card key={index} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="p-3 flex justify-between items-center">
                      <p className="text-sm">{prompt}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onSelectPrompt(prompt)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span className="sr-only">Use</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
