"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Folder,
    File,
    ImageIcon,
    MoreHorizontal,
    Plus,
    ArrowLeft,
    Pencil,
    Trash2,
    Upload,
    Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

interface WorkspaceViewProps {
    team: any
    workspace: any
}

interface ContentItem {
    id: string;
    type: string;
    title: string;
    description?: string;
}

export function WorkspaceView({ team, workspace }: WorkspaceViewProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("content")

    // These would be fetched from the API in a real implementation
    const contentItems: ContentItem[] = []
    const imageItems = []
    const templateItems = []

    const renderIcon = (type: string) => {
        switch (type) {
            case "folder":
                return <Folder className="h-6 w-6" />
            case "image":
                return <ImageIcon className="h-6 w-6" />
            default:
                return <File className="h-6 w-6" />
        }
    }

    const handleCreateContent = () => {
        router.push(`/dashboard/content/create?workspaceId=${workspace.id}`)
    }

    const handleCreateImage = () => {
        router.push(`/dashboard/images/create?workspaceId=${workspace.id}`)
    }

    const handleCreateTemplate = () => {
        router.push(`/dashboard/templates/create?workspaceId=${workspace.id}`)
    }

    const handleImport = () => {
        toast({
            title: "Import feature",
            description: "This feature is coming soon!",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={`/dashboard/teams/${team.id}/workspaces`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">{workspace.name}</h2>
                        <p className="text-sm text-muted-foreground">{workspace.description}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleCreateContent}>
                                <File className="mr-2 h-4 w-4" />
                                Content
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCreateImage}>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Image
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCreateTemplate}>
                                <File className="mr-2 h-4 w-4" />
                                Template
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleImport}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="mt-6">
                    {contentItems.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <File className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No content</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                                Get started by creating your first content piece
                            </p>
                            <Button onClick={handleCreateContent}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Content
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {contentItems.map((item) => (
                                <Card key={item.id}>
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="flex items-center space-x-2">
                                            {renderIcon(item.type)}
                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="line-clamp-2">
                                            {item.description || "No description provided"}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="images" className="mt-6">
                    {imageItems.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No images</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">Get started by creating your first image</p>
                            <Button onClick={handleCreateImage}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Image
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{/* Image items would be rendered here */}</div>
                    )}
                </TabsContent>
                <TabsContent value="templates" className="mt-6">
                    {templateItems.length === 0 ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <File className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">No templates</h3>
                            <p className="mb-4 mt-2 text-sm text-muted-foreground">Get started by creating your first template</p>
                            <Button onClick={handleCreateTemplate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Template
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {/* Template items would be rendered here */}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}