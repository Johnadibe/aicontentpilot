import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Globe, LifeBuoy, UserPlus, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
    title: "Careers | AI Content Pilot",
    description: "Join our team and help shape the future of AI-powered content creation.",
}

const jobs = [
    {
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description:
            "We're looking for an experienced Full Stack Developer to help build and scale our AI content creation platform.",
        posted: "3 days ago",
    },
    {
        title: "AI Research Scientist",
        department: "Research",
        location: "San Francisco, CA",
        type: "Full-time",
        description:
            "Join our AI research team to develop cutting-edge language models for content generation and optimization.",
        posted: "1 week ago",
    },
    {
        title: "Product Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        description:
            "Design beautiful, intuitive user experiences for our AI content creation tools and dashboard interfaces.",
        posted: "2 weeks ago",
    },
    {
        title: "Content Marketing Manager",
        department: "Marketing",
        location: "Remote",
        type: "Full-time",
        description:
            "Lead our content marketing strategy to showcase the power of AI-driven content creation to potential customers.",
        posted: "3 weeks ago",
    },
    {
        title: "Customer Success Specialist",
        department: "Customer Success",
        location: "Remote",
        type: "Full-time",
        description: "Help our customers get the most out of our platform through training, support, and best practices.",
        posted: "1 month ago",
    },
    {
        title: "NLP Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description:
            "Develop and optimize our natural language processing systems to improve content generation quality and capabilities.",
        posted: "1 month ago",
    },
]

const departments = [...new Set(jobs.map((job) => job.department))]

const benefits = [
    {
        title: "Remote-first culture",
        description: "Work from anywhere in the world with flexible hours.",
        icon: Globe,
    },
    {
        title: "Competitive compensation",
        description: "Salary, equity, and performance bonuses that reward your contributions.",
        icon: Zap,
    },
    {
        title: "Health and wellness",
        description: "Comprehensive health, dental, and vision coverage for you and your dependents.",
        icon: LifeBuoy,
    },
    {
        title: "Professional growth",
        description: "Learning stipend, conference budget, and career development opportunities.",
        icon: UserPlus,
    },
]

const values = [
    {
        title: "Innovation First",
        description:
            "We push the boundaries of what's possible with AI, constantly exploring new approaches and technologies.",
    },
    {
        title: "User-Centered",
        description: "Everything we build starts with our users' needs, challenges, and goals.",
    },
    {
        title: "Transparency",
        description: "We believe in open communication, sharing both our successes and failures.",
    },
    {
        title: "Diversity & Inclusion",
        description: "We build stronger products by embracing diverse perspectives and experiences.",
    },
]

export default function CareersPage() {
    return (
        <div className="animate-fade-in overflow-x-hidden">
            <section className="relative overflow-hidden  bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 py-16 md:py-24">
                <div className="container relative z-10 text-center space-y-6">
                    <Badge className="bg-white/80 text-purple-600 dark:bg-white/10 dark:text-purple-300 mb-4">
                        We're hiring!
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                        Join our mission to transform content creation
                    </h1>
                    <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
                        Help us build the future of AI-powered content creation and empower creators, marketers, and businesses
                        worldwide.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white"
                            asChild
                        >
                            <a href="#openings">View Open Positions</a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a href="#culture">Our Culture</a>
                        </Button>
                    </div>
                </div>
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>
            </section>

            <section id="culture" className="container py-16 md:py-24 space-y-12 px-2 sm:px-4 lg:px-6">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Culture & Values</h2>
                    <p className="text-muted-foreground text-lg">
                        We're building a team of passionate individuals who thrive in a dynamic, innovative environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="aspect-video overflow-hidden rounded-2xl">
                        <Image
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&h=600&auto=format&fit=crop"
                            alt="Our team collaboration"
                            width={800}
                            height={600}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {values.map((value, i) => (
                            <Card key={i} className="border border-border/50">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-xl">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <CardDescription className="text-muted-foreground">{value.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 py-16 px-2 sm:px-4 lg:px-6">
                <div className="container space-y-10">
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Benefits & Perks</h2>
                        <p className="text-muted-foreground text-lg">
                            We offer competitive compensation and benefits to help you thrive both at work and outside of it.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, i) => (
                            <Card key={i} className="border-0 bg-white/80 dark:bg-background/80 backdrop-blur-sm">
                                <CardHeader className="p-6">
                                    <div className="mb-4 p-3 w-fit rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
                                        <benefit.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <CardTitle>{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section id="openings" className="container py-16 md:py-24 space-y-12 px-2 sm:px-4 lg:px-6">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Open Positions</h2>
                    <p className="text-muted-foreground text-lg">
                        Find your perfect role and join us in shaping the future of content creation.
                    </p>
                </div>

                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="flex flex-wrap w-full justify-start gap-2 h-auto p-1 mb-8">
                        <TabsTrigger value="all" className="rounded-full">
                            All Departments
                        </TabsTrigger>
                        {departments.map((dept) => (
                            <TabsTrigger key={dept} value={dept} className="rounded-full">
                                {dept}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {["all", ...departments].map((filter) => (
                        <TabsContent key={filter} value={filter} className="space-y-4 mt-0">
                            {jobs
                                .filter((job) => filter === "all" || job.department === filter)
                                .map((job) => (
                                    <Card
                                        key={job.title}
                                        className="overflow-hidden hover:shadow-md transition-all duration-300 hover:border-primary/20"
                                    >
                                        <CardHeader className="p-6">
                                            <div className="flex flex-wrap items-start gap-2 mb-2">
                                                <Badge variant="outline" className="rounded-full text-xs font-normal">
                                                    {job.department}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-full text-xs font-normal">
                                                    {job.location}
                                                </Badge>
                                                <Badge variant="outline" className="rounded-full text-xs font-normal">
                                                    {job.type}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-xl">{job.title}</CardTitle>
                                            <CardDescription>{job.description}</CardDescription>
                                        </CardHeader>
                                        <CardFooter className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t">
                                            <span className="text-sm text-muted-foreground">Posted {job.posted}</span>
                                            <Button variant="outline" className="group" asChild>
                                                <Link href={`/careers/${job.title.toLowerCase().replace(/\s+/g, "-")}`}>
                                                    View Details{" "}
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            <section className="mx-auto max-w-5xl py-12 px-6 md:px-12 rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/20 dark:to-pink-950/20 my-16">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight">Don't see a perfect fit?</h2>
                        <p className="text-muted-foreground">
                            We're always looking for talented individuals to join our team. Send us your resume and tell us how you
                            can contribute.
                        </p>
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 text-white"
                        >
                            Get in Touch
                        </Button>
                    </div>
                    <div className="rounded-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&h=400&auto=format&fit=crop"
                            alt="Work remotely with us"
                            width={600}
                            height={400}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}