"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookText, MessageSquare, Mail, FileText, ShoppingBag, Search, ImageIcon } from "lucide-react"

export function ContentTypeNav() {
  const pathname = usePathname()

  const items = [
    {
      title: "Blog Post",
      href: "/create/blog",
      icon: <BookText className="h-4 w-4 mr-2" />,
    },
    {
      title: "Social Media",
      href: "/create/social",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      title: "Email Copy",
      href: "/create/email",
      icon: <Mail className="h-4 w-4 mr-2" />,
    },
    {
      title: "Ad Copy",
      href: "/create/ad",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      title: "Product Description",
      href: "/create/product",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
    },
    {
      title: "SEO Content",
      href: "/create/seo",
      icon: <Search className="h-4 w-4 mr-2" />,
    },
    {
      title: "AI Image",
      href: "/create/image",
      icon: <ImageIcon className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <nav className="flex overflow-auto pb-2 scrollbar-hide">
      <div className="flex space-x-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}
