"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {
  FileText,
  ImageIcon,
  MessageSquare,
  Mail,
  ShoppingBag,
  Search,
  BarChart2,
  Edit,
  PenTool,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Mock data for quick access tools
const initialTools = [
  {
    id: "blog-post",
    name: "Blog Post",
    icon: <FileText className="h-4 w-4" />,
    href: "/dashboard/content/create",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: <MessageSquare className="h-4 w-4" />,
    href: "/dashboard/content/advanced-create",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "image-gen",
    name: "Image Generator",
    icon: <ImageIcon className="h-4 w-4" />,
    href: "/dashboard/images/create",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "email-copy",
    name: "Email Copy",
    icon: <Mail className="h-4 w-4" />,
    href: "/dashboard/content/advanced-create",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "product-desc",
    name: "Product Description",
    icon: <ShoppingBag className="h-4 w-4" />,
    href: "/dashboard/content/advanced-create",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "seo-content",
    name: "SEO Content",
    icon: <Search className="h-4 w-4" />,
    href: "/dashboard/content/advanced-create",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: <BarChart2 className="h-4 w-4" />,
    href: "/dashboard/analytics",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "templates",
    name: "Templates",
    icon: <PenTool className="h-4 w-4" />,
    href: "/dashboard/templates",
    color: "bg-teal-100 text-teal-700",
  },
]

export function QuickAccessTools() {
  const [tools, setTools] = useState(initialTools)
  const [isEditing, setIsEditing] = useState(false)

  // Handle drag and drop reordering
  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(tools)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTools(items)
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Quick Access</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Done" : <Edit className="h-4 w-4" />}
            </Button>
            {isEditing && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tools" direction="horizontal">
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3"
              >
                {tools.map((tool, index) => (
                  <Draggable key={tool.id} draggableId={tool.id} index={index} isDragDisabled={!isEditing}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "relative rounded-lg p-3 flex flex-col items-center justify-center text-center gap-2 transition-all",
                          tool.color,
                          isEditing ? "cursor-grab" : "hover:shadow-md",
                        )}
                      >
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background border shadow-sm"
                            onClick={() => {
                              setTools(tools.filter((t) => t.id !== tool.id))
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            <span className="text-xs">×</span>
                          </Button>
                        )}
                        {isEditing ? (
                          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/50">
                            {tool.icon}
                          </div>
                        ) : (
                          <Link href={tool.href} className="flex flex-col items-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/50">
                              {tool.icon}
                            </div>
                            <span className="text-xs font-medium mt-1">{tool.name}</span>
                          </Link>
                        )}
                        {isEditing && <span className="text-xs font-medium mt-1">{tool.name}</span>}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  )
}
