"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createCheckoutSession } from "@/lib/subscription-service"
import CheckoutForm from "@/components/subscription/checkout-form"

// Make sure to add your publishable key to your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = {
  starter: {
    name: "Starter",
    price: "$29/month",
    description: "Perfect for individuals and small projects",
    priceId: "price_starter_monthly", // Replace with your actual Stripe price ID
  },
  professional: {
    name: "Professional",
    price: "$79/month",
    description: "Ideal for growing businesses and content creators",
    priceId: "price_professional_monthly", // Replace with your actual Stripe price ID
  },
  enterprise: {
    name: "Enterprise",
    price: "$199/month",
    description: "For teams and agencies with high-volume needs",
    priceId: "price_enterprise_monthly", // Replace with your actual Stripe price ID
  },
  "starter-yearly": {
    name: "Starter (Yearly)",
    price: "$276/year",
    description: "Perfect for individuals and small projects",
    priceId: "price_starter_yearly", // Replace with your actual Stripe price ID
  },
  "professional-yearly": {
    name: "Professional (Yearly)",
    price: "$756/year",
    description: "Ideal for growing businesses and content creators",
    priceId: "price_professional_yearly", // Replace with your actual Stripe price ID
  },
  "enterprise-yearly": {
    name: "Enterprise (Yearly)",
    price: "$1,908/year",
    description: "For teams and agencies with high-volume needs",
    priceId: "price_enterprise_yearly", // Replace with your actual Stripe price ID
  },
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan") || "starter"
  const plan = plans[planId as keyof typeof plans]

  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Create a Checkout Session as soon as the page loads
    const fetchCheckoutSession = async () => {
      try {
        setLoading(true)
        const { clientSecret } = await createCheckoutSession(plan.priceId)
        setClientSecret(clientSecret)
      } catch (err) {
        setError("Failed to load checkout. Please try again later.")
        console.error("Error creating checkout session:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCheckoutSession()
  }, [plan.priceId])

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0f172a",
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Subscribe to {plan.name}</h1>
        <p className="text-muted-foreground">{plan.description}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span className="font-medium">{plan.price}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{plan.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Enter your payment information to subscribe</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="py-8 text-center text-red-500">{error}</div>
              ) : (
                clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
