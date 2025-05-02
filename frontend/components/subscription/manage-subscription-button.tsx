"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button, type ButtonProps } from "@/components/ui/button"
import { getCustomerPortalSession } from "@/lib/subscription-service"
import { toast } from "@/hooks/use-toast"

interface ManageSubscriptionButtonProps extends ButtonProps {}

export function ManageSubscriptionButton({ children, ...props }: ManageSubscriptionButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true)
      const { url } = await getCustomerPortalSession()
      router.push(url)
    } catch (error) {
      console.error("Error redirecting to customer portal:", error)
      toast({
        title: "Error",
        description: "Failed to redirect to customer portal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleManageSubscription} disabled={isLoading} {...props}>
      {isLoading ? "Loading..." : children || "Manage Subscription"}
    </Button>
  )
}
