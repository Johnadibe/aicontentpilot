import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ProductDescriptionGenerator } from "@/components/content/product-description-generator"

export const metadata: Metadata = {
  title: "Create Product Description - AI Content Pilot",
  description: "Generate AI-powered product descriptions",
}

export default async function CreateProductPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/create/product")
  }

  return <ProductDescriptionGenerator />
}
