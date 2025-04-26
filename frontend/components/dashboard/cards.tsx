"use client"

import { motion } from "framer-motion"
import { BookText, MessageSquare, Mail, Clock } from "lucide-react"

export function DashboardCards() {
  const cards = [
    {
      title: "Blog Posts",
      value: "14",
      change: "+3",
      icon: <BookText className="h-5 w-5" />,
      color: "text-purple-500",
    },
    {
      title: "Social Posts",
      value: "32",
      change: "+8",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      title: "Email Campaigns",
      value: "7",
      change: "+2",
      icon: <Mail className="h-5 w-5" />,
      color: "text-indigo-500",
    },
    {
      title: "Content Hours Saved",
      value: "128",
      change: "+11",
      icon: <Clock className="h-5 w-5" />,
      color: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-md p-2 ${card.color.replace("text-", "bg-").concat("/10")}`}>
              <div className={card.color}>{card.icon}</div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-500 mr-1">{card.change}</span>
              <span className="text-muted-foreground">this week</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold">{card.value}</h3>
            <p className="text-sm text-muted-foreground">{card.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
