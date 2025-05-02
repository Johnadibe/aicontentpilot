"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"
import { usePathname } from "next/navigation"

export function MarketingFooter() {
    const pathname = usePathname();

    // Don't render footer on auth pages
    if (
        pathname === "/auth/login" ||
        pathname === "/auth/register" ||
        pathname === "/auth/reset-password" ||
        pathname === "/auth/forgot-password" ||
        pathname === "/auth/verify"
    ) {
        return null;
    }

    return (
        <footer className="border-t bg-muted/30 flex-grow px-2 sm:px-4 lg:px-6 mx-auto w-full">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Logo className="h-8 w-8" />
                            <span className="font-bold text-xl">AI Content Pilot</span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                            AI Content Pilot is the all-in-one AI content creation platform that helps you create high-quality content
                            for blogs, social media, emails, and more in seconds.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/integrations"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Integrations
                                </Link>
                            </li>
                            <li>
                                <Link href="/changelog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Changelog
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/case-studies"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    Case Studies
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium mb-4">Subscribe</h3>
                        <p className="text-sm text-muted-foreground mb-4">Get the latest news and updates from our team.</p>
                        <div className="flex flex-col space-y-2">
                            <Input type="email" placeholder="Enter your email" className="bg-background" />
                            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} AI Content Pilot. All rights reserved.
                    </p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/terms" className="text-xs text-muted-foreground hover:underline">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:underline">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="text-xs text-muted-foreground hover:underline">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}