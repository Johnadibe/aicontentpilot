"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

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

export default function AboutPage() {
    // Refs and animations for scroll reveal
    const heroRef = useRef(null)
    const storyRef = useRef(null)
    const valuesRef = useRef(null)
    const teamRef = useRef(null)
    const ctaRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
    const storyInView = useInView(storyRef, { once: true, amount: 0.3 })
    const valuesInView = useInView(valuesRef, { once: true, amount: 0.1 })
    const teamInView = useInView(teamRef, { once: true, amount: 0.1 })
    const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

    const heroControls = useAnimation()
    const storyControls = useAnimation()
    const valuesControls = useAnimation()
    const teamControls = useAnimation()
    const ctaControls = useAnimation()

    useEffect(() => {
        if (heroInView) heroControls.start("visible")
        if (storyInView) storyControls.start("visible")
        if (valuesInView) valuesControls.start("visible")
        if (teamInView) teamControls.start("visible")
        if (ctaInView) ctaControls.start("visible")
    }, [
        heroInView,
        storyInView,
        valuesInView,
        teamInView,
        ctaInView,
        heroControls,
        storyControls,
        valuesControls,
        teamControls,
        ctaControls,
    ])

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
                                About Us
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                                We're on a mission to{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                                    revolutionize
                                </span>{" "}
                                content creation
                            </motion.h1>
                            <motion.p variants={fadeIn} className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                                AI Content Pilot was founded with a simple goal: make professional content creation accessible to
                                everyone.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="relative w-full max-w-4xl aspect-[16/9] rounded-xl overflow-hidden shadow-xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=960&h=540&auto=format&fit=crop"
                                alt="Our team at work"
                                width={960}
                                height={540}
                                className="object-cover w-full h-full"
                            />
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

            {/* Our Story Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
                <div className="container px-4 md:px-6">
                    <motion.div
                        ref={storyRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={storyControls}
                        className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center"
                    >
                        <motion.div variants={fadeIn} className="space-y-6">
                            <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                                Our Story
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">From Idea to Innovation</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    Founded in 2022, AI Content Pilot began when our founders experienced firsthand the challenges of
                                    creating high-quality content at scale. They realized that traditional content creation methods were
                                    too slow, expensive, and inconsistent.
                                </p>
                                <p>
                                    With backgrounds in AI, content marketing, and software development, they set out to build a platform
                                    that would leverage the latest advancements in artificial intelligence to make professional content
                                    creation accessible to everyone.
                                </p>
                                <p>
                                    Today, AI Content Pilot serves thousands of content creators, marketers, and businesses around the
                                    world, helping them create better content in less time.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href="/contact">
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                        Get in Touch
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div variants={fadeIn} className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&h=600&auto=format&fit=crop"
                                alt="Our founders"
                                width={600}
                                height={600}
                                className="object-cover w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="w-full py-16 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <motion.div
                        ref={valuesRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={valuesControls}
                        className="flex flex-col items-center justify-center space-y-8 text-center"
                    >
                        <motion.div variants={fadeIn} className="space-y-4 max-w-3xl">
                            <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                                Our Values
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">What We Stand For</h2>
                            <p className="text-muted-foreground md:text-lg">
                                Our core values guide everything we do at AI Content Pilot
                            </p>
                        </motion.div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8">
                            {[
                                {
                                    title: "Innovation",
                                    description:
                                        "We're constantly pushing the boundaries of what's possible with AI and content creation.",
                                },
                                {
                                    title: "Quality",
                                    description:
                                        "We believe that AI should enhance human creativity, not replace it. Quality is our top priority.",
                                },
                                {
                                    title: "Accessibility",
                                    description:
                                        "We're committed to making professional content creation accessible to everyone, regardless of budget or experience.",
                                },
                                {
                                    title: "Transparency",
                                    description: "We believe in being open about how our AI works and the limitations of the technology.",
                                },
                                {
                                    title: "Customer Success",
                                    description:
                                        "Your success is our success. We're dedicated to helping you achieve your content goals.",
                                },
                                {
                                    title: "Ethical AI",
                                    description:
                                        "We're committed to developing and using AI responsibly, with human oversight and control.",
                                },
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    variants={fadeIn}
                                    className="flex flex-col items-center space-y-4 rounded-xl border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm text-center"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                                        <span className="text-xl font-bold text-primary">{index + 1}</span>
                                    </div>
                                    <h3 className="text-xl font-bold">{value.title}</h3>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
                <div className="container px-4 md:px-6">
                    <motion.div
                        ref={teamRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={teamControls}
                        className="flex flex-col items-center justify-center space-y-8 text-center"
                    >
                        <motion.div variants={fadeIn} className="space-y-4 max-w-3xl">
                            <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                                Our Team
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                Meet the People Behind AI Content Pilot
                            </h2>
                            <p className="text-muted-foreground md:text-lg">
                                We're a diverse team of AI experts, content creators, and software engineers
                            </p>
                        </motion.div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
                            {[
                                {
                                    name: "Alex Johnson",
                                    role: "Chief Executive Officer",
                                    image: "https://randomuser.me/api/portraits/men/32.jpg",
                                },
                                {
                                    name: "Sarah Chen",
                                    role: "Chief Technology Officer",
                                    image: "https://randomuser.me/api/portraits/women/44.jpg",
                                },
                                {
                                    name: "Michael Rodriguez",
                                    role: "Chief Product Officer",
                                    image: "https://randomuser.me/api/portraits/men/68.jpg",
                                },
                                {
                                    name: "Emily Patel",
                                    role: "Chief Marketing Officer",
                                    image: "https://randomuser.me/api/portraits/women/33.jpg",
                                },
                                {
                                    name: "David Kim",
                                    role: "Head of AI Research",
                                    image: "https://randomuser.me/api/portraits/men/75.jpg",
                                },
                                {
                                    name: "Jessica Williams",
                                    role: "Head of Content Strategy",
                                    image: "https://randomuser.me/api/portraits/women/63.jpg",
                                },
                                {
                                    name: "Robert Garcia",
                                    role: "Lead Software Engineer",
                                    image: "https://randomuser.me/api/portraits/men/91.jpg",
                                },
                                {
                                    name: "Olivia Thompson",
                                    role: "Customer Success Manager",
                                    image: "https://randomuser.me/api/portraits/women/29.jpg",
                                },
                            ].map((member, index) => (
                                <motion.div key={index} variants={fadeIn} className="flex flex-col items-center space-y-4">
                                    <div className="relative h-48 w-48 overflow-hidden rounded-xl">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={192}
                                            height={192}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold">{member.name}</h3>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link href="#" className="text-muted-foreground hover:text-primary">
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
                                                className="h-4 w-4"
                                            >
                                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                                <rect width="4" height="12" x="2" y="9"></rect>
                                                <circle cx="4" cy="4" r="2"></circle>
                                            </svg>
                                        </Link>
                                        <Link href="#" className="text-muted-foreground hover:text-primary">
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
                                                className="h-4 w-4"
                                            >
                                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
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
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Join Our Team</h2>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                    We're always looking for talented individuals to join our mission of revolutionizing content creation.
                                </p>
                            </motion.div>
                            <motion.div variants={fadeIn} className="flex flex-col gap-4 min-[400px]:flex-row">
                                <Link href="/careers">
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base px-8 py-6 h-auto">
                                        View Open Positions
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/contact">
                                    <Button variant="outline" className="text-base px-8 py-6 h-auto">
                                        Contact Us
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