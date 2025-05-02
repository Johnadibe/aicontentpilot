"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return
    }

    setIsLoading(true)
    setMessage(null)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/subscription?payment_success=true`,
      },
      redirect: "if_required",
    })

    if (error) {
      setMessage(error.message || "An unexpected error occurred.")
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast({
        title: "Payment successful!",
        description: "Your subscription has been activated.",
      })
      router.push("/dashboard/subscription?payment_success=true")
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />

      <Button disabled={isLoading || !stripe || !elements} type="submit" className="w-full">
        {isLoading ? "Processing..." : "Subscribe Now"}
      </Button>

      {message && <div className="text-center text-red-500 text-sm">{message}</div>}
    </form>
  )
}
