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

    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })

    // Get the default payment method
    const customer = await stripe.customers.retrieve(customerId)
    const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method as string | null

    // Format the payment methods for the frontend
    const formattedPaymentMethods = paymentMethods.data.map((method) => ({
      id: method.id,
      type: method.type,
      brand: method.card?.brand || "unknown",
      last4: method.card?.last4 || "0000",
      expMonth: method.card?.exp_month || 1,
      expYear: method.card?.exp_year || 2023,
      isDefault: method.id === defaultPaymentMethodId,
    }))

    return NextResponse.json(formattedPaymentMethods)
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await request.json()
    const { action, paymentMethodId } = data

    // Get the Stripe customer ID for this user
    const customerId = await getStripeCustomerId(session.user.id)

    switch (action) {
      case "setDefault":
        // Set the payment method as default
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        })
        return NextResponse.json({
          success: true,
          message: "Default payment method updated successfully",
        })

      case "delete":
        // Detach the payment method from the customer
        await stripe.paymentMethods.detach(paymentMethodId)
        return NextResponse.json({
          success: true,
          message: "Payment method deleted successfully",
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error managing payment method:", error)
    return NextResponse.json({ error: "Failed to manage payment method" }, { status: 500 })
  }
}
