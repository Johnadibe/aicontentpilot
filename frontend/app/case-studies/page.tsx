"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
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
            staggerChildren: 0.2,
        },
    },
}

// Case studies data
const caseStudies = [
    {
        id: 1,
        title: "How TechGrowth Increased Blog Traffic by 300% with AI Content",
        company: "TechGrowth",
        industry: "SaaS",
        results: [
            "300% increase in blog traffic",
            "45% reduction in content creation time",
            "25% increase in lead generation",
        ],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop",
        featured: true,
    },
    {
        id: 2,
        title: "E-commerce Product Descriptions that Boosted Conversion Rates",
        company: "FashionHub",
        industry: "E-commerce",
        results: [
            "35% increase in conversion rate",
            "40% reduction in product description creation time",
            "28% decrease in return rate",
        ],
        image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=600&h=400&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 3,
        title: "How a Marketing Agency Scaled Content Production for 15 Clients",
        company: "GrowthMarketing",
        industry: "Marketing Agency",
        results: [
            "200% increase in content output",
            "60% reduction in content creation costs",
            "4.8/5 average client satisfaction",
        ],
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&h=400&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 4,
        title: "Financial Services Firm Creates Compliant Content at Scale",
        company: "WealthWise",
        industry: "Financial Services",
        results: [
            "100% compliance with regulations",
            "70% faster content approval process",
            "45% increase in client engagement",
        ],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&h=400&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 5,
        title: "Healthcare Provider Improves Patient Education Materials",
        company: "MediCare Plus",
        industry: "Healthcare",
        results: [
            "90% of patients reported better understanding",
            "50% reduction in content creation time",
            "30% increase in patient satisfaction",
        ],
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&h=400&auto=format&fit=crop",
        featured: false,
    },
    {
        id: 6,
        title: "Travel Blog Increases Engagement with AI-Generated Content",
        company: "Wanderlust",
        industry: "Travel & Tourism",
        results: ["250% increase in time on page", "40% increase in social shares", "65% growth in subscriber base"],
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&h=400&auto=format&fit=crop",
        featured: false,
    },
]

