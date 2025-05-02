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
    title: "Terms of Service | AI Content Pilot",
    description: "Terms and conditions for using the AI Content Pilot platform.",
}

export default function TermsPage() {
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
                        <BreadcrumbLink href="/terms" aria-current="page">
                            Terms of Service
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>

                <Alert className="my-6">
                    <AlertTitle>Last Updated: May 1, 2025</AlertTitle>
                    <AlertDescription>
                        Please read these Terms of Service carefully before using AI Content Pilot.
                    </AlertDescription>
                </Alert>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing or using AI Content Pilot, you agree to be bound by these Terms of Service and all applicable
                    laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
                    this site.
                </p>

                <h2>2. Use License</h2>
                <p>
                    Permission is granted to temporarily use AI Content Pilot for personal, educational, or commercial purposes
                    according to your subscription plan. This is the grant of a license, not a transfer of title, and under this
                    license you may not:
                </p>
                <ul>
                    <li>Modify or copy the materials except as permitted by your subscription;</li>
                    <li>Use the materials for any commercial purpose not specified in your plan;</li>
                    <li>Attempt to decompile or reverse engineer any software contained on AI Content Pilot;</li>
                    <li>Remove any copyright or other proprietary notations from the materials;</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>

                <h2>3. Content Generated Using Our Service</h2>
                <p>You retain all rights to content generated using our service, subject to the following conditions:</p>
                <ul>
                    <li>You are responsible for ensuring the content does not violate any third-party rights;</li>
                    <li>
                        You will not use our service to generate content that is unlawful, harmful, threatening, abusive, harassing,
                        defamatory, or otherwise objectionable;
                    </li>
                    <li>We reserve the right to remove any content that violates these terms or is deemed inappropriate.</li>
                </ul>

                <h2>4. Subscription and Payment</h2>
                <p>
                    Access to certain features of AI Content Pilot requires a paid subscription. By subscribing, you agree to pay
                    the fees indicated for your selected plan. Subscriptions automatically renew until canceled. You may cancel
                    your subscription at any time through your account settings.
                </p>

                <h2>5. Data Privacy</h2>
                <p>
                    Your use of AI Content Pilot is also governed by our Privacy Policy. By using our service, you consent to the
                    collection and use of information as detailed in our Privacy Policy.
                </p>

                <h2>6. Disclaimer</h2>
                <p>
                    The materials on AI Content Pilot are provided on an 'as is' basis. AI Content Pilot makes no warranties,
                    expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
                    implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                    intellectual property or other violation of rights.
                </p>

                <h2>7. Limitations</h2>
                <p>
                    In no event shall AI Content Pilot or its suppliers be liable for any damages (including, without limitation,
                    damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
                    use the materials on AI Content Pilot, even if AI Content Pilot or a AI Content Pilot authorized
                    representative has been notified orally or in writing of the possibility of such damage.
                </p>

                <h2>8. Governing Law</h2>
                <p>
                    These terms and conditions are governed by and construed in accordance with the laws of the United States, and
                    you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>

                <h2>9. Changes to Terms</h2>
                <p>
                    AI Content Pilot reserves the right, at its sole discretion, to modify or replace these Terms at any time. By
                    continuing to access or use our service after those revisions become effective, you agree to be bound by the
                    revised terms.
                </p>

                <h2>10. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at support@aicontentpilot.com.</p>
            </div>
        </div>
    )
}