"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, Shield, Globe, Users, Database, Clock, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import { motion } from "framer-motion"

const plans = [
    {
        name: "Starter",
        price: "$29",
        period: "per month",
        description: "Perfect for individuals and small teams",
        features: [
            "5,000 words per month",
            "Basic AI content generation",
            "Email support",
            "Content analytics",
            "1 user",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Professional",
        price: "$99",
        period: "per month",
        description: "Ideal for growing businesses",
        features: [
            "50,000 words per month",
            "Advanced AI content generation",
            "Priority support",
            "Advanced analytics",
            "5 users",
            "API access",
            "Custom templates",
        ],
        cta: "Start Free Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "per month",
        description: "For large organizations with custom needs",
        features: [
            "Unlimited words",
            "Custom AI models",
            "Dedicated support",
            "Advanced security",
            "Unlimited users",
            "Custom integrations",
            "SLA guarantee",
        ],
        cta: "Contact Sales",
        popular: false,
    },
]

const features = [
    {
        title: "High Performance",
        description: "Lightning-fast content generation with minimal latency",
        icon: <Zap className="h-6 w-6" />,
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade security with end-to-end encryption",
        icon: <Shield className="h-6 w-6" />,
    },
    {
        title: "Global Infrastructure",
        description: "Content delivery optimized for global audiences",
        icon: <Globe className="h-6 w-6" />,
    },
    {
        title: "Team Collaboration",
        description: "Work together with your team on content creation",
        icon: <Users className="h-6 w-6" />,
    },
    {
        title: "Data Export",
        description: "Export your content in multiple formats",
        icon: <Database className="h-6 w-6" />,
    },
    {
        title: "24/7 Support",
        description: "Round-the-clock support for all your needs",
        icon: <Clock className="h-6 w-6" />,
    },
    {
        title: "Community Access",
        description: "Join our community of content creators",
        icon: <MessageSquare className="h-6 w-6" />,
    },
]

const faqs = [
    {
        question: "Can I change plans later?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
        question: "Is there a free trial?",
        answer: "Yes, we offer a 14-day free trial for all plans. No credit card required.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
    },
    {
        question: "Do you offer refunds?",
        answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
    },
]

export default function PricingPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState(0)

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? -1 : index)
    }

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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose the perfect plan for your content needs. No hidden fees.
                        </p>
                    </motion.div>

                    {/* Pricing Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                className={`relative rounded-xl border bg-background p-8 ${plan.popular ? "border-primary shadow-lg" : ""}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                    <p className="text-muted-foreground mt-2">{plan.description}</p>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/90"}`}
                                >
                                    {plan.cta}
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Features Grid */}
                    <div className="mb-20">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            All Plans Include
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
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

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <motion.h2
                            className="text-3xl font-bold text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Frequently Asked Questions
                        </motion.h2>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    className="border rounded-lg p-6 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleFaq(index)}
                                    >
                                        <h3 className="text-xl font-semibold">{faq.question}</h3>
                                        {openFaqIndex === index ? (
                                            <ChevronUp className="h-5 w-5 text-primary" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        )}
                                    </div>
                                    {openFaqIndex === index && (
                                        <p className="text-muted-foreground mt-4">{faq.answer}</p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}