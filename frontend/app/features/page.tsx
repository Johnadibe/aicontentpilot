"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

export default function FeaturesPage() {
    // Refs and animations for scroll reveal
    const heroRef = useRef(null)
    const featuresRef = useRef(null)
    const ctaRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
    const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 })
    const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

    const heroControls = useAnimation()
    const featuresControls = useAnimation()
    const ctaControls = useAnimation()

    useEffect(() => {
        if (heroInView) heroControls.start("visible")
        if (featuresInView) featuresControls.start("visible")
        if (ctaInView) ctaControls.start("visible")
    }, [heroInView, featuresInView, ctaInView, heroControls, featuresControls, ctaControls])

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24 lg:pt-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30"></div>

                <div className="container px-4 md:px-6 relative z-10">
                    <motion.div
                        ref={heroRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={heroControls}
                        className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-1.5 text-sm font-medium text-primary mb-2"
                            >
                                Features
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                                Powerful AI Tools for{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                                    Content Creation
                                </span>
                            </motion.h1>
                            <motion.p variants={fadeIn} className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                                Discover all the powerful features that make AI Content Pilot the ultimate platform for creating,
                                optimizing, and managing your content.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg
                        className="relative block w-full h-[50px] md:h-[70px]"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c62.5,0,125.91-16.77,186.19-32.86Z"
                            className="fill-muted/50"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Feature Categories Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
                <div className="container px-4 md:px-6">
                    <Tabs defaultValue="content" className="w-full">
                        <div className="flex justify-center mb-8">
                            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-2xl">
                                <TabsTrigger value="content">Content Creation</TabsTrigger>
                                <TabsTrigger value="images">Image Generation</TabsTrigger>
                                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                                <TabsTrigger value="management">Management</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="content" className="space-y-12">
                            <div className="grid gap-12 lg:grid-cols-2 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold tracking-tighter">AI-Powered Content Creation</h2>
                                    <p className="text-muted-foreground">
                                        Our advanced AI models help you create high-quality content for any purpose in seconds. From blog
                                        posts to social media captions, our platform has you covered.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Blog posts and articles",
                                            "Social media content",
                                            "Email newsletters",
                                            "Product descriptions",
                                            "Ad copy",
                                            "Website copy",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4">
                                        <Link href="/auth/register">
                                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                                Try Content Creation
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-xl overflow-hidden shadow-xl border"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=600&h=400&auto=format&fit=crop"
                                        alt="AI Content Creation"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                    />
                                </motion.div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: "Advanced Templates",
                                        description:
                                            "Choose from hundreds of templates designed for specific content types and industries.",
                                    },
                                    {
                                        title: "Tone & Style Control",
                                        description: "Adjust the tone, style, and voice of your content to match your brand.",
                                    },
                                    {
                                        title: "Multilingual Support",
                                        description: "Create content in multiple languages with native-quality translations.",
                                    },
                                    {
                                        title: "Content Expansion",
                                        description: "Automatically expand short content into longer, more detailed pieces.",
                                    },
                                    {
                                        title: "Content Summarization",
                                        description: "Condense long-form content into concise summaries for different purposes.",
                                    },
                                    {
                                        title: "Research Integration",
                                        description: "Incorporate relevant research and data into your content automatically.",
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col space-y-3 rounded-xl border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm"
                                    >
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="images" className="space-y-12">
                            <div className="grid gap-12 lg:grid-cols-2 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold tracking-tighter">AI Image Generation</h2>
                                    <p className="text-muted-foreground">
                                        Create stunning, unique images for your content with our AI image generation tools. Perfect for blog
                                        headers, social media posts, and more.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Blog and article featured images",
                                            "Social media graphics",
                                            "Product visualization",
                                            "Custom illustrations",
                                            "Banner and ad creatives",
                                            "Presentation visuals",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4">
                                        <Link href="/auth/register">
                                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                                Try Image Generation
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-xl overflow-hidden shadow-xl border"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&h=400&auto=format&fit=crop"
                                        alt="AI Image Generation"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                    />
                                </motion.div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: "Style Customization",
                                        description: "Choose from various artistic styles and visual aesthetics for your images.",
                                    },
                                    {
                                        title: "Image Variations",
                                        description: "Generate multiple variations of an image to find the perfect match.",
                                    },
                                    {
                                        title: "Custom Dimensions",
                                        description: "Create images in specific dimensions for different platforms and purposes.",
                                    },
                                    {
                                        title: "Brand Consistency",
                                        description: "Maintain brand consistency with color schemes and visual elements.",
                                    },
                                    {
                                        title: "Image Editing",
                                        description: "Edit and enhance generated images with our built-in tools.",
                                    },
                                    {
                                        title: "Prompt Builder",
                                        description: "Use our prompt builder to create detailed image generation instructions.",
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col space-y-3 rounded-xl border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm"
                                    >
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="optimization" className="space-y-12">
                            {/* Similar structure for Optimization tab */}
                            <div className="grid gap-12 lg:grid-cols-2 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold tracking-tighter">Content Optimization</h2>
                                    <p className="text-muted-foreground">
                                        Optimize your content for search engines, readability, and engagement with our AI-powered tools.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "SEO optimization",
                                            "Readability analysis",
                                            "Grammar and style checking",
                                            "Keyword optimization",
                                            "Sentiment analysis",
                                            "Content scoring",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4">
                                        <Link href="/auth/register">
                                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                                Try Content Optimization
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-xl overflow-hidden shadow-xl border"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop"
                                        alt="Content Optimization"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                    />
                                </motion.div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: "SEO Recommendations",
                                        description: "Get actionable recommendations to improve your content's search engine ranking.",
                                    },
                                    {
                                        title: "Readability Scoring",
                                        description: "Analyze and improve the readability of your content for different audiences.",
                                    },
                                    {
                                        title: "Grammar Correction",
                                        description: "Automatically detect and correct grammar, spelling, and punctuation errors.",
                                    },
                                    {
                                        title: "Keyword Analysis",
                                        description: "Identify and optimize for relevant keywords to improve search visibility.",
                                    },
                                    {
                                        title: "Tone Adjustment",
                                        description: "Adjust the tone of your content to match your brand voice and audience preferences.",
                                    },
                                    {
                                        title: "Content Enhancement",
                                        description: "Get suggestions to enhance your content with relevant information and examples.",
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col space-y-3 rounded-xl border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm"
                                    >
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="management" className="space-y-12">
                            {/* Similar structure for Management tab */}
                            <div className="grid gap-12 lg:grid-cols-2 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-3xl font-bold tracking-tighter">Content Management</h2>
                                    <p className="text-muted-foreground">
                                        Organize, schedule, and manage all your content in one place with our comprehensive content
                                        management system.
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            "Content library",
                                            "Version history",
                                            "Content scheduling",
                                            "Team collaboration",
                                            "Content organization",
                                            "Publishing integrations",
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4">
                                        <Link href="/auth/register">
                                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                                Try Content Management
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-xl overflow-hidden shadow-xl border"
                                >
                                    <Image
                                        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&h=400&auto=format&fit=crop"
                                        alt="Content Management"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                    />
                                </motion.div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        title: "Content Library",
                                        description: "Store and organize all your content in a centralized library for easy access.",
                                    },
                                    {
                                        title: "Version Control",
                                        description: "Keep track of content revisions and easily revert to previous versions when needed.",
                                    },
                                    {
                                        title: "Content Calendar",
                                        description: "Schedule and plan your content with an intuitive calendar interface.",
                                    },
                                    {
                                        title: "Team Collaboration",
                                        description: "Collaborate with team members on content creation, editing, and approval.",
                                    },
                                    {
                                        title: "Folder Organization",
                                        description: "Organize your content into folders and categories for better management.",
                                    },
                                    {
                                        title: "Publishing Workflow",
                                        description: "Set up custom workflows for content approval and publishing processes.",
                                    },
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="flex flex-col space-y-3 rounded-xl border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm"
                                    >
                                        <h3 className="text-xl font-bold">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-16 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <motion.div
                        ref={ctaRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={ctaControls}
                        className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-background p-8 md:p-12 lg:p-16 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl"></div>
                        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-500/20 to-primary/20 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
                            <motion.div variants={fadeIn} className="space-y-4">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                                    Ready to Transform Your Content Creation?
                                </h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Join thousands of content creators who are using AI Content Pilot to create amazing content faster and
                                    more efficiently.
                                </p>
                            </motion.div>
                            <motion.div variants={fadeIn} className="flex flex-col gap-4 min-[400px]:flex-row">
                                <Link href="/auth/register">
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base px-8 py-6 h-auto">
                                        Start Your Free Trial
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" className="text-base px-8 py-6 h-auto">
                                        Contact Sales
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    )
}