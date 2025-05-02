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

    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 10,
    })

    // Format the invoices for the frontend
    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number || invoice.id,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: invoice.currency.toUpperCase(),
      }).format(invoice.amount_paid / 100),
      status: invoice.status,
      url: invoice.hosted_invoice_url || "#",
    }))

    return NextResponse.json(formattedInvoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