export default function CaseStudiesPage() {
    // Refs and animations for scroll reveal
    const heroRef = useRef(null)
    const featuredRef = useRef(null)
    const studiesRef = useRef(null)
    const ctaRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
    const featuredInView = useInView(featuredRef, { once: true, amount: 0.3 })
    const studiesInView = useInView(studiesRef, { once: true, amount: 0.1 })
    const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

    const heroControls = useAnimation()
    const featuredControls = useAnimation()
    const studiesControls = useAnimation()
    const ctaControls = useAnimation()

    useEffect(() => {
        if (heroInView) heroControls.start("visible")
        if (featuredInView) featuredControls.start("visible")
        if (studiesInView) studiesControls.start("visible")
        if (ctaInView) ctaControls.start("visible")
    }, [
        heroInView,
        featuredInView,
        studiesInView,
        ctaInView,
        heroControls,
        featuredControls,
        studiesControls,
        ctaControls,
    ])

    // Get featured case study
    const featuredCaseStudy = caseStudies.find((study) => study.featured)
    const regularCaseStudies = caseStudies.filter((study) => !study.featured)

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
                                Success Stories
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                                See How Our Customers{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                                    Succeed
                                </span>
                            </motion.h1>
                            <motion.p variants={fadeIn} className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                                Discover how businesses of all sizes are transforming their content creation process with AI Content
                                Pilot.
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

            {/* Featured Case Study Section */}
            {featuredCaseStudy && (
                <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <motion.div
                            ref={featuredRef}
                            variants={staggerContainer}
                            initial="hidden"
                            animate={featuredControls}
                            className="flex flex-col items-center justify-center space-y-8 text-center mb-12"
                        >
                            <motion.div variants={fadeIn} className="space-y-2">
                                <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                                    Featured Case Study
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Customer Success Story</h2>
                            </motion.div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="grid gap-12 lg:grid-cols-2 items-center">
                            <div className="relative rounded-xl overflow-hidden shadow-xl border">
                                <Image
                                    src={featuredCaseStudy.image}
                                    alt={featuredCaseStudy.title}
                                    width={600}
                                    height={400}
                                    className="w-full object-cover"
                                />
                            </div>
                            <div className="space-y-6">
                                <Badge className="mb-2">{featuredCaseStudy.industry}</Badge>
                                <h3 className="text-2xl font-bold md:text-3xl">{featuredCaseStudy.title}</h3>
                                <p className="text-muted-foreground">
                                    Learn how {featuredCaseStudy.company} transformed their content strategy with AI Content Pilot and
                                    achieved remarkable results.
                                </p>
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Key Results:</h4>
                                    <ul className="space-y-2">
                                        {featuredCaseStudy.results.map((result, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="mr-2 h-5 w-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-3 w-3"
                                                    >
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </div>
                                                <span>{result}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="pt-4">
                                    <Link href={`/case-studies/${featuredCaseStudy.id}`}>
                                        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                            Read Full Case Study
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* More Case Studies Section */}
            <section className="w-full py-16 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <motion.div
                        ref={studiesRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={studiesControls}
                        className="flex flex-col items-center justify-center space-y-8 text-center mb-12"
                    >
                        <motion.div variants={fadeIn} className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">More Success Stories</h2>
                            <p className="text-muted-foreground md:text-lg max-w-3xl mx-auto">
                                Explore how companies across different industries are using AI Content Pilot to transform their content
                                creation process.
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={staggerContainer} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {regularCaseStudies.map((study, index) => (
                            <motion.div
                                key={study.id}
                                variants={fadeIn}
                                className="group relative flex flex-col overflow-hidden rounded-xl border bg-gradient-to-br from-background to-muted/30 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={study.image}
                                        alt={study.title}
                                        width={384}
                                        height={192}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-3 left-3">
                                        <Badge variant="secondary" className="bg-black/50 text-white hover:bg-black/60">
                                            {study.industry}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-2">{study.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-4">
                                        {study.company} achieved {study.results[0].toLowerCase()} using AI Content Pilot.
                                    </p>
                                    <div className="mt-auto">
                                        <Link
                                            href={`/case-studies/${study.id}`}
                                            className="inline-flex items-center text-primary font-medium"
                                        >
                                            Read Case Study
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Industries Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-8 text-center mb-12">
                        <div className="space-y-2 max-w-3xl">
                            <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                                Industries
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Solutions for Every Industry</h2>
                            <p className="text-muted-foreground md:text-lg">
                                AI Content Pilot helps businesses across all industries create better content faster.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                industry: "E-commerce",
                                description: "Create product descriptions, email campaigns, and social media content that converts.",
                                icon: "https://cdn-icons-png.flaticon.com/128/3144/3144456.png",
                            },
                            {
                                industry: "SaaS & Technology",
                                description: "Generate technical blog posts, documentation, and marketing materials.",
                                icon: "https://cdn-icons-png.flaticon.com/128/2920/2920277.png",
                            },
                            {
                                industry: "Marketing Agencies",
                                description: "Scale content production for multiple clients without sacrificing quality.",
                                icon: "https://cdn-icons-png.flaticon.com/128/1998/1998087.png",
                            },
                            {
                                industry: "Financial Services",
                                description: "Create compliant content that explains complex financial concepts clearly.",
                                icon: "https://cdn-icons-png.flaticon.com/128/2830/2830284.png",
                            },
                            {
                                industry: "Healthcare",
                                description: "Develop patient education materials and healthcare marketing content.",
                                icon: "https://cdn-icons-png.flaticon.com/128/2966/2966327.png",
                            },
                            {
                                industry: "Education",
                                description: "Create engaging educational content, course materials, and communications.",
                                icon: "https://cdn-icons-png.flaticon.com/128/2232/2232688.png",
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col space-y-4 rounded-xl border bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                                    <Image
                                        src={item.icon}
                                        alt={item.industry}
                                        width={24}
                                        height={24}
                                        className="h-6 w-6"
                                    />
                                </div>
                                <h3 className="text-xl font-bold">{item.industry}</h3>
                                <p className="text-muted-foreground">{item.description}</p>
                                <div className="pt-2">
                                    <Link href="/contact" className="inline-flex items-center text-primary font-medium">
                                        Learn More
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                                    Ready to Write Your Success Story?
                                </h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    Join thousands of businesses that are transforming their content creation process with AI Content
                                    Pilot.
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
                                        Talk to Sales
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