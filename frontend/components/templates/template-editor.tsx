"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, GripVertical, Variable, Eye, Save, ArrowUp, ArrowDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface TemplateBlock {
  id: string
  type: "heading" | "paragraph" | "list" | "image" | "variable" | "code" | "divider" | "callout"
  content: string
  settings?: Record<string, any>
}

export interface TemplateVariable {
  id: string
  name: string
  description: string
  defaultValue: string
  type: "text" | "number" | "date" | "select" | "boolean" | "color"
  options?: string[] // For select type
  required?: boolean
}

export interface TemplateContent {
  blocks: TemplateBlock[]
  variables: TemplateVariable[]
}

export interface TemplateEditorProps {
  value: TemplateContent
  onChange: (value: TemplateContent) => void
  onPreview?: () => void
  onSave?: () => void
  readOnly?: boolean
}

export function TemplateEditor({ value, onChange, onPreview, onSave, readOnly = false }: TemplateEditorProps) {
  const [newVariable, setNewVariable] = useState<Partial<TemplateVariable>>({
    name: "",
    description: "",
    defaultValue: "",
    type: "text",
    required: false,
  })
  const [variableOptions, setVariableOptions] = useState<string>("")
  const [showVariableDialog, setShowVariableDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("blocks")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const addBlock = (type: TemplateBlock["type"]) => {
    if (readOnly) return

    const newBlock: TemplateBlock = {
      id: crypto.randomUUID(),
      type,
      content: "",
      settings:
        type === "heading"
          ? { level: "h2" }
          : type === "list"
            ? { style: "bullet" }
            : type === "callout"
              ? { style: "info" }
              : {},
    }

    onChange({
      ...value,
      blocks: [...value.blocks, newBlock],
    })

    // Select the new block
    setSelectedBlockId(newBlock.id)
  }

  const updateBlock = (id: string, content: string) => {
    if (readOnly) return

    onChange({
      ...value,
      blocks: value.blocks.map((block) => (block.id === id ? { ...block, content } : block)),
    })
  }

  const updateBlockSettings = (id: string, settings: Record<string, any>) => {
    if (readOnly) return

    onChange({
      ...value,
      blocks: value.blocks.map((block) =>
        block.id === id ? { ...block, settings: { ...block.settings, ...settings } } : block,
      ),
    })
  }

  const removeBlock = (id: string) => {
    if (readOnly) return

    onChange({
      ...value,
      blocks: value.blocks.filter((block) => block.id !== id),
    })

    if (selectedBlockId === id) {
      setSelectedBlockId(null)
    }
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    if (readOnly) return

    const blockIndex = value.blocks.findIndex((block) => block.id === id)
    if (blockIndex === -1) return

    const newBlocks = [...value.blocks]

    if (direction === "up" && blockIndex > 0) {
      // Swap with the previous block
      ;[newBlocks[blockIndex], newBlocks[blockIndex - 1]] = [newBlocks[blockIndex - 1], newBlocks[blockIndex]]
    } else if (direction === "down" && blockIndex < newBlocks.length - 1) {
      // Swap with the next block
      ;[newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]]
    } else {
      return // No move possible
    }

    onChange({
      ...value,
      blocks: newBlocks,
    })
  }

  const addVariable = () => {
    if (readOnly || !newVariable.name) return

    const variable: TemplateVariable = {
      id: crypto.randomUUID(),
      name: newVariable.name!,
      description: newVariable.description || "",
      defaultValue: newVariable.defaultValue || "",
      type: newVariable.type as "text" | "number" | "date" | "select" | "boolean" | "color",
      options:
        newVariable.type === "select" && variableOptions
          ? variableOptions.split(",").map((opt) => opt.trim())
          : undefined,
      required: newVariable.required || false,
    }

    onChange({
      ...value,
      variables: [...value.variables, variable],
    })

    // Reset form
    setNewVariable({
      name: "",
      description: "",
      defaultValue: "",
      type: "text",
      required: false,
    })
    setVariableOptions("")
    setShowVariableDialog(false)
  }

  const removeVariable = (id: string) => {
    if (readOnly) return

    onChange({
      ...value,
      variables: value.variables.filter((variable) => variable.id !== id),
    })
  }

  const insertVariable = (variableId: string, blockId: string) => {
    if (readOnly) return

    const variable = value.variables.find((v) => v.id === variableId)
    if (!variable) return

    const block = value.blocks.find((b) => b.id === blockId)
    if (!block) return

    const variableTag = `{{${variable.name}}}`
    const updatedContent = block.content + variableTag

    updateBlock(blockId, updatedContent)
  }

  const renderBlockEditor = (block: TemplateBlock) => {
    const isSelected = selectedBlockId === block.id

    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={block.settings?.level || "h2"}
                onValueChange={(value) => updateBlockSettings(block.id, { level: value })}
                disabled={readOnly}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1</SelectItem>
                  <SelectItem value="h2">H2</SelectItem>
                  <SelectItem value="h3">H3</SelectItem>
                  <SelectItem value="h4">H4</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Enter heading text"
                className={cn("font-semibold", {
                  "text-2xl": block.settings?.level === "h1",
                  "text-xl": block.settings?.level === "h2",
                  "text-lg": block.settings?.level === "h3",
                  "text-base": block.settings?.level === "h4",
                })}
                disabled={readOnly}
              />
            </div>
          </div>
        )

      case "paragraph":
        return (
          <Textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Enter paragraph text"
            className="min-h-[100px] resize-none"
            disabled={readOnly}
          />
        )

      case "list":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={block.settings?.style || "bullet"}
                onValueChange={(value) => updateBlockSettings(block.id, { style: value })}
                disabled={readOnly}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="List style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bullet">Bullet</SelectItem>
                  <SelectItem value="numbered">Numbered</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Enter list items, one per line"
              className="min-h-[100px] resize-none"
              disabled={readOnly}
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-2">
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Enter image URL or description"
              disabled={readOnly}
            />
            {block.content && (
              <div className="mt-2 rounded-md border overflow-hidden">
                <img
                  src={
                    block.content.startsWith("http")
                      ? block.content
                      : `/placeholder.svg?height=200&width=400&query=${encodeURIComponent(block.content)}`
                  }
                  alt="Preview"
                  className="w-full h-auto max-h-[200px] object-contain"
                />
              </div>
            )}
          </div>
        )

      case "code":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={block.settings?.language || "javascript"}
                onValueChange={(value) => updateBlockSettings(block.id, { language: value })}
                disabled={readOnly}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Enter code"
              className="min-h-[150px] resize-none font-mono text-sm"
              disabled={readOnly}
            />
          </div>
        )

      case "divider":
        return (
          <div className="py-2">
            <div className="border-t border-border w-full" />
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              placeholder="Optional label (leave empty for plain divider)"
              className="mt-2"
              disabled={readOnly}
            />
          </div>
        )

      case "callout":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Select
                value={block.settings?.style || "info"}
                onValueChange={(value) => updateBlockSettings(block.id, { style: value })}
                disabled={readOnly}
              >
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className={cn("p-4 rounded-md border", {
                "bg-blue-50 border-blue-200": block.settings?.style === "info",
                "bg-yellow-50 border-yellow-200": block.settings?.style === "warning",
                "bg-red-50 border-red-200": block.settings?.style === "error",
                "bg-green-50 border-green-200": block.settings?.style === "success",
              })}
            >
              <Textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Enter callout text"
                className="min-h-[80px] resize-none bg-transparent border-0 focus-visible:ring-0 p-0"
                disabled={readOnly}
              />
            </div>
          </div>
        )

      default:
        return (
          <Input
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Enter content"
            disabled={readOnly}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blocks">Content Blocks</TabsTrigger>
          <TabsTrigger value="variables">Variables ({value.variables.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="space-y-4">
          {!readOnly && (
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("heading")}>
                <Plus className="mr-1 h-3 w-3" />
                Heading
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
                <Plus className="mr-1 h-3 w-3" />
                Paragraph
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("list")}>
                <Plus className="mr-1 h-3 w-3" />
                List
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("image")}>
                <Plus className="mr-1 h-3 w-3" />
                Image
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("code")}>
                <Plus className="mr-1 h-3 w-3" />
                Code
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("divider")}>
                <Plus className="mr-1 h-3 w-3" />
                Divider
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addBlock("callout")}>
                <Plus className="mr-1 h-3 w-3" />
                Callout
              </Button>
              <Dialog open={showVariableDialog} onOpenChange={setShowVariableDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-1 h-3 w-3" />
                    Variable
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Variable</DialogTitle>
                    <DialogDescription>Create a new variable for your template.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name">Name</label>
                      <Input
                        id="name"
                        value={newVariable.name || ""}
                        onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                        placeholder="e.g., companyName"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description">Description</label>
                      <Input
                        id="description"
                        value={newVariable.description || ""}
                        onChange={(e) =>
                          setNewVariable({
                            ...newVariable,
                            description: e.target.value,
                          })
                        }
                        placeholder="e.g., The name of the company"
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="type">Type</label>
                      <Select
                        value={newVariable.type || "text"}
                        onValueChange={(value) => setNewVariable({ ...newVariable, type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="color">Color</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newVariable.type === "select" && (
                      <div className="grid gap-2">
                        <label htmlFor="options">Options (comma separated)</label>
                        <Input
                          id="options"
                          value={variableOptions}
                          onChange={(e) => setVariableOptions(e.target.value)}
                          placeholder="e.g., Option 1, Option 2, Option 3"
                        />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <label htmlFor="defaultValue">Default Value</label>
                      <Input
                        id="defaultValue"
                        value={newVariable.defaultValue || ""}
                        onChange={(e) =>
                          setNewVariable({
                            ...newVariable,
                            defaultValue: e.target.value,
                          })
                        }
                        placeholder="e.g., Acme Inc."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="required"
                        checked={newVariable.required || false}
                        onCheckedChange={(checked) =>
                          setNewVariable({
                            ...newVariable,
                            required: checked,
                          })
                        }
                      />
                      <Label htmlFor="required">Required</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setShowVariableDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={addVariable}>
                      Add Variable
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="space-y-4">
            {value.blocks.map((block) => (
              <Card
                key={block.id}
                className={cn("relative transition-all", selectedBlockId === block.id ? "ring-2 ring-primary" : "")}
                onClick={() => setSelectedBlockId(block.id)}
              >
                {!readOnly && (
                  <div className="absolute left-2 top-2 cursor-move text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </div>
                )}
                <CardContent className="p-4 pl-8">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xs font-medium uppercase text-muted-foreground">{block.type}</span>
                    </div>
                    {!readOnly && (
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveBlock(block.id, "up")
                                }}
                                disabled={value.blocks.indexOf(block) === 0}
                              >
                                <ArrowUp className="h-4 w-4" />
                                <span className="sr-only">Move up</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move up</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveBlock(block.id, "down")
                                }}
                                disabled={value.blocks.indexOf(block) === value.blocks.length - 1}
                              >
                                <ArrowDown className="h-4 w-4" />
                                <span className="sr-only">Move down</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Move down</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {value.variables.length > 0 && (
                          <Select
                            onValueChange={(variableId) => {
                              insertVariable(variableId, block.id)
                            }}
                          >
                            <SelectTrigger className="h-8 w-[180px]">
                              <SelectValue placeholder="Insert variable" />
                            </SelectTrigger>
                            <SelectContent>
                              {value.variables.map((variable) => (
                                <SelectItem key={variable.id} value={variable.id}>
                                  <div className="flex items-center">
                                    <Variable className="mr-2 h-3 w-3" />
                                    {variable.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeBlock(block.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  {renderBlockEditor(block)}
                </CardContent>
              </Card>
            ))}

            {value.blocks.length === 0 && (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <h3 className="mt-4 text-lg font-semibold">No content blocks</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  {readOnly ? "This template has no content blocks." : "Add content blocks to build your template."}
                </p>
                {!readOnly && (
                  <Button variant="outline" onClick={() => addBlock("paragraph")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add a block
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          {!readOnly && (
            <Button onClick={() => setShowVariableDialog(true)} variant="outline" size="sm">
              <Plus className="mr-1 h-3 w-3" />
              Add Variable
            </Button>
          )}

          {value.variables.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div>Name</div>
                <div>Description</div>
                <div>Type</div>
                <div>Default Value</div>
                {!readOnly && <div className="text-right">Actions</div>}
              </div>
              <div className="divide-y">
                {value.variables.map((variable) => (
                  <div key={variable.id} className="grid grid-cols-5 gap-4 p-4 items-center">
                    <div className="font-medium">
                      {variable.name}
                      {variable.required && <span className="ml-1 text-red-500">*</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{variable.description || "-"}</div>
                    <div className="text-sm">
                      {variable.type}
                      {variable.type === "select" && variable.options && (
                        <span className="text-xs text-muted-foreground block">
                          Options: {variable.options.join(", ")}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-mono">{variable.defaultValue || "-"}</div>
                    {!readOnly && (
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => removeVariable(variable.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <h3 className="mt-4 text-lg font-semibold">No variables</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {readOnly ? "This template has no variables." : "Add variables to make your template dynamic."}
              </p>
              {!readOnly && (
                <Button variant="outline" onClick={() => setShowVariableDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add a variable
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {!readOnly && (
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onPreview} disabled={value.blocks.length === 0}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button type="button" onClick={onSave} disabled={value.blocks.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      )}
    </div>
  )
}