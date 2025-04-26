"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight, CheckCircle, Shield, Zap, Users, Code, Database } from "lucide-react"

export default function EnterprisePage() {
    const enterpriseFeatures = [
        {
            title: "Dedicated Support",
            description: "Get priority 24/7 support from our dedicated customer success team",
            icon: <Users className="h-6 w-6 text-primary" />,
        },
        {
            title: "Advanced Security",
            description: "Enterprise-grade security with SSO, role-based permissions, and more",
            icon: <Shield className="h-6 w-6 text-primary" />,
        },
        {
            title: "Custom Integrations",
            description: "Connect with your existing tools through our flexible API",
            icon: <Code className="h-6 w-6 text-primary" />,
        },
        {
            title: "Unlimited Content",
            description: "Create unlimited content across all formats and channels",
            icon: <Database className="h-6 w-6 text-primary" />,
        },
        {
            title: "High Performance",
            description: "Lightning-fast content generation with priority processing",
            icon: <Zap className="h-6 w-6 text-primary" />,
        },
    ]

    const enterpriseLogos = [
        "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563694983011-6f4d90358083?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1622644896619-75ec1c410858?q=80&w=1974&auto=format&fit=crop",
    ]

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-background to-background/80">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Solutions</h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Powerful AI content creation tools built for large organizations with custom needs and enterprise requirements
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="gradient-primary">
                                    Request Demo
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button size="lg" variant="outline">
                                    Contact Sales
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="rounded-xl border shadow-xl overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                                    alt="Enterprise Dashboard"
                                    width={600}
                                    height={400}
                                    className="w-full object-cover"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Trusted By */}
                    <motion.div
                        className="mb-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-8">Trusted by Leading Companies</h2>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                            {enterpriseLogos.map((logo, index) => (
                                <div key={index} className="w-32 h-16 relative grayscale hover:grayscale-0 transition-all">
                                    <Image src={logo} alt={`Enterprise client ${index + 1}`} fill className="object-contain" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Features */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
                            <p className="text-muted-foreground text-lg">
                                Everything you need to scale content creation across your organization
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {enterpriseFeatures.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="dashboard-card h-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Custom Implementation */}
                    <motion.div
                        className="bg-muted/50 rounded-xl p-8 md:p-12 mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Custom Implementation</h2>
                                <p className="text-muted-foreground mb-6">
                                    Our enterprise solutions are tailored to your organization's specific needs and requirements.
                                </p>
                                <ul className="space-y-3 mb-6">
                                    {[
                                        "Dedicated onboarding and training",
                                        "Custom AI model training",
                                        "White-labeled solutions",
                                        "Advanced analytics and reporting",
                                        "Custom workflows and automation",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="gradient-primary">
                                    Learn More
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="rounded-xl border overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop"
                                        alt="Custom Implementation"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Scale Your Content Creation?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Get in touch with our sales team to learn how AI Content Pilot can transform your organization's content strategy
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/contact">
                                <Button size="lg" className="gradient-primary">
                                    Request Demo
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}