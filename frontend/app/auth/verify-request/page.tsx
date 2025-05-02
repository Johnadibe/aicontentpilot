import { Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyRequestPage() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Check your email</h1>
      <p className="mt-2 text-muted-foreground">
        A verification link has been sent to your email address.
        <br />
        Please check your inbox and click the link to verify your account.
      </p>
      <div className="mt-6">
        <p className="text-sm text-muted-foreground">
          If you don&apos;t see the email, check your spam folder or{" "}
          <Link href="/auth/register" className="text-primary underline underline-offset-4 hover:text-primary/90">
            try again
          </Link>
          .
        </p>
      </div>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </div>
    </div>
  )
}
