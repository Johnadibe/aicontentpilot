import type { Metadata } from "next"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InvoiceList } from "@/components/subscription/invoice-list"
import { PaymentMethodList } from "@/components/subscription/payment-method-list"
import { SubscriptionUsage } from "@/components/subscription/subscription-usage"
import { ManageSubscriptionButton } from "@/components/subscription/manage-subscription-button"

export const metadata: Metadata = {
  title: "Subscription | AI Content Pilot",
  description: "Manage your subscription and billing",
}

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // Mock subscription data - would come from your backend
  const subscription = {
    plan: "Professional",
    status: "active",
    renewalDate: "May 15, 2023",
    price: "$79.00",
    billingCycle: "monthly",
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Subscription & Billing"
        text="Manage your subscription, payment methods, and billing history"
      />

      <div className="grid gap-8">
        {/* Current Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your current subscription plan and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{subscription.plan}</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.status === "active" ? "Active" : "Inactive"} · Renews on {subscription.renewalDate}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/pricing">Change Plan</Link>
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Price</span>
                <span>
                  {subscription.price}/{subscription.billingCycle}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Billing Cycle</span>
                <span className="capitalize">{subscription.billingCycle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Next Billing Date</span>
                <span>{subscription.renewalDate}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
            <ManageSubscriptionButton />
          </CardFooter>
        </Card>

        {/* Subscription Management Tabs */}
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="mt-6 space-y-4">
            <SubscriptionUsage />
          </TabsContent>

          <TabsContent value="payment-methods" className="mt-6">
            <PaymentMethodList />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <InvoiceList />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Settings</CardTitle>
                <CardDescription>Manage your subscription preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Manage Subscription</p>
                    <p className="text-sm text-muted-foreground">
                      Update your plan, payment methods, and billing information
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ManageSubscriptionButton variant="outline" size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email notifications about your subscription</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
