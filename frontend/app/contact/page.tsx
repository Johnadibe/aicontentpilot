"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import {
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    MessageSquare,
    Clock,
    Send,
    CheckCircle
} from "lucide-react"

export default function ContactPage() {
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [formSubmitting, setFormSubmitting] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setFormSubmitting(true)

        // Simulate form submission
        setTimeout(() => {
            setFormSubmitting(false)
            setFormSubmitted(true)
        }, 1500)
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            We'd love to hear from you. Reach out with any questions, feedback, or inquiries.
                        </p>
                    </motion.div>

                    {/* Contact Information and Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="rounded-xl border bg-background p-8 h-full">
                                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3 mt-1">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Email Us</h3>
                                            <p className="text-muted-foreground mb-1">For general inquiries:</p>
                                            <a href="mailto:info@aicontentpilot.com" className="text-primary hover:underline">
                                                info@aicontentpilot.com
                                            </a>
                                            <p className="text-muted-foreground mt-2 mb-1">For support:</p>
                                            <a href="mailto:support@aicontentpilot.com" className="text-primary hover:underline">
                                                support@aicontentpilot.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3 mt-1">
                                            <Phone className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Call Us</h3>
                                            <p className="text-muted-foreground mb-1">Main office:</p>
                                            <a href="tel:+1-555-123-4567" className="text-primary hover:underline">
                                                +1 (555) 123-4567
                                            </a>
                                            <p className="text-muted-foreground mt-2 mb-1">Support line:</p>
                                            <a href="tel:+1-555-987-6543" className="text-primary hover:underline">
                                                +1 (555) 987-6543
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3 mt-1">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Visit Us</h3>
                                            <p className="text-muted-foreground">
                                                123 AI Innovation Center<br />
                                                Suite 500<br />
                                                San Francisco, CA 94105<br />
                                                United States
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3 mt-1">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Business Hours</h3>
                                            <p className="text-muted-foreground">
                                                Monday - Friday: 9:00 AM - 6:00 PM (PST)<br />
                                                Saturday: 10:00 AM - 2:00 PM (PST)<br />
                                                Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="rounded-xl border bg-background p-8">
                                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                                {formSubmitted ? (
                                    <motion.div
                                        className="text-center py-12"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4 mb-6">
                                            <CheckCircle className="h-12 w-12 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Thank you for reaching out. We'll get back to you as soon as possible.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setFormSubmitted(false)}
                                        >
                                            Send Another Message
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">
                                                    Full Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">
                                                    Email Address
                                                </label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium">
                                                Subject
                                            </label>
                                            <Input
                                                id="subject"
                                                placeholder="How can we help you?"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium">
                                                Message
                                            </label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={5}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="gradient-primary w-full"
                                            disabled={formSubmitting}
                                        >
                                            {formSubmitting ? (
                                                <>Sending Message...</>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Map Section */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
                            <p className="text-muted-foreground text-lg">
                                Visit our headquarters in the heart of San Francisco
                            </p>
                        </div>

                        <div className="rounded-xl border overflow-hidden h-[400px] relative">
                            {/* Map Container */}
                            <div className="w-full h-full">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.035344045803!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2s123%20AI%20Innovation%20Center%2C%20San%20Francisco%2C%20CA%2094105!5e0!3m2!1sen!2sus!4v1234567890"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                />
                            </div>

                            {/* Overlay Card */}
                            <div className="absolute bottom-4 right-4 bg-background/95 p-4 rounded-xl shadow-lg max-w-xs">
                                <h3 className="font-bold text-lg mb-2">AI Content Pilot HQ</h3>
                                <p className="text-muted-foreground text-sm mb-3">
                                    123 AI Innovation Center, Suite 500<br />
                                    San Francisco, CA 94105
                                </p>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href="https://maps.google.com/maps?q=123+AI+Innovation+Center,+San+Francisco,+CA+94105"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                    >
                                        <Button variant="outline" size="sm" className="w-full">
                                            Get Directions
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </a>
                                    <a
                                        href="tel:+1-555-123-4567"
                                        className="w-full"
                                    >
                                        <Button variant="outline" size="sm" className="w-full">
                                            Call Office
                                            <Phone className="ml-2 h-4 w-4" />
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground text-lg">
                                Quick answers to common questions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {[
                                {
                                    question: "How quickly can I expect a response?",
                                    answer: "We typically respond to all inquiries within 24-48 business hours."
                                },
                                {
                                    question: "Do you offer phone support?",
                                    answer: "Yes, our support team is available by phone Monday through Friday, 9 AM to 6 PM PST."
                                },
                                {
                                    question: "Can I schedule a demo?",
                                    answer: "Absolutely! You can request a demo through our contact form or by emailing sales@aicontentpilot.com."
                                },
                                {
                                    question: "Where are your offices located?",
                                    answer: "Our headquarters is in San Francisco, with additional offices in New York, London, and Singapore."
                                }
                            ].map((faq, index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-xl border bg-background p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        className="rounded-2xl bg-muted/50 p-8 md:p-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Experience the power of AI-driven content creation with a free trial of AI Content Pilot.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/register">
                                        <Button className="gradient-primary">
                                            Start Free Trial
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/pricing">
                                        <Button variant="outline">
                                            View Pricing
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="rounded-xl border overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                                        alt="Get Started"
                                        width={600}
                                        height={400}
                                        className="w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}