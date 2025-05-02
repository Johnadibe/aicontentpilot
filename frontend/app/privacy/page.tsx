import { ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata = {
    title: "Privacy Policy | AI Content Pilot",
    description: "Learn how AI Content Pilot collects, uses, and protects your personal information.",
}

export default function PrivacyPage() {
    return (
        <div className="container py-12 animate-fade-in px-2 sm:px-4 lg:px-6">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/privacy" aria-current="page">
                            Privacy Policy
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>

                <Alert className="my-6">
                    <AlertTitle>Last Updated: May 1, 2025</AlertTitle>
                    <AlertDescription>
                        This Privacy Policy describes how your personal information is collected, used, and shared when you use AI
                        Content Pilot.
                    </AlertDescription>
                </Alert>

                <h2>1. Information We Collect</h2>
                <p>When you use AI Content Pilot, we collect several types of information about you, including:</p>
                <ul>
                    <li>
                        <strong>Account Information:</strong> When you create an account, we collect your name, email address,
                        password, and other information you provide during registration.
                    </li>
                    <li>
                        <strong>Profile Information:</strong> Information you add to your profile, such as a profile picture, job
                        title, company, and preferences.
                    </li>
                    <li>
                        <strong>Content Data:</strong> The content you create, generate, or upload to our platform, including text,
                        images, and metadata.
                    </li>
                    <li>
                        <strong>Usage Information:</strong> Information about how you use the service, such as the features you use,
                        the time spent on the platform, and your interaction patterns.
                    </li>
                    <li>
                        <strong>Payment Information:</strong> If you subscribe to a paid plan, we collect billing information and
                        payment method details. Full credit card numbers are processed by our payment processor and not stored by
                        us.
                    </li>
                    <li>
                        <strong>Device Information:</strong> Information about the device you use to access our service, including
                        your IP address, browser type, operating system, and device identifiers.
                    </li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Provide, maintain, and improve our services;</li>
                    <li>Process transactions and send related information, including confirmations and receipts;</li>
                    <li>Send you technical notices, updates, security alerts, and support messages;</li>
                    <li>Respond to your comments, questions, and requests;</li>
                    <li>Develop new products and services;</li>
                    <li>Personalize your experience on the platform;</li>
                    <li>Monitor and analyze trends, usage, and activities in connection with our service;</li>
                    <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities;</li>
                    <li>Protect the rights and property of AI Content Pilot and others.</li>
                </ul>

                <h2>3. Sharing Your Information</h2>
                <p>We may share your personal information in the following circumstances:</p>
                <ul>
                    <li>
                        <strong>Service Providers:</strong> With third-party vendors, consultants, and other service providers who
                        need access to such information to carry out work on our behalf;
                    </li>
                    <li>
                        <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, financing, or sale of all
                        or a portion of our business or assets;
                    </li>
                    <li>
                        <strong>Legal Requirements:</strong> When we believe in good faith that disclosure is necessary to comply
                        with the law, protect our rights or the safety of our users or others;
                    </li>
                    <li>
                        <strong>With Your Consent:</strong> When you have given your consent to share your information.
                    </li>
                </ul>

                <h2>4. Data Security</h2>
                <p>
                    We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
                    access, disclosure, alteration, and destruction. However, no internet or electronic communications service is
                    completely secure, so we cannot guarantee the absolute security of your personal information.
                </p>

                <h2>5. Your Rights and Choices</h2>
                <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
                <ul>
                    <li>The right to access personal information we hold about you;</li>
                    <li>The right to request that we update, correct, or delete your personal information;</li>
                    <li>The right to restrict or object to our processing of your personal information;</li>
                    <li>The right to data portability;</li>
                    <li>The right to withdraw consent at any time for processing based on consent.</li>
                </ul>

                <h2>6. Cookies and Similar Technologies</h2>
                <p>
                    We use cookies and similar technologies to collect information about your browsing activities and to
                    distinguish you from other users of our service. For more information about how we use these technologies,
                    please see our Cookie Policy.
                </p>

                <h2>7. Children's Privacy</h2>
                <p>
                    Our service is not directed to children under 16, and we do not knowingly collect personal information from
                    children under 16. If we learn we have collected personal information from a child under 16, we will delete
                    this information.
                </p>

                <h2>8. International Data Transfers</h2>
                <p>
                    We are based in the United States and the information we collect is governed by U.S. law. If you are accessing
                    our service from outside the United States, please be aware that information collected through the service may
                    be transferred to, processed, stored, and used in the U.S. and other jurisdictions.
                </p>

                <h2>9. Changes to This Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other
                    operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new
                    Privacy Policy on this page and updating the "Last Updated" date.
                </p>

                <h2>10. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@aicontentpilot.com.</p>
            </div>
        </div>
    )
}