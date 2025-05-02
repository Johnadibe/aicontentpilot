import { Stripe } from "stripe"
import { db } from "./db"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // Use the latest API version
})

export const getStripeCustomerId = async (userId: string) => {
  try {
    // First, check if the user already has a subscription with a Stripe customer ID
    const subscription = await db.subscription.findFirst({
      where: { userId, stripeCustomerId: { not: null } },
      select: { stripeCustomerId: true },
    })

    // If we found a Stripe customer ID, return it
    if (subscription?.stripeCustomerId) {
      return subscription.stripeCustomerId
    }

    // If no existing customer ID, check if the user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error(`User with ID ${userId} not found`)
    }

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      name: user.name || undefined,
      metadata: {
        userId: userId,
      },
    })

    // Store the new customer ID in the database
    // We'll update the user's active subscription if it exists, or create a new one if needed
    const existingSubscription = await db.subscription.findFirst({
      where: { userId },
    })

    if (existingSubscription) {
      // Update existing subscription with the new customer ID
      await db.subscription.update({
        where: { id: existingSubscription.id },
        data: { stripeCustomerId: customer.id },
      })
    }

    // Return the new customer ID
    return customer.id
  } catch (error) {
    console.error("Error getting or creating Stripe customer:", error)
    throw new Error("Failed to get or create Stripe customer")
  }
}