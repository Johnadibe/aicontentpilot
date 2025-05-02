"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Copy, Edit, Eye, Share } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface TemplatePreviewProps {
    template: {
        id: string
        title: string
        description: string
        content: string
        category: string
        tags: string[]
        createdAt: string
        updatedAt: string
        previewImage?: string
        variables?: { name: string; description: string }[]
    }
    isLoading?: boolean
    onUse?: (templateId: string) => void
    onEdit?: (templateId: string) => void
    onBack?: () => void
}

export function TemplatePreview({ template, isLoading = false, onUse, onEdit, onBack }: TemplatePreviewProps) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("preview")
    const [showShareDialog, setShowShareDialog] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/templates/${template.id}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleUseTemplate = () => {
        if (onUse) {
            onUse(template.id)
        } else {
            router.push(`/dashboard/content/create?template=${template.id}`)
        }
    }

    const handleEditTemplate = () => {
        if (onEdit) {
            onEdit(template.id)
        } else {
            router.push(`/dashboard/templates/edit/${template.id}`)
        }
    }

    if (isLoading) {
        return <TemplatePreviewSkeleton />
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold">{template.title}</h2>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline">{template.category}</Badge>
                    <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Share className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share Template</DialogTitle>
                                <DialogDescription>Share this template with your team or colleagues</DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-4">
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={`${window.location.origin}/templates/${template.id}`}
                                    readOnly
                                />
                                <Button onClick={handleCopyLink}>{copied ? "Copied!" : "Copy"}</Button>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                                    Close
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="preview">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </TabsTrigger>
                        <TabsTrigger value="variables">
                            <Edit className="h-4 w-4 mr-2" />
                            Variables
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-0">
                        <div className="rounded-md border p-4 min-h-[300px] whitespace-pre-wrap">{template.content}</div>
                    </TabsContent>
                    <TabsContent value="variables" className="mt-0">
                        <div className="rounded-md border p-4 min-h-[300px]">
                            {template.variables && template.variables.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Template Variables</h3>
                                    <div className="grid gap-4">
                                        {template.variables.map((variable, index) => (
                                            <div key={index} className="border rounded-md p-3">
                                                <h4 className="font-medium">{variable.name}</h4>
                                                <p className="text-sm text-muted-foreground">{variable.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">No variables found for this template</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
                <div className="flex flex-wrap gap-2 mt-4">
                    {template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                    Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleEditTemplate}>
                        <Edit className="h-4 w-4 mr-2" />
                        Customize
                    </Button>
                    <Button onClick={handleUseTemplate}>
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

function TemplatePreviewSkeleton() {
    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex mb-4">
                    <Skeleton className="h-10 w-32 mr-2" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-md" />
                <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-4 w-40" />
                <div className="flex space-x-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </CardFooter>
        </Card>
    )
}