import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type Stripe from "stripe"

import { stripe } from "@/lib/stripe"

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    console.log(`❌ Error message: ${errorMessage}`)
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 })
  }

  // Handle the event
  console.log(`✅ Success: ${event.id}`)

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      // Handle successful checkout
      // Update user's subscription in your database
      console.log(`💰 Checkout completed: ${checkoutSession.id}`)
      break
    case "invoice.paid":
      const invoice = event.data.object as Stripe.Invoice
      // Handle successful payment
      // Update subscription status in your database
      console.log(`💰 Invoice paid: ${invoice.id}`)
      break
    case "invoice.payment_failed":
      const failedInvoice = event.data.object as Stripe.Invoice
      // Handle failed payment
      // Notify user of payment failure
      console.log(`❌ Payment failed: ${failedInvoice.id}`)
      break
    case "customer.subscription.created":
      const subscription = event.data.object as Stripe.Subscription
      // Handle subscription creation
      // Update user's subscription in your database
      console.log(`🔔 Subscription created: ${subscription.id}`)
      break
    case "customer.subscription.updated":
      const updatedSubscription = event.data.object as Stripe.Subscription
      // Handle subscription update
      // Update user's subscription in your database
      console.log(`🔔 Subscription updated: ${updatedSubscription.id}`)
      break
    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription
      // Handle subscription deletion
      // Update user's subscription in your database
      console.log(`🔔 Subscription deleted: ${deletedSubscription.id}`)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
