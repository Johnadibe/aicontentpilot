// "use client"

// import type React from "react"

// import { useEffect, useRef, useState } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { motion, useAnimation, useInView } from "framer-motion"
// import { ChevronRight, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// // Animation variants
// const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// }

// const staggerContainer = {
//     hidden: { opacity: 0 },
//     visible: {
//         opacity: 1,
//         transition: {
//             staggerChildren: 0.2,
//         },
//     },
// }

// export default function ContactPage() {
//     const [formSubmitted, setFormSubmitted] = useState(false)

//     // Refs and animations for scroll reveal
//     const heroRef = useRef(null)
//     const formRef = useRef(null)
//     const infoRef = useRef(null)

//     const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
//     const formInView = useInView(formRef, { once: true, amount: 0.1 })
//     const infoInView = useInView(infoRef, { once: true, amount: 0.3 })

//     const heroControls = useAnimation()
//     const formControls = useAnimation()
//     const infoControls = useAnimation()

//     useEffect(() => {
//         if (heroInView) heroControls.start("visible")
//         if (formInView) formControls.start("visible")
//         if (infoInView) infoControls.start("visible")
//     }, [heroInView, formInView, infoInView, heroControls, formControls, infoControls])

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         // Simulate form submission
//         setTimeout(() => {
//             setFormSubmitted(true)
//         }, 1000)
//     }

//     return (
//         <>
//             {/* Hero Section */}
//             <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24 lg:pt-32">
//                 <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
//                 <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30"></div>

//                 <div className="container px-4 md:px-6 relative z-10">
//                     <motion.div
//                         ref={heroRef}
//                         variants={staggerContainer}
//                         initial="hidden"
//                         animate={heroControls}
//                         className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto"
//                     >
//                         <motion.div variants={fadeIn} className="space-y-6">
//                             <motion.div
//                                 initial={{ opacity: 0, scale: 0.8 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 transition={{ duration: 0.5 }}
//                                 className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-1.5 text-sm font-medium text-primary mb-2"
//                             >
//                                 Get in Touch
//                             </motion.div>
//                             <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
//                                 We'd Love to{" "}
//                                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
//                                     Hear From You
//                                 </span>
//                             </motion.h1>
//                             <motion.p variants={fadeIn} className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
//                                 Have questions about AI Content Pilot? Want to learn more about our features or pricing? Our team is
//                                 here to help.
//                             </motion.p>
//                         </motion.div>
//                     </motion.div>
//                 </div>

//                 {/* Wave Divider */}
//                 <div className="absolute bottom-0 left-0 w-full overflow-hidden">
//                     <svg
//                         className="relative block w-full h-[50px] md:h-[70px]"
//                         viewBox="0 0 1200 120"
//                         preserveAspectRatio="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,213.2,141.14c62.5,0,125.91-16.77,186.19-32.86Z"
//                             className="fill-muted/50"
//                         ></path>
//                     </svg>
//                 </div>
//             </section>

//             {/* Contact Form Section */}
//             <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
//                 <div className="container px-4 md:px-6">
//                     <div className="grid gap-12 lg:grid-cols-2">
//                         {/* Contact Form */}
//                         <motion.div
//                             ref={formRef}
//                             variants={staggerContainer}
//                             initial="hidden"
//                             animate={formControls}
//                             className="space-y-8"
//                         >
//                             <motion.div variants={fadeIn} className="space-y-2">
//                                 <h2 className="text-3xl font-bold tracking-tighter">Send Us a Message</h2>
//                                 <p className="text-muted-foreground">
//                                     Fill out the form below and we'll get back to you as soon as possible.
//                                 </p>
//                             </motion.div>

