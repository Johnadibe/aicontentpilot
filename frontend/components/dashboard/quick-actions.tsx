"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookText, MessageSquare, Mail, FileText, ImageIcon, ChevronRight } from "lucide-react"

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  const actions = [
    {
      title: "Create Blog Post",
      href: "/create/blog",
      icon: <BookText className="h-4 w-4" />,
      color: "text-purple-500",
    },
    {
      title: "Generate Social Post",
      href: "/create/social",
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-blue-500",
    },
    {
      title: "Write Email Copy",
      href: "/create/email",
      icon: <Mail className="h-4 w-4" />,
      color: "text-indigo-500",
    },
    {
      title: "Create AI Image",
      href: "/create/image",
      icon: <ImageIcon className="h-4 w-4" />,
      color: "text-amber-500",
    },
    {
      title: "View All Templates",
      href: "/templates",
      icon: <FileText className="h-4 w-4" />,
      color: "text-green-500",
    },
  ]

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used creation tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {actions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Button variant="ghost" className="w-full justify-between hover:bg-muted" asChild>
                  <Link href={action.href}>
                    <div className="flex items-center">
                      <div className={`mr-2 ${action.color}`}>{action.icon}</div>
                      <span>{action.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
