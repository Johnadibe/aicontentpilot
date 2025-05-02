"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, MessageSquare, Mail, Search, Star, PenTool, Zap, Clock, Plus } from "lucide-react"
import Link from "next/link"

// Mock data for favorite tools
const favoriteTools = [
  {
    id: "blog-template-1",
    name: "Tech Blog Template",
    description: "Template for technical blog posts with code snippets",
    icon: <FileText className="h-5 w-5" />,
    href: "/dashboard/templates/1",
    category: "templates",
  },
  {
    id: "social-template-1",
    name: "Product Launch Posts",
    description: "Template for announcing new products on social media",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/dashboard/templates/2",
    category: "templates",
  },
  {
    id: "email-template-1",
    name: "Newsletter Template",
    description: "Weekly newsletter format with sections",
    icon: <Mail className="h-5 w-5" />,
    href: "/dashboard/templates/3",
    category: "templates",
  },
  {
    id: "image-prompt-1",
    name: "Product Showcase",
    description: "Generate product images on white background",
    icon: <ImageIcon className="h-5 w-5" />,
    href: "/dashboard/images/create?prompt=product+on+white+background",
    category: "prompts",
  },
  {
    id: "image-prompt-2",
    name: "Abstract Background",
    description: "Generate colorful abstract backgrounds",
    icon: <ImageIcon className="h-5 w-5" />,
    href: "/dashboard/images/create?prompt=colorful+abstract+background",
    category: "prompts",
  },
  {
    id: "blog-generator",
    name: "Blog Generator",
    description: "AI-powered blog post generator",
    icon: <Zap className="h-5 w-5" />,
    href: "/dashboard/content/create",
    category: "tools",
  },
  {
    id: "seo-optimizer",
    name: "SEO Optimizer",
    description: "Optimize content for search engines",
    icon: <Search className="h-5 w-5" />,
    href: "/dashboard/content/optimization",
    category: "tools",
  },
  {
    id: "email-generator",
    name: "Email Generator",
    description: "Create marketing emails quickly",
    icon: <Mail className="h-5 w-5" />,
    href: "/dashboard/content/advanced-create",
    category: "tools",
  },
]

// Mock data for recently used tools
const recentlyUsedTools = [
  {
    id: "blog-generator",
    name: "Blog Generator",
    description: "Last used 2 hours ago",
    icon: <Zap className="h-5 w-5" />,
    href: "/dashboard/content/create",
    timestamp: "2h ago",
  },
  {
    id: "image-generator",
    name: "Image Generator",
    description: "Last used 5 hours ago",
    icon: <ImageIcon className="h-5 w-5" />,
    href: "/dashboard/images/create",
    timestamp: "5h ago",
  },
  {
    id: "social-template-1",
    name: "Product Launch Posts",
    description: "Last used yesterday",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/dashboard/templates/2",
    timestamp: "1d ago",
  },
  {
    id: "seo-optimizer",
    name: "SEO Optimizer",
    description: "Last used 2 days ago",
    icon: <Search className="h-5 w-5" />,
    href: "/dashboard/content/optimization",
    timestamp: "2d ago",
  },
]

export function FavoriteTools() {
  const [activeTab, setActiveTab] = useState("favorites")

  return (
    <Tabs defaultValue="favorites" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="favorites">
          <Star className="h-4 w-4 mr-2" />
          Favorites
        </TabsTrigger>
        <TabsTrigger value="recent">
          <Clock className="h-4 w-4 mr-2" />
          Recently Used
        </TabsTrigger>
        <TabsTrigger value="templates">
          <PenTool className="h-4 w-4 mr-2" />
          Templates
        </TabsTrigger>
      </TabsList>

      <TabsContent value="favorites" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {favoriteTools
            .filter((tool) => tool.category !== "templates" || activeTab === "templates")
            .map((tool) => (
              <Link href={tool.href} key={tool.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {tool.icon}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          <Card className="h-full overflow-hidden border-dashed hover:shadow-md transition-shadow">
            <div className="p-4 flex flex-col h-full items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="font-medium mt-2">Add Favorite</h3>
              <p className="text-sm text-muted-foreground mt-1">Pin your frequently used tools here</p>
            </div>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="recent" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentlyUsedTools.map((tool) => (
            <Link href={tool.href} key={tool.id}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {tool.icon}
                    </div>
                    <span className="text-xs text-muted-foreground">{tool.timestamp}</span>
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="templates" className="mt-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {favoriteTools
            .filter((tool) => tool.category === "templates")
            .map((tool) => (
              <Link href={tool.href} key={tool.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {tool.icon}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          <Card className="h-full overflow-hidden border-dashed hover:shadow-md transition-shadow">
            <div className="p-4 flex flex-col h-full items-center justify-center text-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="font-medium mt-2">Create Template</h3>
              <p className="text-sm text-muted-foreground mt-1">Create a new custom template</p>
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
