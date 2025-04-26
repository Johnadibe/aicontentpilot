"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface UsageMetricsProps {
  className?: string
}

export function UsageMetrics({ className }: UsageMetricsProps) {
  const metrics = [
    {
      title: "Words Generated",
      current: 28450,
      max: 50000,
      percent: 57,
    },
    {
      title: "AI Images Created",
      current: 38,
      max: 100,
      percent: 38,
    },
    {
      title: "API Calls",
      current: 342,
      max: 1000,
      percent: 34,
    },
  ]

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Usage Metrics</CardTitle>
          <CardDescription>Your current plan usage for this billing cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {metric.current.toLocaleString()} / {metric.max.toLocaleString()}
                  </p>
                </div>
                <Progress value={metric.percent} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
