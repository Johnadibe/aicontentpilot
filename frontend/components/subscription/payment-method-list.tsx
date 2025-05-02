"use client"

import { useEffect, useState } from "react"
import { CreditCard, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPaymentMethods } from "@/lib/subscription-service"
import { toast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  type: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

export function PaymentMethodList() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods()
        setPaymentMethods(methods)
      } catch (error) {
        console.error("Error fetching payment methods:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  const handleSetDefault = async (id: string) => {
    // In a real implementation, this would call an API to update the default payment method
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  const handleDelete = async (id: string) => {
    // In a real implementation, this would call an API to delete the payment method
    toast({
      title: "Payment method removed",
      description: "Your payment method has been removed.",
    })
  }

  const handleAddPaymentMethod = () => {
    // In a real implementation, this would open a modal or redirect to add a payment method
    toast({
      title: "Add payment method",
      description: "This would open a form to add a new payment method.",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
                  <div>
                    <div className="h-5 w-24 animate-pulse rounded bg-muted"></div>
                    <div className="mt-1 h-4 w-16 animate-pulse rounded bg-muted"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-9 w-9 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </div>
        <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payment methods found</p>
            <Button onClick={handleAddPaymentMethod} variant="outline" className="mt-4">
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {method.brand} •••• {method.last4}
                      {method.isDefault && <span className="ml-2 text-xs text-muted-foreground">(Default)</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                      Set as Default
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
