"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight, Linkedin, Twitter, Mail } from "lucide-react"

export default function TeamPage() {
    const teamMembers = [
        {
            name: "Sarah Johnson",
            role: "CEO & Co-Founder",
            bio: "With over 15 years of experience in AI and content marketing, Sarah leads our vision to transform how businesses create content.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop",
            socialLinks: {
                linkedin: "#",
                twitter: "#",
                email: "sarah@aicontentpilot.com",
            },
        },
        {
            name: "Michael Chen",
            role: "CTO & Co-Founder",
            bio: "Michael's expertise in machine learning algorithms powers our AI engine, ensuring top-quality content generation for all users.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
            socialLinks: {
                linkedin: "#",
                twitter: "#",
                email: "michael@aicontentpilot.com",
            },
        },
        {
            name: "Jessica Williams",
            role: "Chief Product Officer",
            bio: "Jessica designs our user experience with a focus on simplicity and power, making AI accessible to everyone.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
            socialLinks: {
                linkedin: "#",
                twitter: "#",
                email: "jessica@aicontentpilot.com",
            },
        },
        {
            name: "David Rodriguez",
            role: "VP of Marketing",
            bio: "David leads our marketing strategy, helping businesses understand how AI can transform their content creation.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
            socialLinks: {
                linkedin: "#",
                twitter: "#",
                email: "david@aicontentpilot.com",
            },
        },
        {
            name: "Emily Chang",
            role: "Head of Customer Success",
            bio: "Emily ensures our customers get the most value from our platform through education and support.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop",
            socialLinks: {
                linkedin: "#",
                twitter: "#",
                email: "emily@aicontentpilot.com",
            },
        },
        {
            name: "James Wilson",
            role: "Lead AI Engineer",
            bio: "James works on advancing our AI capabilities, constantly improving the quality and diversity of generated content.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop",
            socialLinks: {
                linkedin: "#",
                twitter: "#",
                email: "james@aicontentpilot.com",
            },
        },
    ]

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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Team</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            The passionate minds behind AI Content Pilot, working to revolutionize content creation
                        </p>
                    </motion.div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-muted-foreground mb-4">{member.bio}</p>
                                <div className="flex items-center space-x-4">
                                    <a href={member.socialLinks.linkedin} className="text-muted-foreground hover:text-primary">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                    <a href={member.socialLinks.twitter} className="text-muted-foreground hover:text-primary">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                    <a href={`mailto:${member.socialLinks.email}`} className="text-muted-foreground hover:text-primary">
                                        <Mail className="h-5 w-5" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Values Section */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                            <p className="text-muted-foreground text-lg">
                                The principles that guide our work and shape our company culture
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Innovation",
                                    description: "We push the boundaries of what's possible with AI and content creation",
                                },
                                {
                                    title: "Customer Success",
                                    description: "Your success is our success. We're committed to helping you achieve your goals",
                                },
                                {
                                    title: "Integrity",
                                    description: "We believe in transparency, honesty, and ethical AI development",
                                },
                            ].map((value, index) => (
                                <motion.div
                                    key={index}
                                    className="dashboard-card h-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Join Us Section */}
                    <motion.div
                        className="bg-muted/50 rounded-xl p-8 md:p-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-lg">
                                <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
                                <p className="text-muted-foreground mb-6">
                                    We're always looking for talented individuals who are passionate about AI, content, and making a difference.
                                </p>
                            </div>
                            <Link href="/careers">
                                <Button size="lg" className="gradient-primary">
                                    View Open Positions
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}