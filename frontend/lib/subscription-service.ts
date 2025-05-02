// Get current subscription
export async function getSubscription() {
  try {
    const response = await fetch("/api/subscription")
    if (!response.ok) {
      throw new Error("Failed to fetch subscription")
    }
    return await response.json()
  } catch (error) {
    console.error("Error getting subscription:", error)
    return null
  }
}

// Create checkout session
export async function createCheckoutSession(priceId: string) {
  try {
    const response = await fetch("/api/subscription/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    })

    if (!response.ok) {
      throw new Error("Failed to create checkout session")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

// Get customer portal session
export async function getCustomerPortalSession() {
  try {
    const response = await fetch("/api/subscription/customer-portal", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to create customer portal session")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating customer portal session:", error)
    throw error
  }
}

// Get payment methods
export async function getPaymentMethods() {
  try {
    const response = await fetch("/api/subscription/payment-methods")
    if (!response.ok) {
      throw new Error("Failed to fetch payment methods")
    }
    return await response.json()
  } catch (error) {
    console.error("Error getting payment methods:", error)
    return []
  }
}

// Get invoices
export async function getInvoices() {
  try {
    const response = await fetch("/api/subscription/invoices")
    if (!response.ok) {
      throw new Error("Failed to fetch invoices")
    }
    return await response.json()
  } catch (error) {
    console.error("Error getting invoices:", error)
    return []
  }
}
