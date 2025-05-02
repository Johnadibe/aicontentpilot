import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
    title: "Integrations | AI Content Pilot",
    description: "Connect AI Content Pilot with your favorite tools and platforms.",
}

const integrations = [
    {
        name: "WordPress",
        description: "Publish content directly to your WordPress blog with one click.",
        category: "CMS",
        image: "https://cdn.iconscout.com/icon/free/png-256/wordpress-226052.png",
        popular: true,
    },
    {
        name: "Shopify",
        description: "Generate product descriptions and marketing copy for your Shopify store.",
        category: "E-commerce",
        image: "https://cdn.iconscout.com/icon/free/png-256/shopify-226579.png",
        popular: true,
    },
    {
        name: "HubSpot",
        description: "Sync your content and contacts with HubSpot CRM.",
        category: "CRM",
        image: "https://cdn.iconscout.com/icon/free/png-256/hubspot-3521477-2944920.png",
        popular: false,
    },
    {
        name: "Mailchimp",
        description: "Create email campaigns and export them directly to Mailchimp.",
        category: "Email",
        image: "https://cdn.iconscout.com/icon/free/png-256/mailchimp-3628110-3030301.png",
        popular: true,
    },
    {
        name: "Buffer",
        description: "Schedule and post your social media content across platforms.",
        category: "Social Media",
        image: "https://cdn.iconscout.com/icon/free/png-256/buffer-3-555980.png",
        popular: false,
    },
    {
        name: "Zapier",
        description: "Connect AI Content Pilot to 3,000+ apps with custom workflows.",
        category: "Automation",
        image: "https://cdn.iconscout.com/icon/free/png-256/zapier-3521491-2944934.png",
        popular: true,
    },
    {
        name: "Slack",
        description: "Get notifications and share content with your team in Slack.",
        category: "Communication",
        image: "https://cdn.iconscout.com/icon/free/png-256/slack-2752072-2284889.png",
        popular: false,
    },
    {
        name: "Google Analytics",
        description: "Track content performance and audience engagement.",
        category: "Analytics",
        image: "https://cdn.iconscout.com/icon/free/png-256/google-analytics-2038788-1721678.png",
        popular: false,
    },
    {
        name: "Airtable",
        description: "Organize and manage your content calendar in Airtable.",
        category: "Organization",
        image: "https://cdn.iconscout.com/icon/free/png-256/airtable-1482122-1254387.png",
        popular: false,
    },
]

const categories = [...new Set(integrations.map((i) => i.category))]

export default function IntegrationsPage() {
    return (
        <div className="container py-12 md:py-24 space-y-16 animate-fade-in px-2 sm:px-4 lg:px-6">
            <section className="text-center space-y-4">
                <div className="inline-block rounded-lg bg-gradient-to-r from-pink-100 to-indigo-100 dark:from-pink-900/20 dark:to-indigo-900/20 px-3 py-1 text-sm">
                    Ecosystem
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Connect with your favorite tools
                </h1>
                <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
                    Seamlessly integrate AI Content Pilot with the apps and services you already use to streamline your content
                    workflow.
                </p>
            </section>

            <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" className="rounded-full" asChild>
                    <Link href="#all">All</Link>
                </Button>
                {categories.map((category) => (
                    <Button key={category} variant="outline" className="rounded-full" asChild>
                        <Link href={`#${category.toLowerCase().replace(" ", "-")}`}>{category}</Link>
                    </Button>
                ))}
            </div>

            <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => (
                    <Card
                        key={integration.name}
                        className="group overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                        <CardHeader className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted/50 flex items-center justify-center">
                                    <Image
                                        src={integration.image || "/placeholder.svg"}
                                        alt={integration.name}
                                        width={48}
                                        height={48}
                                        className="object-contain"
                                    />
                                </div>
                                {integration.popular && (
                                    <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                                        Popular
                                    </Badge>
                                )}
                            </div>
                            <CardTitle className="mt-3">{integration.name}</CardTitle>
                            <CardDescription>{integration.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-6 pt-0">
                            <Button
                                variant="outline"
                                className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:text-white transition-all duration-300"
                            >
                                Connect
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </section>

            <section className="space-y-8 py-12 px-6 md:px-12 rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Can't find what you need?</h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        We're constantly adding new integrations. Request an integration and we'll prioritize it for you.
                    </p>
                </div>
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                    >
                        Request Integration
                    </Button>
                </div>
            </section>
        </div>
    )
}