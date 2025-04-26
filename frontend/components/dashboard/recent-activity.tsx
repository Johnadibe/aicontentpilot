"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BookText, MessageSquare, Mail, FileText, ImageIcon } from "lucide-react"

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const activities = [
    {
      id: 1,
      type: "blog",
      title: "How to Improve Your SEO in 2025",
      time: "2 hours ago",
      icon: <BookText className="h-4 w-4" />,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      id: 2,
      type: "social",
      title: "Product launch announcement for Twitter",
      time: "5 hours ago",
      icon: <MessageSquare className="h-4 w-4" />,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: 3,
      type: "email",
      title: "Monthly Newsletter: June Edition",
      time: "Yesterday",
      icon: <Mail className="h-4 w-4" />,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/20",
    },
    {
      id: 4,
      type: "content",
      title: "15 Benefits of Remote Work",
      time: "Yesterday",
      icon: <FileText className="h-4 w-4" />,
      iconColor: "text-green-500",
      iconBg: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: 5,
      type: "image",
      title: "App dashboard mockup",
      time: "2 days ago",
      icon: <ImageIcon className="h-4 w-4" />,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/20",
    },
  ]

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest content creation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg border p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className={`rounded-md p-2 ${activity.iconBg}`}>
                  <div className={activity.iconColor}>{activity.icon}</div>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
