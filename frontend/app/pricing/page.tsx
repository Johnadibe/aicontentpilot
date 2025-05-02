import type { Metadata } from "next"
import Link from "next/link"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Pricing | AI Content Pilot",
  description: "Choose the perfect plan for your content creation needs",
}

interface PricingProps {
  title: string
  description: string
  price: string
  duration: string
  popular?: boolean
  features: string[]
  buttonText: string
  buttonLink: string
  buttonVariant?: "default" | "outline"
}

function PricingCard({
  title,
  description,
  price,
  duration,
  popular,
  features,
  buttonText,
  buttonLink,
  buttonVariant = "default",
}: PricingProps) {
  return (
    <Card
      className={cn("flex flex-col", {
        "border-primary shadow-md": popular,
      })}
    >
      {popular && (
        <div className="rounded-t-lg bg-primary py-1 text-center text-sm font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="min-h-[60px]">{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid flex-1 place-items-start gap-6">
        <div className="flex items-baseline text-slate-900 dark:text-slate-50">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          <span className="ml-1 text-sm font-medium text-muted-foreground">{duration}</span>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {features.map((feature) => (
            <li key={feature} className="flex items-center">
              <CheckIcon className="mr-2 h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Link
          href={buttonLink}
          className={cn(
            buttonVariants({
              variant: buttonVariant,
              size: "lg",
            }),
            "w-full",
          )}
        >
          {buttonText}
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function PricingPage() {
  return (
    <div className="container flex flex-col items-center py-20">
      <div className="mx-auto mb-10 max-w-[58rem] text-center">
        <h1 className="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">Choose the perfect plan for your content creation needs</p>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="monthly" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="monthly" className="mt-6">
            <div className="mx-auto grid max-w-screen-lg gap-5 py-8 md:grid-cols-2 lg:grid-cols-4">
              <PricingCard
                title="Free"
                description="Basic content creation for individuals just getting started"
                price="$0"
                duration="/month"
                features={[
                  "5,000 words per month",
                  "5 AI images per month",
                  "3 content templates",
                  "Basic content editor",
                  "Email support",
                ]}
                buttonText="Get Started"
                buttonLink="/auth/register"
                buttonVariant="outline"
              />
              <PricingCard
                title="Starter"
                description="Perfect for individuals and small projects"
                price="$29"
                duration="/month"
                features={[
                  "50,000 words per month",
                  "50 AI images per month",
                  "All content templates",
                  "Advanced content editor",
                  "Content optimization tools",
                  "Priority email support",
                  "API access (100 calls/day)",
                ]}
                buttonText="Subscribe"
                buttonLink="/subscription/checkout?plan=starter"
              />
              <PricingCard
                title="Professional"
                description="Ideal for growing businesses and content creators"
                price="$79"
                duration="/month"
                popular={true}
                features={[
                  "200,000 words per month",
                  "100 AI images per month",
                  "All content templates",
                  "Advanced content editor",
                  "All optimization tools",
                  "Priority support",
                  "API access (500 calls/day)",
                  "Team collaboration (3 seats)",
                  "Custom templates",
                ]}
                buttonText="Subscribe"
                buttonLink="/subscription/checkout?plan=professional"
              />
              <PricingCard
                title="Enterprise"
                description="For teams and agencies with high-volume needs"
                price="$199"
                duration="/month"
                features={[
                  "1,000,000 words per month",
                  "500 AI images per month",
                  "All content templates",
                  "Advanced content editor",
                  "All optimization tools",
                  "Dedicated support",
                  "Unlimited API access",
                  "Team collaboration (10 seats)",
                  "Custom templates",
                  "White-label options",
                  "Custom integrations",
                ]}
                buttonText="Contact Sales"
                buttonLink="/contact-sales"
              />
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="mt-6">
            <div className="mx-auto grid max-w-screen-lg gap-5 py-8 md:grid-cols-2 lg:grid-cols-4">
              <PricingCard
                title="Free"
                description="Basic content creation for individuals just getting started"
                price="$0"
                duration="/month"
                features={[
                  "5,000 words per month",
                  "5 AI images per month",
                  "3 content templates",
                  "Basic content editor",
                  "Email support",
                ]}
                buttonText="Get Started"
                buttonLink="/auth/register"
                buttonVariant="outline"
              />
              <PricingCard
                title="Starter"
                description="Perfect for individuals and small projects"
                price="$23"
                duration="/month"
                features={[
                  "50,000 words per month",
                  "50 AI images per month",
                  "All content templates",
                  "Advanced content editor",
                  "Content optimization tools",
                  "Priority email support",
                  "API access (100 calls/day)",
                ]}
                buttonText="Subscribe"
                buttonLink="/subscription/checkout?plan=starter-yearly"
              />
              <PricingCard
                title="Professional"
                description="Ideal for growing businesses and content creators"
                price="$63"
                duration="/month"
                popular={true}
                features={[
                  "200,000 words per month",
                  "100 AI images per month",
                  "All content templates",
                  "Advanced content editor",
                  "All optimization tools",
                  "Priority support",
                  "API access (500 calls/day)",
                  "Team collaboration (3 seats)",
                  "Custom templates",
                ]}
                buttonText="Subscribe"
                buttonLink="/subscription/checkout?plan=professional-yearly"
              />
              <PricingCard
                title="Enterprise"
                description="For teams and agencies with high-volume needs"
                price="$159"
                duration="/month"
                features={[
                  "1,000,000 words per month",
                  "500 AI images per month",
                  "All content templates",
                  "Advanced content editor",
                  "All optimization tools",
                  "Dedicated support",
                  "Unlimited API access",
                  "Team collaboration (10 seats)",
                  "Custom templates",
                  "White-label options",
                  "Custom integrations",
                ]}
                buttonText="Contact Sales"
                buttonLink="/contact-sales"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mx-auto mt-8 max-w-[58rem] text-center">
        <h2 className="font-heading text-3xl font-bold">Compare Plans</h2>
        <p className="mt-2 text-muted-foreground">Find the perfect plan for your content creation needs</p>
      </div>

      <div className="mt-8 w-full max-w-screen-lg overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-4 text-left font-medium">Features</th>
              <th className="py-4 text-center font-medium">Free</th>
              <th className="py-4 text-center font-medium">Starter</th>
              <th className="py-4 text-center font-medium">Professional</th>
              <th className="py-4 text-center font-medium">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 font-medium">Words per month</td>
              <td className="py-4 text-center">5,000</td>
              <td className="py-4 text-center">50,000</td>
              <td className="py-4 text-center">200,000</td>
              <td className="py-4 text-center">1,000,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">AI images per month</td>
              <td className="py-4 text-center">5</td>
              <td className="py-4 text-center">50</td>
              <td className="py-4 text-center">100</td>
              <td className="py-4 text-center">500</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">Content templates</td>
              <td className="py-4 text-center">3</td>
              <td className="py-4 text-center">All</td>
              <td className="py-4 text-center">All + Custom</td>
              <td className="py-4 text-center">All + Custom</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">Content editor</td>
              <td className="py-4 text-center">Basic</td>
              <td className="py-4 text-center">Advanced</td>
              <td className="py-4 text-center">Advanced</td>
              <td className="py-4 text-center">Advanced</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">Optimization tools</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">Basic</td>
              <td className="py-4 text-center">All</td>
              <td className="py-4 text-center">All</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">API access</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">100 calls/day</td>
              <td className="py-4 text-center">500 calls/day</td>
              <td className="py-4 text-center">Unlimited</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">Team collaboration</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">3 seats</td>
              <td className="py-4 text-center">10 seats</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">Support</td>
              <td className="py-4 text-center">Email</td>
              <td className="py-4 text-center">Priority email</td>
              <td className="py-4 text-center">Priority</td>
              <td className="py-4 text-center">Dedicated</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 font-medium">White-label options</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">✓</td>
            </tr>
            <tr>
              <td className="py-4 font-medium">Custom integrations</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">-</td>
              <td className="py-4 text-center">✓</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mx-auto mt-16 max-w-[58rem] text-center">
        <h2 className="font-heading text-3xl font-bold">Frequently Asked Questions</h2>
        <ul className="mt-8 grid gap-6 text-left md:grid-cols-2">
          <li className="space-y-2">
            <h3 className="font-bold">Can I change my plan later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be applied at the start of your next
              billing cycle.
            </p>
          </li>
          <li className="space-y-2">
            <h3 className="font-bold">How do I cancel my subscription?</h3>
            <p className="text-muted-foreground">
              You can cancel your subscription from your account settings. You'll continue to have access until the end
              of your current billing period.
            </p>
          </li>
          <li className="space-y-2">
            <h3 className="font-bold">Do you offer refunds?</h3>
            <p className="text-muted-foreground">
              We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact our support
              team.
            </p>
          </li>
          <li className="space-y-2">
            <h3 className="font-bold">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </li>
        </ul>
      </div>
    </div>
  )
}
