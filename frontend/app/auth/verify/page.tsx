"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Missing verification token")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Verification failed")
        }

        setStatus("success")
        setMessage(data.message || "Email verified successfully")
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Verification failed")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="text-center">
      {status === "loading" && (
        <>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Verifying your email</h1>
          <p className="mt-2 text-muted-foreground">Please wait while we verify your email address...</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Email verified!</h1>
          <p className="mt-2 text-muted-foreground">Your email has been successfully verified.</p>
          <div className="mt-6">
            <Button onClick={() => router.push("/auth/login")} className="gradient-primary">
              Sign in to your account
            </Button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Verification failed</h1>
          <p className="mt-2 text-muted-foreground">
            {message || "The verification link is invalid or has expired. Please request a new verification link."}
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push("/auth/login")} className="gradient-primary">
              Back to login
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
