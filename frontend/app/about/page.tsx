"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight, Award, Clock, Users, Rocket, Heart, Zap, Shield, Globe, MessageSquare } from "lucide-react"

export default function AboutPage() {
    const milestones = [
        {
            year: "2020",
            title: "Company Founded",
            description: "AI Content Pilot was founded with a mission to democratize content creation with AI",
        },
        {
            year: "2021",
            title: "Seed Funding",
            description: "Secured $3M in seed funding to accelerate product development",
        },
        {
            year: "2022",
            title: "Product Launch",
            description: "Launched our platform with core content generation capabilities",
        },
        {
            year: "2023",
            title: "Series A",
            description: "Raised $12M Series A to expand team and features",
        },
        {
            year: "2024",
            title: "Global Expansion",
            description: "Expanded to serve customers in over 30 countries worldwide",
        },
    ]

    const teamMembers = [
        {
            name: "Sarah Johnson",
            role: "Co-Founder & CEO",
            bio: "Former AI researcher with a passion for making technology accessible to everyone.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop",
        },
        {
            name: "Michael Chen",
            role: "Co-Founder & CTO",
            bio: "AI engineer with 15+ years experience building scalable machine learning systems.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
        },
        {
            name: "Emily Rodriguez",
            role: "VP of Product",
            bio: "Product leader focused on creating intuitive user experiences for complex technologies.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&auto=format&fit=crop",
        },
        {
            name: "David Kim",
            role: "VP of Engineering",
            bio: "Engineering leader with expertise in building high-performance AI systems.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        },
    ]

    const values = [
        {
            icon: <Zap className="h-8 w-8 text-primary" />,
            title: "Innovation",
            description: "We constantly push the boundaries of what's possible with AI technology."
        },
        {
            icon: <Heart className="h-8 w-8 text-primary" />,
            title: "Customer Focus",
            description: "Our customers' success is our success. We're dedicated to helping them achieve their goals."
        },
        {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: "Integrity",
            description: "We believe in transparency, honesty, and ethical AI development."
        },
        {
            icon: <Globe className="h-8 w-8 text-primary" />,
            title: "Inclusivity",
            description: "We're building tools that work for everyone, regardless of background or expertise."
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About AI Content Pilot</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            We're on a mission to revolutionize content creation with artificial intelligence
                        </p>
                    </motion.div>

                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="rounded-xl border shadow-xl overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                                    alt="Our Mission"
                                    width={600}
                                    height={400}
                                    className="w-full object-cover"
                                    priority
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                We believe content creation should be accessible to everyone. Our mission is to empower businesses and creators with AI tools that make content creation faster, easier, and more effective.
                            </p>
                            <p className="text-lg text-muted-foreground mb-6">
                                By leveraging the latest advancements in artificial intelligence, we're democratizing access to high-quality content creation, enabling businesses of all sizes to compete and succeed in the digital landscape.
                            </p>
                            <Link href="/features">
                                <Button className="gradient-primary">
                                    See What We Do
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {[
                            { icon: <Users className="h-8 w-8 text-primary" />, stat: "10,000+", label: "Happy Customers" },
                            { icon: <Award className="h-8 w-8 text-primary" />, stat: "50M+", label: "Words Generated" },
                            { icon: <Clock className="h-8 w-8 text-primary" />, stat: "500K+", label: "Hours Saved" },
                            { icon: <Rocket className="h-8 w-8 text-primary" />, stat: "30+", label: "Countries Served" },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="dashboard-card text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="flex justify-center mb-4">{item.icon}</div>
                                <div className="text-4xl font-bold mb-2">{item.stat}</div>
                                <div className="text-muted-foreground">{item.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Story */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                            <p className="text-muted-foreground text-lg">
                                How AI Content Pilot went from idea to industry leader
                            </p>
                        </div>

                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">The Beginning</h3>
                                    <p className="text-muted-foreground mb-4">
                                        AI Content Pilot was founded in 2020 by Sarah Johnson and Michael Chen, who saw the potential of AI to revolutionize content creation.
                                    </p>
                                    <p className="text-muted-foreground">
                                        With backgrounds in AI research and content marketing, they set out to build a tool that would make professional-quality content creation accessible to businesses of all sizes.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="rounded-xl border overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2074&auto=format&fit=crop"
                                            alt="The Beginning"
                                            width={600}
                                            height={400}
                                            className="w-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className="order-2 md:order-1 relative">
                                    <div className="rounded-xl border overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                                            alt="Growth & Expansion"
                                            width={600}
                                            height={400}
                                            className="w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <h3 className="text-2xl font-bold mb-4">Growth & Expansion</h3>
                                    <p className="text-muted-foreground mb-4">
                                        After a successful product launch in 2022, AI Content Pilot quickly gained traction with marketers, content creators, and businesses around the world.
                                    </p>
                                    <p className="text-muted-foreground">
                                        Our Series A funding in 2023 allowed us to expand our team, enhance our AI capabilities, and introduce new features that have made us the leading AI content platform.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Milestones */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
                            <p className="text-muted-foreground text-lg">
                                Key milestones in our company's history
                            </p>
                        </div>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-muted"></div>

                            <div className="space-y-16">
                                {milestones.map((milestone, index) => (
                                    <motion.div
                                        key={index}
                                        className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                            }`}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <div className="flex-1 md:text-right md:pr-8">
                                            <div
                                                className={`${index % 2 === 0 ? "md:text-right" : "md:text-left"
                                                    }`}
                                            >
                                                <span className="text-primary font-bold text-lg block mb-2">{milestone.year}</span>
                                                <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                                                <p className="text-muted-foreground">{milestone.description}</p>
                                            </div>
                                        </div>
                                        {/* Timeline dot */}
                                        <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full bg-background"></div>
                                        </div>
                                        <div className="flex-1 md:pl-8"></div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Values */}
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
                                The principles that guide everything we do
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    className="dashboard-card text-center p-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="flex justify-center mb-4">{value.icon}</div>
                                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Team */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
                            <p className="text-muted-foreground text-lg">
                                Meet the people driving our mission forward
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl border bg-background transition-all hover:shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                        <p className="text-primary font-medium mb-3">{member.role}</p>
                                        <p className="text-muted-foreground">{member.bio}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-8">
                            <Link href="/team">
                                <Button variant="outline" className="mt-4">
                                    Meet Our Full Team
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Investors */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Investors</h2>
                            <p className="text-muted-foreground text-lg">
                                Backed by leading venture capital firms
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-12 items-center">
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <motion.div
                                    key={index}
                                    className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 0.7, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="h-12 w-32 bg-muted rounded-md"></div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        className="rounded-2xl bg-muted/50 p-8 md:p-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    We're just getting started. Join us as we continue to revolutionize content creation with AI.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/careers">
                                        <Button className="gradient-primary">
                                            View Open Positions
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button variant="outline">
                                            Contact Us
                                            <MessageSquare className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="rounded-xl border overflow-hidden">
                                    <Image
                                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                                        alt="Join Our Team"
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