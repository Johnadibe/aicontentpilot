"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ImageStyleSelectorProps {
  onStyleSelect: (style: string) => void
  selectedStyle?: string
}

const styles = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "Highly detailed images that look like photographs",
    image: "/placeholder.svg?key=z1h5y",
  },
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Stylized cartoon illustrations with bold outlines",
    image: "/placeholder.svg?key=7bplm",
  },
  {
    id: "3d",
    name: "3D Render",
    description: "Computer-generated 3D rendered images",
    image: "/placeholder.svg?key=kirm4",
  },
  {
    id: "pixel",
    name: "Pixel Art",
    description: "Retro pixel-based art style",
    image: "/placeholder.svg?key=hnevg",
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Non-representational artistic compositions",
    image: "/placeholder.svg?key=1wrs1",
  },
  {
    id: "sketch",
    name: "Sketch",
    description: "Hand-drawn sketch appearance",
    image: "/placeholder.svg?key=svkdw",
  },
  {
    id: "painting",
    name: "Painting",
    description: "Traditional painting styles",
    image: "/placeholder.svg?key=sms6w",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft watercolor painting effect",
    image: "/placeholder.svg?key=soqun",
  },
  {
    id: "digital",
    name: "Digital Art",
    description: "Modern digital illustration style",
    image: "/placeholder.svg?key=rcsat",
  },
]

export function ImageStyleSelector({ onStyleSelect, selectedStyle = "photorealistic" }: ImageStyleSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Visual Style</h3>
      <ScrollArea className="h-[300px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {styles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedStyle === style.id ? "border-2 border-primary" : ""
              }`}
              onClick={() => onStyleSelect(style.id)}
            >
              <CardContent className="p-4 flex items-center space-x-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image src={style.image || "/placeholder.svg"} alt={style.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-medium">{style.name}</h4>
                  <p className="text-xs text-muted-foreground">{style.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