//                             {formSubmitted ? (
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.9 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     className="rounded-xl border bg-gradient-to-br from-background to-muted/10 p-8 shadow-sm text-center"
//                                 >
//                                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 mb-4">
//                                         <CheckCircle className="h-8 w-8 text-primary" />
//                                     </div>
//                                     <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
//                                     <p className="text-muted-foreground mb-6">
//                                         Thank you for contacting us. We'll get back to you shortly.
//                                     </p>
//                                     <Button
//                                         onClick={() => setFormSubmitted(false)}
//                                         className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
//                                     >
//                                         Send Another Message
//                                     </Button>
//                                 </motion.div>
//                             ) : (
//                                 <motion.form variants={fadeIn} onSubmit={handleSubmit} className="space-y-6">
//                                     <div className="grid gap-4 sm:grid-cols-2">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="first-name">First name</Label>
//                                             <Input id="first-name" placeholder="John" required />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label htmlFor="last-name">Last name</Label>
//                                             <Input id="last-name" placeholder="Doe" required />
//                                         </div>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="email">Email</Label>
//                                         <Input id="email" type="email" placeholder="john.doe@example.com" required />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="company">Company (Optional)</Label>
//                                         <Input id="company" placeholder="Your company name" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label>What are you interested in?</Label>
//                                         <RadioGroup defaultValue="general" className="grid gap-2 sm:grid-cols-2">
//                                             <div className="flex items-center space-x-2">
//                                                 <RadioGroupItem value="general" id="general" />
//                                                 <Label htmlFor="general" className="cursor-pointer">
//                                                     General Inquiry
//                                                 </Label>
//                                             </div>
//                                             <div className="flex items-center space-x-2">
//                                                 <RadioGroupItem value="sales" id="sales" />
//                                                 <Label htmlFor="sales" className="cursor-pointer">
//                                                     Sales
//                                                 </Label>
//                                             </div>
//                                             <div className="flex items-center space-x-2">
//                                                 <RadioGroupItem value="support" id="support" />
//                                                 <Label htmlFor="support" className="cursor-pointer">
//                                                     Support
//                                                 </Label>
//                                             </div>
//                                             <div className="flex items-center space-x-2">
//                                                 <RadioGroupItem value="partnership" id="partnership" />
//                                                 <Label htmlFor="partnership" className="cursor-pointer">
//                                                     Partnership
//                                                 </Label>
//                                             </div>
//                                         </RadioGroup>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="message">Message</Label>
//                                         <Textarea
//                                             id="message"
//                                             placeholder="Tell us how we can help..."
//                                             className="min-h-[120px]"
//                                             required
//                                         />
//                                     </div>
//                                     <Button
//                                         type="submit"
//                                         className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
//                                     >
//                                         Send Message
//                                         <Send className="ml-2 h-4 w-4" />
//                                     </Button>
//                                 </motion.form>
//                             )}
//                         </motion.div>

//                         {/* Contact Information */}
//                         <motion.div
//                             ref={infoRef}
//                             variants={staggerContainer}
//                             initial="hidden"
//                             animate={infoControls}
//                             className="space-y-8"
//                         >
//                             <motion.div variants={fadeIn} className="space-y-2">
//                                 <h2 className="text-3xl font-bold tracking-tighter">Contact Information</h2>
//                                 <p className="text-muted-foreground">Here are the different ways you can reach us.</p>
//                             </motion.div>

//                             <motion.div variants={fadeIn} className="space-y-6">
//                                 <div className="flex items-start space-x-4">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
//                                         <Mail className="h-5 w-5 text-primary" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg font-semibold">Email</h3>
//                                         <p className="text-muted-foreground mb-1">For general inquiries:</p>
//                                         <a href="mailto:info@aicontentpilot.com" className="text-primary hover:underline">
//                                             info@aicontentpilot.com
//                                         </a>
//                                         <p className="text-muted-foreground mt-2 mb-1">For support:</p>
//                                         <a href="mailto:support@aicontentpilot.com" className="text-primary hover:underline">
//                                             support@aicontentpilot.com
//                                         </a>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-start space-x-4">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
//                                         <Phone className="h-5 w-5 text-primary" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg font-semibold">Phone</h3>
//                                         <p className="text-muted-foreground mb-1">Customer Support:</p>
//                                         <a href="tel:+1-800-123-4567" className="text-primary hover:underline">
//                                             +1 (800) 123-4567
//                                         </a>
//                                         <p className="text-muted-foreground mt-2 mb-1">Sales:</p>
//                                         <a href="tel:+1-800-987-6543" className="text-primary hover:underline">
//                                             +1 (800) 987-6543
//                                         </a>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-start space-x-4">
//                                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
//                                         <MapPin className="h-5 w-5 text-primary" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg font-semibold">Office</h3>
//                                         <p className="text-muted-foreground mb-1">Headquarters:</p>
//                                         <address className="not-italic">
//                                             123 AI Innovation Center
//                                             <br />
//                                             San Francisco, CA 94105
//                                             <br />
//                                             United States
//                                         </address>
//                                     </div>
//                                 </div>
//                             </motion.div>

