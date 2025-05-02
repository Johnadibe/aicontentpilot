"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, FileText, Download, Check, Globe, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ExportOptionsProps {
  content: any
}

export function ExportOptions({ content }: ExportOptionsProps) {
  const [exportFormat, setExportFormat] = useState("docx")
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [includeImages, setIncludeImages] = useState(true)
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [exportMessage, setExportMessage] = useState("")
  const [selectedCMS, setSelectedCMS] = useState("")

  const handleExport = () => {
    setExportStatus("loading")
    setExportMessage("Exporting...")
    // Perform export operation here...
    setTimeout(() => {
      setExportStatus("success")
      setExportMessage("Export successful!")
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="file">File Export</TabsTrigger>
            <TabsTrigger value="cms">CMS Publishing</TabsTrigger>
            <TabsTrigger value="email">Email Export</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-blue-500" />
                      Microsoft Word (.docx)
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-red-500" />
                      PDF Document (.pdf)
                    </div>
                  </SelectItem>
                  <SelectItem value="html">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-orange-500" />
                      HTML (.html)
                    </div>
                  </SelectItem>
                  <SelectItem value="md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-purple-500" />
                      Markdown (.md)
                    </div>
                  </SelectItem>
                  <SelectItem value="txt">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Plain Text (.txt)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <Label>Export Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
                  />
                  <label
                    htmlFor="includeMetadata"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include metadata (tags, creation date, etc.)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeImages"
                    checked={includeImages}
                    onCheckedChange={(checked) => setIncludeImages(checked === true)}
                  />
                  <label
                    htmlFor="includeImages"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include images and media
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleExport}>
                {exportStatus === "loading" ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : exportStatus === "success" ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Export Successful
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export File
                  </>
                )}
              </Button>
              {exportStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Export Failed</AlertTitle>
                  <AlertDescription>{exportMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cms" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="cmsType">CMS Platform</Label>
              <Select value={selectedCMS} onValueChange={setSelectedCMS}>
                <SelectTrigger id="cmsType">
                  <SelectValue placeholder="Select CMS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wordpress">WordPress</SelectItem>
                  <SelectItem value="shopify">Shopify</SelectItem>
                  <SelectItem value="wix">Wix</SelectItem>
                  <SelectItem value="squarespace">Squarespace</SelectItem>
                  <SelectItem value="webflow">Webflow</SelectItem>
                  <SelectItem value="contentful">Contentful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2">
              <Label>Publishing Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="publishAsDraft" defaultChecked />
                  <label
                    htmlFor="publishAsDraft"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Publish as draft
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeCategories" defaultChecked />
                  <label
                    htmlFor="includeCategories"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include categories and tags
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="optimizeForCMS" defaultChecked />
                  <label
                    htmlFor="optimizeForCMS"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Optimize formatting for CMS
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button>
                <Globe className="h-4 w-4 mr-2" />
                Publish to CMS
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="emailTemplate">Email Template</Label>
              <Select defaultValue="plain">
                <SelectTrigger id="emailTemplate">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain Text</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSubject">Email Subject</Label>
              <input
                id="emailSubject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter email subject"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label>Email Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="includeUnsubscribe" defaultChecked />
                  <label
                    htmlFor="includeUnsubscribe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include unsubscribe link
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="trackOpens" defaultChecked />
                  <label
                    htmlFor="trackOpens"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Track email opens
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="trackLinks" defaultChecked />
                  <label
                    htmlFor="trackLinks"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Track link clicks
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Export for Email
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
