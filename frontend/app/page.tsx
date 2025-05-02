"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Typewriter } from "@/components/marketing/typewriter"

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

const featureVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HomePage() {
  // Refs and animations for scroll reveal
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 })

  const heroControls = useAnimation()
  const featuresControls = useAnimation()
  const ctaControls = useAnimation()

  useEffect(() => {
    if (heroInView) heroControls.start("visible")
    if (featuresInView) featuresControls.start("visible")
    if (ctaInView) ctaControls.start("visible")
  }, [heroInView, featuresInView, ctaInView, heroControls, featuresControls, ctaControls])

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24 lg:pt-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/20 to-primary/20 blur-3xl opacity-30"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            ref={heroRef}
            variants={staggerContainer}
            initial="hidden"
            animate={heroControls}
            className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-1.5 text-sm font-medium text-primary mb-2"
                >
                  AI-Powered Content Creation
                </motion.div>
                <motion.h1
                  variants={fadeIn}
                  className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                >
                  Create{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Typewriter
                      words={["Amazing", "Stunning", "Brilliant", "Powerful"]}
                      typingSpeed={100}
                      deletingSpeed={80}
                      delayBetweenWords={2000}
                    />
                  </span>{" "}
                  Content with AI
                </motion.h1>
                <motion.p variants={fadeIn} className="max-w-[600px] text-muted-foreground md:text-xl">
                  AI Content Pilot helps you create high-quality content for blogs, social media, emails, and more in
                  seconds. Save time and boost your content strategy.
                </motion.p>
              </div>
              <motion.div variants={fadeIn} className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base px-6 py-6 h-auto">
                    Get Started Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" className="text-base px-6 py-6 h-auto">
                    See How It Works
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={fadeIn} className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-gray-200"
                    >
                      <Image
                        src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`}
                        alt={`User ${i}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">5,000+</span> content creators trust us
                </p>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeIn} className="relative flex items-center justify-center">
              <div className="absolute -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 blur-3xl"></div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative rounded-xl overflow-hidden shadow-2xl border"
              >
                <Image
                  alt="AI Content Dashboard"
                  className="aspect-video object-cover object-center"
                  height={400}
                  width={700}
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=700&h=400&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Brands Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 mb-10 text-center"
          >
            <p className="text-sm font-medium text-muted-foreground mb-6">TRUSTED BY INNOVATIVE COMPANIES</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
              {[
                "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg",
                "https://cdn.worldvectorlogo.com/logos/spotify-2.svg",
                "https://cdn.worldvectorlogo.com/logos/microsoft-5.svg",
                "https://cdn.worldvectorlogo.com/logos/dropbox-1.svg",
                "https://cdn.worldvectorlogo.com/logos/amazon-web-services-2.svg"
              ].map((logo, i) => (
                <div
                  key={i}
                  className="h-8 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200"
                >
                  <Image
                    src={logo}
                    alt={`Company ${i}`}
                    width={60 + i * 10}
                    height={32}
                    className="h-full w-auto"
                  />
                </div>
              ))}
            </div>
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

      {/* Features Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50" id="features">
        <div className="container px-4 md:px-6">
          <motion.div
            ref={featuresRef}
            variants={staggerContainer}
            initial="hidden"
            animate={featuresControls}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <motion.div variants={fadeIn} className="space-y-2 max-w-3xl">
              <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">All-in-One AI Content Platform</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Everything you need to create, optimize, and manage your content with AI.
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresControls}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "AI Content Generation",
                description: "Create high-quality blog posts, social media content, emails, and more with AI.",
                icon: "https://img.icons8.com/fluency/96/content.png",
              },
              {
                title: "AI Image Generation",
                description: "Create stunning images for your content with AI image generation.",
                icon: "https://img.icons8.com/fluency/96/picture.png",
              },
              {
                title: "Content Optimization",
                description: "Optimize your content for SEO, readability, and engagement with AI.",
                icon: "https://img.icons8.com/fluency/96/settings-3.png",
              },
              {
                title: "Content Templates",
                description: "Choose from a variety of templates for different content types and industries.",
                icon: "https://img.icons8.com/fluency/96/template.png",
              },
              {
                title: "Team Collaboration",
                description: "Collaborate with your team on content creation and management.",
                icon: "https://img.icons8.com/fluency/96/collaboration.png",
              },
              {
                title: "Analytics",
                description: "Track your content performance and get insights to improve your strategy.",
                icon: "https://img.icons8.com/fluency/96/combo-chart.png",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={featureVariant}
                className="group flex flex-col items-center space-y-4 rounded-xl border bg-gradient-to-br from-background to-muted/30 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                whileHover={{ y: -5 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                    className="h-6 w-6 text-primary"
                  />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
                <Link href="/features" className="inline-flex items-center text-sm font-medium text-primary">
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Create Content in 3 Simple Steps</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Our AI-powered platform makes content creation faster and easier than ever before.
              </p>
            </div>
          </motion.div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose a Template",
                description: "Select from our library of content templates or start from scratch with a custom prompt.",
                image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=300&h=200&auto=format&fit=crop",
              },
              {
                step: "2",
                title: "Customize Your Content",
                description: "Add your specific details, adjust tone and style, and let our AI do the heavy lifting.",
                image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=300&h=200&auto=format&fit=crop",
              },
              {
                step: "3",
                title: "Edit & Export",
                description: "Review, refine, and export your content to your preferred platform or format.",
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=300&h=200&auto=format&fit=crop",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent hidden md:block"></div>
                  )}
                </div>
                <div className="mb-6 rounded-xl overflow-hidden border shadow-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="space-y-2 max-w-3xl">
              <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Loved by Content Creators</h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                See what our users are saying about AI Content Pilot
              </p>
            </div>
          </motion.div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Content Marketing Manager",
                company: "TechGrowth",
                quote:
                  "AI Content Pilot has completely transformed our content creation process. We're now producing twice as much content in half the time, and the quality is consistently excellent.",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Michael Chen",
                role: "Digital Marketing Director",
                company: "InnovateX",
                quote:
                  "The AI-powered templates have been a game-changer for our marketing team. We can quickly create and customize content that resonates with our audience across multiple channels.",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Emily Rodriguez",
                role: "Freelance Content Creator",
                company: "Self-employed",
                quote:
                  "As a freelancer, AI Content Pilot has helped me scale my business without sacrificing quality. I can take on more clients and deliver faster without burning out.",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col space-y-4 rounded-xl border bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
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
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of content creators who are using AI Content Pilot to create amazing content.
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col gap-4 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base px-8 py-6 h-auto">
                    Start Creating for Free
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="text-base px-8 py-6 h-auto">
                    View Pricing
                  </Button>
                </Link>
              </motion.div>
              <motion.p variants={fadeIn} className="text-sm text-muted-foreground">
                No credit card required. Free plan available.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}