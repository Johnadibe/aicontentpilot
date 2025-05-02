import { ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata = {
    title: "Cookie Policy | AI Content Pilot",
    description: "Learn about how AI Content Pilot uses cookies and similar technologies.",
}

export default function CookiesPage() {
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
                        <BreadcrumbLink href="/cookies" aria-current="page">
                            Cookie Policy
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-8">Cookie Policy</h1>

                <Alert className="my-6">
                    <AlertTitle>Last Updated: May 1, 2025</AlertTitle>
                    <AlertDescription>
                        This Cookie Policy explains how AI Content Pilot uses cookies and similar technologies to recognize you when
                        you visit our website and application.
                    </AlertDescription>
                </Alert>

                <h2>1. What are cookies?</h2>
                <p>
                    Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                    Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as
                    to provide reporting information.
                </p>
                <p>
                    Cookies set by the website owner (in this case, AI Content Pilot) are called "first-party cookies." Cookies
                    set by parties other than the website owner are called "third-party cookies." Third-party cookies enable
                    third-party features or functionality to be provided on or through the website (e.g., advertising, interactive
                    content, and analytics).
                </p>

                <h2>2. Types of cookies we use</h2>
                <p>We use the following types of cookies:</p>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Essential Cookies</TableCell>
                            <TableCell>
                                These cookies are necessary for the website to function properly. They enable core functionality such as
                                security, network management, and account access.
                            </TableCell>
                            <TableCell>Session / Persistent</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Functionality Cookies</TableCell>
                            <TableCell>
                                These cookies enable us to remember choices you make when you use our website, such as remembering your
                                login details or language preference.
                            </TableCell>
                            <TableCell>Persistent</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Performance/Analytics Cookies</TableCell>
                            <TableCell>
                                These cookies allow us to recognize and count the number of visitors and to see how visitors move around
                                our website when they are using it.
                            </TableCell>
                            <TableCell>Persistent</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Marketing/Targeting Cookies</TableCell>
                            <TableCell>
                                These cookies record your visit to our website, the pages you have visited, and the links you have
                                followed to recognize you and personalize advertising.
                            </TableCell>
                            <TableCell>Persistent</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <h2>3. How to manage cookies</h2>
                <p>
                    You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access
                    cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible
                    or not function properly.
                </p>
                <p>
                    Most web browsers allow some control of most cookies through the browser settings. To find out more about
                    cookies, including how to see what cookies have been set, visit{" "}
                    <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
                        www.allaboutcookies.org
                    </a>
                    .
                </p>

                <h3>Browser-specific instructions to manage cookies:</h3>
                <ul>
                    <li>
                        <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
                    </li>
                    <li>
                        <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                    </li>
                    <li>
                        <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                    </li>
                    <li>
                        <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and data stored
                    </li>
                </ul>

                <h2>4. Specific cookies we use</h2>
                <p>Below is a detailed list of the cookies we use on our website:</p>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Expiry</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>session_id</TableCell>
                            <TableCell>Used to maintain your authenticated session</TableCell>
                            <TableCell>aicontentpilot.com</TableCell>
                            <TableCell>Session</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>theme_preference</TableCell>
                            <TableCell>Remembers your preference for light/dark mode</TableCell>
                            <TableCell>aicontentpilot.com</TableCell>
                            <TableCell>1 year</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>_ga</TableCell>
                            <TableCell>Used by Google Analytics to distinguish users</TableCell>
                            <TableCell>Google</TableCell>
                            <TableCell>2 years</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>_gid</TableCell>
                            <TableCell>Used by Google Analytics to distinguish users</TableCell>
                            <TableCell>Google</TableCell>
                            <TableCell>24 hours</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>intercom-session-*</TableCell>
                            <TableCell>Allows Intercom chat functionality to work</TableCell>
                            <TableCell>Intercom</TableCell>
                            <TableCell>1 week</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <h2>5. Third-party cookies</h2>
                <p>
                    Some of our pages display content from external providers, such as YouTube, Facebook, and Twitter. To view
                    this third-party content, you first have to accept their specific terms and conditions. This includes their
                    cookie policies, which we have no control over.
                </p>
                <p>If you do not watch this content, no third-party cookies are installed on your device.</p>

                <h2>6. Changes to our Cookie Policy</h2>
                <p>
                    We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our
                    business practices. Any changes will be posted on this page and, if the changes are significant, we will
                    provide more prominent notice.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us at
                    privacy@aicontentpilot.com.
                </p>
            </div>
        </div>
    )
}