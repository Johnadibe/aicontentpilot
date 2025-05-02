"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getSubscription } from "@/lib/subscription-service"

interface UsageMetric {
  used: number
  limit: number
  label: string
}

export function SubscriptionUsage() {
  const [usage, setUsage] = useState<{
    words: UsageMetric
    images: UsageMetric
    apiCalls: UsageMetric
    teamMembers: UsageMetric
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const subscription = await getSubscription()
        if (subscription && subscription.usage) {
          setUsage(subscription.usage)
        }
      } catch (error) {
        console.error("Error fetching usage:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsage()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-5 w-1/3 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="mt-2 h-4 w-1/4 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!usage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>Your subscription usage metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">No usage data available</p>
        </CardContent>
      </Card>
    )
  }

  const renderUsageCard = (metric: UsageMetric) => {
    const percentage = Math.min(Math.round((metric.used / metric.limit) * 100), 100)
    const isNearLimit = percentage >= 80

    return (
      <Card>
        <CardHeader>
          <CardTitle>{metric.label}</CardTitle>
          <CardDescription>
            {metric.used.toLocaleString()} / {metric.limit.toLocaleString()} ({percentage}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={percentage}
            className={isNearLimit ? "bg-amber-100 dark:bg-amber-900" : ""}
            style={{
              '--progress-foreground': isNearLimit ? 'rgb(245, 158, 11)' : 'inherit'
            } as React.CSSProperties} />
          <p className={`mt-2 text-sm ${isNearLimit ? "text-amber-500" : "text-muted-foreground"}`}>
            {isNearLimit ? "You're approaching your limit" : `${metric.limit - metric.used} remaining`}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {renderUsageCard(usage.words)}
      {renderUsageCard(usage.images)}
      {renderUsageCard(usage.apiCalls)}
      {renderUsageCard(usage.teamMembers)}
    </div>
  )
}
