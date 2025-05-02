"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
            staggerChildren: 0.1,
        },
    },
}

// Template categories
const categories = ["All", "Blog Posts", "Social Media", "Email", "Ads", "Website Copy", "Product Descriptions", "SEO"]

// Template data
const templates = [
    {
        id: 1,
        title: "Blog Post Generator",
        description: "Create engaging blog posts with a clear structure and SEO optimization.",
        category: "Blog Posts",
        popular: true,
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Instagram Caption Creator",
        description: "Generate attention-grabbing captions for your Instagram posts.",
        category: "Social Media",
        popular: false,
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Email Newsletter",
        description: "Create professional email newsletters that engage your subscribers.",
        category: "Email",
        popular: true,
        image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Facebook Ad Copy",
        description: "Write compelling ad copy that converts for Facebook campaigns.",
        category: "Ads",
        popular: false,
        image: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 5,
        title: "Product Description",
        description: "Create detailed and persuasive product descriptions for e-commerce.",
        category: "Product Descriptions",
        popular: true,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 6,
        title: "Landing Page Copy",
        description: "Write high-converting copy for your landing pages.",
        category: "Website Copy",
        popular: false,
        image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 7,
        title: "SEO Meta Description",
        description: "Generate optimized meta descriptions for better search visibility.",
        category: "SEO",
        popular: false,
        image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 8,
        title: "Twitter Thread Creator",
        description: "Create engaging Twitter threads that drive engagement.",
        category: "Social Media",
        popular: true,
        image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 9,
        title: "Welcome Email Sequence",
        description: "Create a series of welcome emails to onboard new subscribers.",
        category: "Email",
        popular: false,
        image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 10,
        title: "About Us Page",
        description: "Create a compelling About Us page that tells your brand story.",
        category: "Website Copy",
        popular: false,
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 11,
        title: "LinkedIn Post Generator",
        description: "Create professional LinkedIn posts that drive engagement.",
        category: "Social Media",
        popular: false,
        image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=384&h=192&auto=format&fit=crop",
    },
    {
        id: 12,
        title: "Google Ads Copy",
        description: "Write high-converting copy for Google Ads campaigns.",
        category: "Ads",
        popular: false,
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=384&h=192&auto=format&fit=crop",
    },
]

export default function TemplatesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [filteredTemplates, setFilteredTemplates] = useState(templates)

    // Refs and animations for scroll reveal
    const heroRef = useRef(null)
    const templatesRef = useRef(null)
    const ctaRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
    const templatesInView = useInView(templatesRef, { once: true, amount: 0.1 })
    const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

    const heroControls = useAnimation()
    const templatesControls = useAnimation()
    const ctaControls = useAnimation()

    useEffect(() => {
        if (heroInView) heroControls.start("visible")
        if (templatesInView) templatesControls.start("visible")
        if (ctaInView) ctaControls.start("visible")
    }, [heroInView, templatesInView, ctaInView, heroControls, templatesControls, ctaControls])

    // Filter templates based on search query and category
    useEffect(() => {
        let filtered = templates

        if (searchQuery) {
            filtered = filtered.filter(
                (template) =>
                    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    template.description.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        if (selectedCategory !== "All") {
            filtered = filtered.filter((template) => template.category === selectedCategory)
        }

        setFilteredTemplates(filtered)
    }, [searchQuery, selectedCategory])

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
                                Content Templates
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                                Start with{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                                    Ready-Made
                                </span>{" "}
                                Templates
                            </motion.h1>
                            <motion.p variants={fadeIn} className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                                Browse our library of professionally designed templates to jumpstart your content creation process.
                            </motion.p>
                        </motion.div>

                        <motion.div variants={fadeIn} className="w-full max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search templates..."
                                    className="pl-10 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
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

            {/* Templates Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
                <div className="container px-4 md:px-6">
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Badge
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    className={`cursor-pointer ${selectedCategory === category
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                                        : "hover:bg-muted"
                                        }`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                Newest
                            </Button>
                        </div>
                    </div>

                    <motion.div
                        ref={templatesRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={templatesControls}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template, index) => (
                                <motion.div
                                    key={template.id}
                                    variants={fadeIn}
                                    className="group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted/30 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                                >
                                    {template.popular && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Popular</Badge>
                                        </div>
                                    )}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={template.image}
                                            alt={template.title}
                                            width={384}
                                            height={192}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-3 left-3">
                                            <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60">
                                                {template.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                                        <p className="text-muted-foreground text-sm flex-1 mb-4">{template.description}</p>
                                        <div className="flex justify-between items-center">
                                            <Link href="/auth/register">
                                                <Button variant="outline" size="sm">
                                                    Use Template
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm" className="text-primary">
                                                Preview
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-muted p-6 mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No templates found</h3>
                                <p className="text-muted-foreground mb-4">
                                    We couldn't find any templates matching your search criteria.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedCategory("All")
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </motion.div>
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
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Create Custom Templates</h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Need a custom template for your specific needs? Sign up and create your own templates that you can
                                    reuse anytime.
                                </p>
                            </motion.div>
                            <motion.div variants={fadeIn} className="flex flex-col gap-4 min-[400px]:flex-row">
                                <Link href="/auth/register">
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base px-8 py-6 h-auto">
                                        Get Started Free
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/pricing">
                                    <Button variant="outline" className="text-base px-8 py-6 h-auto">
                                        View Pricing
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