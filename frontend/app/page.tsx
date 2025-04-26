"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { BookText, MessageSquare, Mail, Lightbulb, ImageIcon, BarChart, CheckCircle, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Create <span className="gradient-text">Amazing Content</span> with AI
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Generate blog posts, social media content, emails, and more with our advanced AI platform.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/register">
                <Button size="lg" className="gradient-primary">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-xl border shadow-xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="AI Content Pilot Dashboard"
                width={1200}
                height={600}
                className="w-full object-cover"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-3xl bg-purple-500/20" />
            <div className="absolute -z-10 -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-3xl bg-blue-500/20" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Content Creation Tools</h2>
            <p className="text-muted-foreground text-lg">Everything you need to create high-quality content at scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BookText className="h-10 w-10 text-purple-500" />,
                title: "Blog Post Generator",
                description: "Create SEO-optimized blog posts on any topic with just a few clicks",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-blue-500" />,
                title: "Social Media Content",
                description: "Generate engaging posts for all your social media platforms",
              },
              {
                icon: <Mail className="h-10 w-10 text-indigo-500" />,
                title: "Email Campaigns",
                description: "Craft compelling email copy that converts subscribers to customers",
              },
              {
                icon: <Lightbulb className="h-10 w-10 text-amber-500" />,
                title: "Ad Copy Creation",
                description: "Write high-converting ad copy for multiple platforms",
              },
              {
                icon: <ImageIcon className="h-10 w-10 text-emerald-500" />,
                title: "AI Image Generation",
                description: "Create stunning visuals with our AI image generation tools",
              },
              {
                icon: <BarChart className="h-10 w-10 text-rose-500" />,
                title: "Content Analytics",
                description: "Track performance and optimize your content strategy",
              },
            ].map((feature, index) => (
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Our simple three-step process makes content creation effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Select Content Type",
                description: "Choose from blog posts, social media, emails, ads, and more",
              },
              {
                step: "02",
                title: "Customize Parameters",
                description: "Set tone, length, keywords, and other specifications",
              },
              {
                step: "03",
                title: "Generate & Refine",
                description: "Get AI-generated content and make any needed adjustments",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative mx-auto mb-6 w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted By Content Creators</h2>
            <p className="text-muted-foreground text-lg">See what our users are saying about AI Content Pilot</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "AI Content Pilot has completely transformed our content marketing strategy. We're creating 3x more content in half the time.",
                author: "Sarah Johnson",
                title: "Marketing Director at TechGrowth",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                quote:
                  "The quality of content is amazing. Our engagement rates have increased by 45% since we started using AI Content Pilot.",
                author: "Michael Chen",
                title: "Social Media Manager at Brite Media",
                avatar: "/placeholder.svg?height=100&width=100",
              },
              {
                quote:
                  "As a solo entrepreneur, AI Content Pilot gives me the power of an entire content team. It's been a game-changer for my business.",
                author: "Jessica Williams",
                title: "Founder of GrowthHackers",
                avatar: "/placeholder.svg?height=100&width=100",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="dashboard-card h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-4">
                  <svg className="h-8 w-8 text-purple-500" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="mb-4 italic">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground text-lg">Choose the plan that's right for you or your team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for individuals and small projects",
                features: ["50,000 words per month", "Basic content types", "Standard quality", "Email support"],
              },
              {
                name: "Professional",
                price: "$79",
                description: "Ideal for growing businesses and content creators",
                features: [
                  "200,000 words per month",
                  "All content types",
                  "Premium quality",
                  "Priority support",
                  "AI image generation (100/mo)",
                  "Content analytics",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "$199",
                description: "For teams and agencies with high-volume needs",
                features: [
                  "1,000,000 words per month",
                  "All content types",
                  "Premium quality",
                  "24/7 priority support",
                  "AI image generation (unlimited)",
                  "Advanced analytics",
                  "API access",
                  "Team collaboration tools",
                ],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`dashboard-card h-full ${plan.highlighted ? "border-purple-500 shadow-lg relative" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={plan.highlighted ? "w-full gradient-primary" : "w-full"}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Revolutionize Your Content Creation?
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
              <Link href="/register">
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
