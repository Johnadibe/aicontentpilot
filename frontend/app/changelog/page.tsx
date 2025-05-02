import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
    title: "Changelog | AI Content Pilot",
    description: "See what's new in AI Content Pilot and what we're working on.",
}

const changelogItems = [
    {
        version: "2.4.0",
        date: "May 1, 2025",
        title: "Multi-language Support",
        description:
            "Generate content in 25+ languages, translate existing content, and analyze foreign language sentiment.",
        type: "feature",
        changes: [
            "Added support for generating content in 25+ languages",
            "New translation tool to convert content between languages",
            "Language detection in the content analyzer",
            "Extended templates for international markets",
            "UI language preferences in user settings",
        ],
    },
    {
        version: "2.3.2",
        date: "April 15, 2025",
        title: "Performance Improvements",
        description: "Major speed improvements for content generation and image processing.",
        type: "improvement",
        changes: [
            "50% faster content generation response times",
            "Optimized image processing pipeline",
            "Reduced API latency for all requests",
            "Improved content loading performance",
            "Better caching for frequently accessed templates",
        ],
    },
    {
        version: "2.3.0",
        date: "March 28, 2025",
        title: "Advanced SEO Tools",
        description: "New suite of SEO tools to optimize your content for search engines.",
        type: "feature",
        changes: [
            "Keyword density analyzer with recommendations",
            "SERP preview for generated content",
            "Schema markup generator for various content types",
            "Readability scoring with improvement suggestions",
            "Competitor analysis for top-ranking content",
        ],
    },
    {
        version: "2.2.1",
        date: "March 10, 2025",
        title: "Bug Fixes & UI Improvements",
        description: "Fixed several bugs and improved the user interface.",
        type: "fix",
        changes: [
            "Fixed issue with content export in certain formats",
            "Corrected scheduling calendar date handling",
            "Fixed team member invitation email delivery",
            "Improved contrast in dark mode",
            "Fixed mobile navigation menu display problem",
        ],
    },
    {
        version: "2.2.0",
        date: "February 22, 2025",
        title: "Team Collaboration Features",
        description: "New tools to help teams work together more effectively.",
        type: "feature",
        changes: [
            "Real-time collaborative editing for shared content",
            "Comment and suggestion system for content review",
            "Team workspaces with customizable permissions",
            "Activity log for all team content changes",
            "Enhanced sharing options for templates and generated content",
        ],
    },
    {
        version: "2.1.0",
        date: "January 30, 2025",
        title: "Content Calendar & Scheduling",
        description: "Plan and schedule your content publishing across platforms.",
        type: "feature",
        changes: [
            "Visual content calendar with drag-and-drop interface",
            "Automated publishing to connected platforms",
            "Optimal posting time recommendations",
            "Recurring content schedules",
            "Publishing queue with preview and edit capabilities",
        ],
    },
]

export default function ChangelogPage() {
    return (
        <div className="container py-12 md:py-24 space-y-16 animate-fade-in px-2 sm:px-4 lg:px-6">
            <section className="text-center space-y-4">
                <div className="inline-block rounded-lg bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 px-3 py-1 text-sm">
                    Updates
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent">
                    Product Changelog
                </h1>
                <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
                    Stay up to date with all the latest features, improvements, and fixes in AI Content Pilot.
                </p>
            </section>

            <Tabs defaultValue="all" className="w-full">
                <TabsList className="flex flex-wrap w-full justify-start gap-2 h-auto p-1 mb-8">
                    <TabsTrigger value="all" className="rounded-full">
                        All Updates
                    </TabsTrigger>
                    <TabsTrigger value="feature" className="rounded-full">
                        New Features
                    </TabsTrigger>
                    <TabsTrigger value="improvement" className="rounded-full">
                        Improvements
                    </TabsTrigger>
                    <TabsTrigger value="fix" className="rounded-full">
                        Bug Fixes
                    </TabsTrigger>
                </TabsList>

                {["all", "feature", "improvement", "fix"].map((filter) => (
                    <TabsContent key={filter} value={filter} className="space-y-8 mt-0">
                        {changelogItems
                            .filter((item) => filter === "all" || item.type === filter)
                            .map((item) => (
                                <Card
                                    key={item.version}
                                    className="overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300"
                                >
                                    <CardHeader className="p-6">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-mono text-sm">{item.version}</h3>
                                                <time dateTime={item.date} className="text-sm text-muted-foreground">
                                                    {item.date}
                                                </time>
                                            </div>
                                            <Badge
                                                className={
                                                    item.type === "feature"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                        : item.type === "improvement"
                                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                }
                                            >
                                                {item.type === "feature"
                                                    ? "New Feature"
                                                    : item.type === "improvement"
                                                        ? "Improvement"
                                                        : "Bug Fix"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl">{item.title}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="border-t p-6 pt-4">
                                        <ul className="space-y-1">
                                            {item.changes.map((change, i) => (
                                                <li key={i} className="text-sm flex items-start">
                                                    <span className="text-green-500 mr-2">•</span>
                                                    {change}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                    </TabsContent>
                ))}
            </Tabs>

            <section className="mx-auto max-w-3xl py-12 px-6 md:px-12 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 text-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Want to request a feature?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    We're constantly improving AI Content Pilot based on user feedback. Let us know what you'd like to see next!
                </p>
                <div>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white"
                    >
                        Submit Feature Request
                    </Button>
                </div>
            </section>
        </div>
    )
}