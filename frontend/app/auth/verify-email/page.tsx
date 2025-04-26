"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { verifyEmail } from "@/lib/actions/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      setError("No verification token provided")
      return
    }

    const verify = async () => {
      try {
        await verifyEmail(token)
        setIsVerified(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify email")
      } finally {
        setIsLoading(false)
      }
    }

    verify()
  }, [token])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {isLoading
              ? "Verifying your email address..."
              : isVerified
                ? "Your email has been verified!"
                : "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-center text-muted-foreground">Please wait while we verify your email address...</p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-medium">Your email has been successfully verified!</p>
                <p className="text-muted-foreground">
                  You can now log in to your account and start using AI Content Pilot.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <XCircle className="h-16 w-16 text-destructive" />
              <div className="text-center space-y-2">
                <p className="font-medium">Verification failed</p>
                <p className="text-muted-foreground">{error || "There was an error verifying your email address."}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isVerified ? (
            <Button onClick={() => router.push("/login")} className="gradient-primary">
              Log In
            </Button>
          ) : (
            <div className="flex flex-col space-y-2 w-full">
              <Button onClick={() => router.push("/")} variant="outline" className="w-full">
                Return to Home
              </Button>
              <Link
                href="/auth/resend-verification"
                className="text-center text-sm text-muted-foreground hover:text-primary"
              >
                Resend verification email
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}