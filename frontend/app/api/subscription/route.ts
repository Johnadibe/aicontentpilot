import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { stripe, getStripeCustomerId } from "@/lib/stripe"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get the Stripe customer ID for this user
    const customerId = await getStripeCustomerId(session.user.id)

    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.default_payment_method"],
    })

    if (subscriptions.data.length === 0) {
      // No active subscription
      return NextResponse.json({
        id: null,
        plan: "free",
        status: "inactive",
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        price: 0,
        billingCycle: "monthly",
        usage: {
          words: {
            used: 0,
            limit: 5000,
            label: "Words",
          },
          images: {
            used: 0,
            limit: 5,
            label: "AI Images",
          },
          apiCalls: {
            used: 0,
            limit: 0,
            label: "API Calls",
          },
          teamMembers: {
            used: 1,
            limit: 1,
            label: "Team Members",
          },
        },
      })
    }

    // Get the active subscription
    const subscription = subscriptions.data[0]

    // Get the product details
    const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string)

    // Determine the plan based on the product name
    let plan = "free"
    if (product.name.toLowerCase().includes("starter")) {
      plan = "starter"
    } else if (product.name.toLowerCase().includes("professional")) {
      plan = "professional"
    } else if (product.name.toLowerCase().includes("enterprise")) {
      plan = "enterprise"
    }

    // Determine usage limits based on the plan
    const usageLimits = {
      starter: {
        words: 50000,
        images: 50,
        apiCalls: 100,
        teamMembers: 1,
      },
      professional: {
        words: 200000,
        images: 100,
        apiCalls: 500,
        teamMembers: 3,
      },
      enterprise: {
        words: 1000000,
        images: 500,
        apiCalls: 10000,
        teamMembers: 10,
      },
      free: {
        words: 5000,
        images: 5,
        apiCalls: 0,
        teamMembers: 1,
      },
    }

    // Mock usage data - in a real implementation, this would come from your database
    const mockUsage = {
      words: Math.floor(Math.random() * usageLimits[plan as keyof typeof usageLimits].words * 0.7),
      images: Math.floor(Math.random() * usageLimits[plan as keyof typeof usageLimits].images * 0.5),
      apiCalls: Math.floor(Math.random() * usageLimits[plan as keyof typeof usageLimits].apiCalls * 0.3),
      teamMembers: Math.floor(Math.random() * usageLimits[plan as keyof typeof usageLimits].teamMembers),
    }

    // Format the subscription for the frontend
    const formattedSubscription = {
      id: subscription.id,
      plan,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      price: subscription.items.data[0].price.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
      billingCycle: subscription.items.data[0].price.recurring?.interval || "monthly",
      usage: {
        words: {
          used: mockUsage.words,
          limit: usageLimits[plan as keyof typeof usageLimits].words,
          label: "Words",
        },
        images: {
          used: mockUsage.images,
          limit: usageLimits[plan as keyof typeof usageLimits].images,
          label: "AI Images",
        },
        apiCalls: {
          used: mockUsage.apiCalls,
          limit: usageLimits[plan as keyof typeof usageLimits].apiCalls,
          label: "API Calls",
        },
        teamMembers: {
          used: mockUsage.teamMembers,
          limit: usageLimits[plan as keyof typeof usageLimits].teamMembers,
          label: "Team Members",
        },
      },
    }

    return NextResponse.json(formattedSubscription)
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
