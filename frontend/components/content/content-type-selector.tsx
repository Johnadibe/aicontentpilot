"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookText, MessageSquare, Mail, ImageIcon, FileText, ShoppingBag, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"

export function ContentTypeSelector() {
  // Update the contentTypes array to include all the content types we've implemented
  const contentTypes = [
    {
      title: "Blog Post",
      description: "Create comprehensive blog articles on any topic",
      icon: <BookText className="h-10 w-10" />,
      href: "/create/blog",
      color: "bg-purple-500",
      textColor: "group-hover:text-purple-500",
    },
    {
      title: "Social Media Post",
      description: "Generate engaging posts for your social platforms",
      icon: <MessageSquare className="h-10 w-10" />,
      href: "/create/social",
      color: "bg-blue-500",
      textColor: "group-hover:text-blue-500",
    },
    {
      title: "Email Copy",
      description: "Craft compelling emails that convert",
      icon: <Mail className="h-10 w-10" />,
      href: "/create/email",
      color: "bg-indigo-500",
      textColor: "group-hover:text-indigo-500",
    },
    {
      title: "Ad Copy",
      description: "Create high-converting ad copy for any platform",
      icon: <FileText className="h-10 w-10" />,
      href: "/create/ad",
      color: "bg-green-500",
      textColor: "group-hover:text-green-500",
    },
    {
      title: "Product Description",
      description: "Write compelling product descriptions that sell",
      icon: <ShoppingBag className="h-10 w-10" />,
      href: "/create/product",
      color: "bg-rose-500",
      textColor: "group-hover:text-rose-500",
    },
    {
      title: "SEO Content",
      description: "Generate content optimized for search engines",
      icon: <Search className="h-10 w-10" />,
      href: "/create/seo",
      color: "bg-cyan-500",
      textColor: "group-hover:text-cyan-500",
    },
    {
      title: "AI Image",
      description: "Generate custom images using AI",
      icon: <ImageIcon className="h-10 w-10" />,
      href: "/create/image",
      color: "bg-amber-500",
      textColor: "group-hover:text-amber-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {contentTypes.map((type, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Link href={type.href} className="group block h-full">
            <div className="dashboard-card group-hover:border-primary h-full flex flex-col">
              <div className="flex items-center justify-center mb-4">
                <Avatar className={cn("h-16 w-16", type.color)}>
                  <div className="text-white">{type.icon}</div>
                </Avatar>
              </div>
              <h3 className={cn("text-xl font-bold text-center mb-2 transition-colors", type.textColor)}>
                {type.title}
              </h3>
              <p className="text-center text-muted-foreground">{type.description}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
