import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
  onPageChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, baseUrl, className, onPageChange }: PaginationProps) {
  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page
    const pagination: (number | string)[] = [1]

    // Calculate range of pages to show around current page
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis if there's a gap after page 1
    if (rangeStart > 2) {
      pagination.push("...")
    }

    // Add pages in the middle range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pagination.push(i)
    }

    // Add ellipsis if there's a gap before the last page
    if (rangeEnd < totalPages - 1) {
      pagination.push("...")
    }

    // Add last page if it's not the first page
    if (totalPages > 1) {
      pagination.push(totalPages)
    }

    return pagination
  }

  const pages = generatePagination()

  // Helper to generate page URLs
  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes("?") ? "&" : "?"
    return `${baseUrl}${separator}page=${page}`
  }

  return (
    <nav className={cn("flex items-center justify-center space-x-2", className)} aria-label="Pagination">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {pages.map((page, i) => {
        if (page === "...") {
          return (
            <Button key={`ellipsis-${i}`} variant="outline" size="icon" disabled className="cursor-default">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More pages</span>
            </Button>
          )
        }

        const pageNum = page as number
        const isCurrentPage = pageNum === currentPage

        return (
          <Button
            key={pageNum}
            variant={isCurrentPage ? "default" : "outline"}
            size="icon"
            asChild={!isCurrentPage}
            className={isCurrentPage ? "pointer-events-none" : ""}
          >
            {isCurrentPage ? (
              <span aria-current="page">{pageNum}</span>
            ) : (
              <Link href={getPageUrl(pageNum)} aria-label={`Page ${pageNum}`}>
                {pageNum}
              </Link>
            )}
          </Button>
        )
      })}

      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  )
}