//                             <motion.div variants={fadeIn} className="rounded-xl overflow-hidden border shadow-sm h-[300px] relative">
//                                 <Image src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&h=300&auto=format&fit=crop"
//                                     alt="Office Location"
//                                     width={800}
//                                     height={300}
//                                     className="object-cover w-full h-full" />
//                             </motion.div>

//                             <motion.div variants={fadeIn} className="space-y-4">
//                                 <h3 className="text-xl font-semibold">Follow Us</h3>
//                                 <div className="flex space-x-4">
//                                     {[
//                                         { name: "twitter", icon: "https://cdn-icons-png.flaticon.com/128/733/733579.png" },
//                                         { name: "facebook", icon: "https://cdn-icons-png.flaticon.com/128/733/733547.png" },
//                                         { name: "instagram", icon: "https://cdn-icons-png.flaticon.com/128/733/733558.png" },
//                                         { name: "linkedin", icon: "https://cdn-icons-png.flaticon.com/128/733/733561.png" },
//                                     ].map((social) => (
//                                         <Link
//                                             key={social.name}
//                                             href={`https://${social.name}.com`}
//                                             className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 transition-all"
//                                         >
//                                             <Image
//                                                 src={social.icon}
//                                                 alt={social.name}
//                                                 width={20}
//                                                 height={20}
//                                                 className="h-5 w-5"
//                                             />
//                                         </Link>
//                                     ))}
//                                 </div>
//                             </motion.div>
//                         </motion.div>
//                     </div>
//                 </div>
//             </section>

//             {/* FAQ Section */}
//             <section className="w-full py-16 md:py-24 lg:py-32">
//                 <div className="container px-4 md:px-6">
//                     <div className="flex flex-col items-center justify-center space-y-8 text-center mb-12">
//                         <div className="space-y-2 max-w-3xl">
//                             <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
//                                 FAQ
//                             </div>
//                             <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
//                             <p className="text-muted-foreground md:text-lg">
//                                 Find answers to common questions about AI Content Pilot.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                         {[
//                             {
//                                 question: "How does AI Content Pilot work?",
//                                 answer:
//                                     "AI Content Pilot uses advanced AI models to generate high-quality content based on your inputs. You can choose from various templates, customize the tone and style, and get content ready for publication in seconds.",
//                             },
//                             {
//                                 question: "Is there a free trial available?",
//                                 answer:
//                                     "Yes, we offer a free plan that allows you to try out our basic features. You can create up to 5,000 words and 5 AI images per month without any cost.",
//                             },
//                             {
//                                 question: "Can I cancel my subscription anytime?",
//                                 answer:
//                                     "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
//                             },
//                             {
//                                 question: "How accurate is the AI-generated content?",
//                                 answer:
//                                     "Our AI models are trained on vast amounts of data and produce high-quality content. However, we always recommend reviewing and editing the generated content to ensure it meets your specific needs and standards.",
//                             },
//                             {
//                                 question: "Do you offer custom enterprise solutions?",
//                                 answer:
//                                     "Yes, we offer custom enterprise solutions for businesses with specific needs. Contact our sales team to discuss your requirements and get a tailored solution.",
//                             },
//                             {
//                                 question: "What kind of support do you offer?",
//                                 answer:
//                                     "We offer email support for all plans. Professional and Enterprise plans also get priority support with faster response times. Enterprise customers receive dedicated support with a personal account manager.",
//                             },
//                         ].map((faq, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 whileInView={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.1 }}
//                                 viewport={{ once: true }}
//                                 className="rounded-xl border bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm"
//                             >
//                                 <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
//                                 <p className="text-muted-foreground">{faq.answer}</p>
//                             </motion.div>
//                         ))}
//                     </div>

