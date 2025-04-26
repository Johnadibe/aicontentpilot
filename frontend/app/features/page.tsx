"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
    MessageSquare, BookText, Mail, Lightbulb, ImageIcon, BarChart,
    Zap, Shield, Globe, Code, Settings, Users, Terminal, Database
} from "lucide-react"

const mainFeatures = [
    {
        title: "AI Content Generation",
        description: "Generate high-quality content in seconds with our advanced AI technology.",
        icon: <Lightbulb className="h-6 w-6" />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    },
    {
        title: "Content Analytics",
        description: "Track and analyze your content performance with detailed insights.",
        icon: <BarChart className="h-6 w-6" />,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
    },
    {
        title: "Email Marketing",
        description: "Create engaging email campaigns that convert with AI-powered content.",
        icon: <Mail className="h-6 w-6" />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    },
]

const additionalFeatures = [
    {
        title: "Social Media Management",
        description: "Generate and schedule social media posts across multiple platforms.",
        icon: <MessageSquare className="h-6 w-6" />,
    },
    {
        title: "Content Library",
        description: "Store and organize all your content in one secure place.",
        icon: <BookText className="h-6 w-6" />,
    },
    {
        title: "Image Generation",
        description: "Create custom images for your content with AI image generation.",
        icon: <ImageIcon className="h-6 w-6" />,
    },
    {
        title: "API Access",
        description: "Integrate our AI capabilities into your own applications.",
        icon: <Code className="h-6 w-6" />,
    },
    {
        title: "Team Collaboration",
        description: "Work together with your team on content creation and management.",
        icon: <Users className="h-6 w-6" />,
    },
    {
        title: "Custom Templates",
        description: "Create and save your own content templates for quick generation.",
        icon: <Settings className="h-6 w-6" />,
    },
]

const technicalFeatures = [
    {
        title: "High Performance",
        description: "Lightning-fast content generation with minimal latency.",
        icon: <Zap className="h-6 w-6" />,
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade security with end-to-end encryption.",
        icon: <Shield className="h-6 w-6" />,
    },
    {
        title: "Global Infrastructure",
        description: "Content delivery optimized for global audiences.",
        icon: <Globe className="h-6 w-6" />,
    },
    {
        title: "CLI Integration",
        description: "Command-line interface for advanced users.",
        icon: <Terminal className="h-6 w-6" />,
    },
    {
        title: "Data Export",
        description: "Export your content in multiple formats.",
        icon: <Database className="h-6 w-6" />,
    },
]

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-background to-background/80">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to create, manage, and optimize your content
                        </p>
                    </motion.div>

                    {/* Main Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                        {mainFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 + index * 0.2 }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="rounded-lg bg-primary/10 p-2">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                                </div>
                                <p className="text-muted-foreground mb-6">{feature.description}</p>
                                <div className="relative h-48 overflow-hidden rounded-lg">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Features */}
                    <div className="mb-20">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Additional Features
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {additionalFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="rounded-lg bg-primary/10 p-2">{feature.icon}</div>
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Technical Features */}
                    <div className="mb-20">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Technical Excellence
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            {technicalFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="rounded-lg bg-primary/10 p-2">{feature.icon}</div>
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join thousands of businesses using AI Content Pilot
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Start Free Trial
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}