import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TemplatesListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-9 w-[300px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[180px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <div className="hidden space-y-4 md:block">
          <Card>
            <div className="p-4">
              <Skeleton className="mb-4 h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="mb-4 flex">
            <Skeleton className="h-10 w-[300px]" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[220px] w-full" />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
