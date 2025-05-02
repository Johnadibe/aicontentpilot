"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BlogPostForm } from "@/components/content-forms/blog-post-form"
import { SocialMediaForm } from "@/components/content-forms/social-media-form"
import { EmailCopyForm } from "@/components/content-forms/email-copy-form"
import { AdCopyForm } from "@/components/content-forms/ad-copy-form"
import { ProductDescriptionForm } from "@/components/content-forms/product-description-form"
import { SEOContentForm } from "@/components/content-forms/seo-content-form"

export default function AdvancedCreateContentPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("blog-post")

  return (
    <DashboardShell>
      <DashboardHeader heading="Advanced Content Creation" text="Create specialized content with AI assistance." />

      <Tabs defaultValue="blog-post" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
          <TabsTrigger value="blog-post">Blog Post</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="ad-copy">Ad Copy</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="seo">SEO Content</TabsTrigger>
        </TabsList>

        <TabsContent value="blog-post" className="space-y-4">
          <BlogPostForm />
        </TabsContent>

        <TabsContent value="social-media" className="space-y-4">
          <SocialMediaForm />
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <EmailCopyForm />
        </TabsContent>

        <TabsContent value="ad-copy" className="space-y-4">
          <AdCopyForm />
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
          <ProductDescriptionForm />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOContentForm />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