//                     <div className="mt-12 text-center">
//                         <p className="text-muted-foreground mb-4">Still have questions? We're here to help.</p>
//                         <Link href="/auth/register">
//                             <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
//                                 Get Started Free
//                                 <ChevronRight className="ml-2 h-4 w-4" />
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }

"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronRight, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react"
import { useForm } from "@formspree/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

export default function ContactPage() {
    // Replace "YOUR_FORM_ID" with your actual Formspree form ID
    const [formState, handleSubmit] = useForm("xldbgkqe")
    const [formSubmitted, setFormSubmitted] = useState(false)

    // Refs and animations for scroll reveal
    const heroRef = useRef(null)
    const formRef = useRef(null)
    const infoRef = useRef(null)

    const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
    const formInView = useInView(formRef, { once: true, amount: 0.1 })
    const infoInView = useInView(infoRef, { once: true, amount: 0.3 })

    const heroControls = useAnimation()
    const formControls = useAnimation()
    const infoControls = useAnimation()

    useEffect(() => {
        if (heroInView) heroControls.start("visible")
        if (formInView) formControls.start("visible")
        if (infoInView) infoControls.start("visible")
    }, [heroInView, formInView, infoInView, heroControls, formControls, infoControls])

    // Set formSubmitted to true when the form is successfully submitted
    useEffect(() => {
        if (formState.succeeded) {
            setFormSubmitted(true)
        }
    }, [formState.succeeded])

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24 lg:pt-32">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl opacity-30"></div>

                <div className="container px-4 md:px-6 relative z-10">
                    <motion.div
                        ref={heroRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={heroControls}
                        className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeIn} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 px-4 py-1.5 text-sm font-medium text-primary mb-2"
                            >
                                Get in Touch
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none">
                                We'd Love to{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                                    Hear From You
                                </span>
                            </motion.h1>
                            <motion.p variants={fadeIn} className="max-w-[800px] mx-auto text-muted-foreground md:text-xl">
                                Have questions about AI Content Pilot? Want to learn more about our features or pricing? Our team is
                                here to help.
                            </motion.p>
                        </motion.div>
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

            {/* Contact Form Section */}
            <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2">
                        {/* Contact Form */}
                        <motion.div
                            ref={formRef}
                            variants={staggerContainer}
                            initial="hidden"
                            animate={formControls}
                            className="space-y-8"
                        >
                            <motion.div variants={fadeIn} className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter">Send Us a Message</h2>
                                <p className="text-muted-foreground">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </motion.div>

                            {formSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="rounded-xl border bg-gradient-to-br from-background to-muted/10 p-8 shadow-sm text-center"
                                >
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 mb-4">
                                        <CheckCircle className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Thank you for contacting us. We'll get back to you shortly.
                                    </p>
                                    <Button
                                        onClick={() => setFormSubmitted(false)}
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                                    >
                                        Send Another Message
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.form variants={fadeIn} onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First name</Label>
                                            <Input id="first-name" name="first-name" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last name</Label>
                                            <Input id="last-name" name="last-name" placeholder="Doe" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company (Optional)</Label>
                                        <Input id="company" name="company" placeholder="Your company name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>What are you interested in?</Label>
                                        <RadioGroup defaultValue="general" name="interest" className="grid gap-2 sm:grid-cols-2">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="general" id="general" />
                                                <Label htmlFor="general" className="cursor-pointer">
                                                    General Inquiry
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="sales" id="sales" />
                                                <Label htmlFor="sales" className="cursor-pointer">
                                                    Sales
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="support" id="support" />
                                                <Label htmlFor="support" className="cursor-pointer">
                                                    Support
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="partnership" id="partnership" />
                                                <Label htmlFor="partnership" className="cursor-pointer">
                                                    Partnership
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us how we can help..."
                                            className="min-h-[120px]"
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={formState.submitting}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                                    >
                                        {formState.submitting ? "Sending..." : "Send Message"}
                                        <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.form>
                            )}
                        </motion.div>

                        {/* Contact Information */}
                        <motion.div
                            ref={infoRef}
                            variants={staggerContainer}
                            initial="hidden"
                            animate={infoControls}
                            className="space-y-8"
                        >
                            <motion.div variants={fadeIn} className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter">Contact Information</h2>
                                <p className="text-muted-foreground">Here are the different ways you can reach us.</p>
                            </motion.div>

                            <motion.div variants={fadeIn} className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Email</h3>
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

                                <div className="flex items-start space-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Phone</h3>
                                        <p className="text-muted-foreground mb-1">Customer Support:</p>
                                        <a href="tel:+1-800-123-4567" className="text-primary hover:underline">
                                            +1 (800) 123-4567
                                        </a>
                                        <p className="text-muted-foreground mt-2 mb-1">Sales:</p>
                                        <a href="tel:+1-800-987-6543" className="text-primary hover:underline">
                                            +1 (800) 987-6543
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Office</h3>
                                        <p className="text-muted-foreground mb-1">Headquarters:</p>
                                        <address className="not-italic">
                                            123 AI Innovation Center
                                            <br />
                                            San Francisco, CA 94105
                                            <br />
                                            United States
                                        </address>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeIn} className="rounded-xl overflow-hidden border shadow-sm h-[300px] relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&h=300&auto=format&fit=crop"
                                    alt="Office Location"
                                    width={800}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            </motion.div>

                            <motion.div variants={fadeIn} className="space-y-4">
                                <h3 className="text-xl font-semibold">Follow Us</h3>
                                <div className="flex space-x-4">
                                    {[
                                        { name: "twitter", icon: "https://cdn-icons-png.flaticon.com/128/733/733579.png" },
                                        { name: "facebook", icon: "https://cdn-icons-png.flaticon.com/128/733/733547.png" },
                                        { name: "instagram", icon: "https://cdn-icons-png.flaticon.com/128/733/733558.png" },
                                        { name: "linkedin", icon: "https://cdn-icons-png.flaticon.com/128/733/733561.png" },
                                        { name: "github", icon: "https://cdn-icons-png.flaticon.com/128/733/733553.png" },
                                    ].map((social) => (
                                        <Link
                                            key={social.name}
                                            href={`https://${social.name}.com`}
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 transition-all"
                                        >
                                            <Image
                                                src={social.icon || "/placeholder.svg"}
                                                alt={social.name}
                                                width={20}
                                                height={20}
                                                className="h-5 w-5"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-16 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-8 text-center mb-12">
                        <div className="space-y-2 max-w-3xl">
                            <div className="inline-block rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 px-3 py-1 text-sm font-medium text-primary">
                                FAQ
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground md:text-lg">
                                Find answers to common questions about AI Content Pilot.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                question: "How does AI Content Pilot work?",
                                answer:
                                    "AI Content Pilot uses advanced AI models to generate high-quality content based on your inputs. You can choose from various templates, customize the tone and style, and get content ready for publication in seconds.",
                            },
                            {
                                question: "Is there a free trial available?",
                                answer:
                                    "Yes, we offer a free plan that allows you to try out our basic features. You can create up to 5,000 words and 5 AI images per month without any cost.",
                            },
                            {
                                question: "Can I cancel my subscription anytime?",
                                answer:
                                    "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.",
                            },
                            {
                                question: "How accurate is the AI-generated content?",
                                answer:
                                    "Our AI models are trained on vast amounts of data and produce high-quality content. However, we always recommend reviewing and editing the generated content to ensure it meets your specific needs and standards.",
                            },
                            {
                                question: "Do you offer custom enterprise solutions?",
                                answer:
                                    "Yes, we offer custom enterprise solutions for businesses with specific needs. Contact our sales team to discuss your requirements and get a tailored solution.",
                            },
                            {
                                question: "What kind of support do you offer?",
                                answer:
                                    "We offer email support for all plans. Professional and Enterprise plans also get priority support with faster response times. Enterprise customers receive dedicated support with a personal account manager.",
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-xl border bg-gradient-to-br from-background to-muted/10 p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">Still have questions? We're here to help.</p>
                        <Link href="/auth/register">
                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                Get Started Free
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}