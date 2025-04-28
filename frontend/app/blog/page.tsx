"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, ArrowRight, Bookmark, Share2, Heart, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

const categories = [
    "All Posts",
    "AI Technology",
    "Content Marketing",
    "SEO",
    "Case Studies",
    "Product Updates",
    "Industry News",
    "Best Practices",
]

const popularTags = [
    "AI",
    "Content Creation",
    "Marketing",
    "SEO",
    "Case Study",
    "Tutorial",
    "Industry News",
    "Best Practices",
]

const posts = [
    {
        title: "The Future of AI Content Generation",
        excerpt: "Discover how AI is revolutionizing content creation and what it means for your business.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        author: "John Doe",
        authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        date: "March 15, 2024",
        readTime: "5 min read",
        category: "AI Technology",
        tags: ["AI", "Content Creation", "Future Trends"],
        likes: 245,
        comments: 32,
    },
    {
        title: "Content Marketing Strategies for 2024",
        excerpt: "Learn the latest content marketing strategies that are driving results this year.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
        author: "Jane Smith",
        authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        date: "March 10, 2024",
        readTime: "4 min read",
        category: "Content Marketing",
        tags: ["Marketing", "Strategy", "2024 Trends"],
        likes: 189,
        comments: 24,
    },
    {
        title: "How to Optimize Your Content for SEO",
        excerpt: "Essential tips and tricks to improve your content's search engine visibility.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        author: "Mike Johnson",
        authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
        date: "March 5, 2024",
        readTime: "6 min read",
        category: "SEO",
        tags: ["SEO", "Optimization", "Best Practices"],
        likes: 156,
        comments: 18,
    },
    {
        title: "Case Study: How Company X Increased Conversions by 200%",
        excerpt: "A detailed look at how one company transformed their content strategy.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2026&auto=format&fit=crop",
        author: "Sarah Wilson",
        authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop",
        date: "February 28, 2024",
        readTime: "8 min read",
        category: "Case Studies",
        tags: ["Case Study", "Success Story", "Content Strategy"],
        likes: 278,
        comments: 45,
    },
]

const featuredPost = posts[0]

export default function BlogPage() {
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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Insights</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Stay updated with the latest trends and insights in AI content generation
                        </p>
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        className="max-w-2xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
                            />
                        </div>
                    </motion.div>

                    {/* Categories */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {categories.map((category, index) => (
                            <Button
                                key={index}
                                variant={index === 0 ? "default" : "outline"}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </motion.div>

                    {/* Featured Post */}
                    <div className="mb-20">
                        <motion.h2
                            className="text-2xl font-bold mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            Featured Post
                        </motion.h2>
                        <motion.div
                            className="relative overflow-hidden rounded-xl border bg-background"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="relative h-64 md:h-auto">
                                    <Image
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                            {featuredPost.category}
                                        </span>
                                        <span>•</span>
                                        <span>{featuredPost.date}</span>
                                        <span>•</span>
                                        <span>{featuredPost.readTime}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{featuredPost.title}</h3>
                                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                                <Image
                                                    src={featuredPost.authorImage}
                                                    alt={featuredPost.author}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span>{featuredPost.author}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" size="icon">
                                                <Heart className="h-5 w-5" />
                                                <span className="ml-2">{featuredPost.likes}</span>
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Share2 className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Bookmark className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Blog Posts Grid */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <motion.article
                                    key={index}
                                    className="group relative overflow-hidden rounded-xl border bg-background transition-all hover:shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                                {post.category}
                                            </span>
                                            <span>•</span>
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-6">{post.excerpt}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                                    <Image
                                                        src={post.authorImage}
                                                        alt={post.author}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm">{post.author}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="ghost" size="sm">
                                                    <Heart className="h-4 w-4 mr-1" />
                                                    <span className="text-xs">{post.likes}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                        <span className="absolute inset-0" aria-hidden="true" />
                                    </Link>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>

                    {/* Popular Tags */}
                    <motion.div
                        className="mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-8">Popular Tags</h2>
                        <div className="flex flex-wrap gap-3">
                            {popularTags.map((tag, index) => (
                                <Link key={index} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <span className="bg-secondary hover:bg-secondary/80 transition-colors px-4 py-2 rounded-full text-sm">
                                        {tag}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div
                        className="max-w-3xl mx-auto mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="rounded-xl border bg-background p-8 md:p-10">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                                <p className="text-muted-foreground">
                                    Get the latest insights on AI content creation delivered straight to your inbox
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 rounded-lg border bg-background px-4 py-3"
                                />
                                <Button className="gradient-primary">
                                    Subscribe
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Blog Navigation */}
                    <motion.div
                        className="flex justify-center gap-4 mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button variant="outline" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" className="bg-primary text-primary-foreground">
                            1
                        </Button>
                        <Button variant="outline">2</Button>
                        <Button variant="outline">3</Button>
                        <Button variant="outline">
                            Next
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Related Resources */}
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Related Resources</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Discover more content to help you master AI content creation
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item, index) => (
                            <motion.div
                                key={index}
                                className="rounded-xl border bg-background p-6 transition-all hover:shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <h3 className="text-xl font-bold mb-3">
                                    {index === 0 ? "Content Creation Guides" :
                                        index === 1 ? "Video Tutorials" : "Case Studies"}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {index === 0 ? "Step-by-step tutorials to help you get the most out of AI content tools" :
                                        index === 1 ? "Watch our video series on optimizing your content workflow" :
                                            "Real-world examples of successful AI content strategies"}
                                </p>
                                <Link href={index === 0 ? "/guides" : index === 1 ? "/tutorials" : "/case-studies"} className="text-primary font-medium inline-flex items-center">
                                    {index === 0 ? "Browse Guides" :
                                        index === 1 ? "Watch Videos" : "Read Case Studies"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Ready to Transform Your Content Strategy?
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            Join thousands of marketers, bloggers, and businesses creating amazing content with AI
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Link href="/auth/register">
                                <Button size="lg" className="gradient-primary">
                                    Start Your Free Trial
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}