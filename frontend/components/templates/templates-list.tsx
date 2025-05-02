"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TemplateCard } from "@/components/templates/template-card"
import {
  type TemplateFilters,
  type TemplatesResponse,
  getTemplates,
  getCategories,
  type Category,
} from "@/lib/template-service"
import { Pagination } from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function TemplatesList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [templates, setTemplates] = useState<TemplatesResponse | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<TemplateFilters>({
    category: searchParams.get("category") || undefined,
    query: searchParams.get("query") || undefined,
    sort: searchParams.get("sort") || "createdAt",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
    page: searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1,
    limit: 12,
  })

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const templatesData = await getTemplates(filters)
        setTemplates(templatesData)

        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching templates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // Update URL with filters
    const params = new URLSearchParams()
    if (filters.category) params.set("category", filters.category)
    if (filters.query) params.set("query", filters.query)
    if (filters.sort) params.set("sort", filters.sort)
    if (filters.order) params.set("order", filters.order)
    if (filters.page && filters.page > 1) params.set("page", filters.page.toString())

    const url = `/dashboard/templates${params.toString() ? `?${params.toString()}` : ""}`
    router.push(url, { scroll: false })
  }, [filters, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, page: 1 })
  }

  const handleCategoryChange = (category: string | undefined) => {
    setFilters({ ...filters, category, page: 1 })
  }

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split("-")
    setFilters({ ...filters, sort, order: order as "asc" | "desc", page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search templates..."
              className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
              value={filters.query || ""}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </form>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1"
            onClick={() => setFilters({ sort: "createdAt", order: "desc", page: 1 })}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={`${filters.sort}-${filters.order}`} onValueChange={handleSortChange}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest first</SelectItem>
              <SelectItem value="createdAt-asc">Oldest first</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="usageCount-desc">Most used</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="h-9 rounded-none rounded-l-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-9 rounded-none rounded-r-md"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <div className="hidden space-y-4 md:block">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-2">
                  <Button
                    variant={!filters.category ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleCategoryChange(undefined)}
                  >
                    All Templates
                  </Button>
                  {isLoading && !categories.length ? (
                    <>
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </>
                  ) : (
                    categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={filters.category === category.name ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange(category.name)}
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {category.count}
                        </Badge>
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="my">My Templates</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className={`${viewMode === "grid" ? "h-[220px]" : "h-[100px]"} w-full`} />
                    ))}
                </div>
              ) : templates?.templates.length === 0 ? (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                  <h3 className="mt-4 text-lg font-semibold">No templates found</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <Button onClick={() => setFilters({ sort: "createdAt", order: "desc", page: 1 })}>
                    Reset filters
                  </Button>
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}`}
                  >
                    {templates?.templates?.map((template) => (
                      <TemplateCard key={template.id} template={template} viewMode={viewMode} />
                    ))}
                  </div>

                  {templates?.pagination && templates.pagination.pages > 1 && (
                    <Pagination
                      currentPage={templates.pagination.page}
                      totalPages={templates.pagination.pages}
                      onPageChange={handlePageChange}
                      baseUrl="/dashboard/templates"  // Add this line
                    />
                  )}
                </>
              )}
            </TabsContent>
            <TabsContent value="my" className="space-y-4">
              {/* Similar structure as "all" tab but filtered to user's templates */}
            </TabsContent>
            <TabsContent value="popular" className="space-y-4">
              {/* Similar structure as "all" tab but showing popular templates */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
