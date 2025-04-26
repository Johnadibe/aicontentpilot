import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { BlogPostGenerator } from "@/components/content/blog-post-generator"

export const metadata: Metadata = {
  title: "Create Blog Post - AI Content Pilot",
  description: "Generate AI-powered blog posts",
}

export default async function CreateBlogPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/blog")
  }

  return <BlogPostGenerator />
}
