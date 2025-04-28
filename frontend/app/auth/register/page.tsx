import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata = {
  title: "Register - AI Content Pilot",
  description: "Create your account to start using AI Content Pilot",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">Enter your details below to create your account</p>
          </div>
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <RegisterForm />
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}