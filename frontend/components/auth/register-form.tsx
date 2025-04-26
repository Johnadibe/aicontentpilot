"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { registerUser } from "@/lib/actions/user"
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [isGithubLoading, setIsGithubLoading] = React.useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = React.useState(false)
  const [isTwitterLoading, setIsTwitterLoading] = React.useState(false)
  const [isLinkedInLoading, setIsLinkedInLoading] = React.useState(false)
  const [registrationError, setRegistrationError] = React.useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const password = form.watch("password")

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    setRegistrationError(null)

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      })

      // Redirect to verification pending page
      router.push("/auth/verify-request")
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: string) => {
    switch (provider) {
      case "google":
        setIsGoogleLoading(true)
        break
      case "github":
        setIsGithubLoading(true)
        break
      case "facebook":
        setIsFacebookLoading(true)
        break
      case "twitter":
        setIsTwitterLoading(true)
        break
      case "linkedin":
        setIsLinkedInLoading(true)
        break
    }

    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`,
        variant: "destructive",
      })
    } finally {
      switch (provider) {
        case "google":
          setIsGoogleLoading(false)
          break
        case "github":
          setIsGithubLoading(false)
          break
        case "facebook":
          setIsFacebookLoading(false)
          break
        case "twitter":
          setIsTwitterLoading(false)
          break
        case "linkedin":
          setIsLinkedInLoading(false)
          break
      }
    }
  }

  return (
    <div className="grid gap-6">
      {registrationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{registrationError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <PasswordStrengthMeter password={password} />
                <FormDescription>
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special
                  character.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isGoogleLoading} onClick={() => handleSocialSignIn("google")}>
          {isGoogleLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>
        <Button variant="outline" type="button" disabled={isGithubLoading} onClick={() => handleSocialSignIn("github")}>
          {isGithubLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isFacebookLoading}
          onClick={() => handleSocialSignIn("facebook")}
        >
          {isFacebookLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.facebook className="mr-2 h-4 w-4" />
          )}
          Facebook
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isTwitterLoading}
          onClick={() => handleSocialSignIn("twitter")}
        >
          {isTwitterLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.twitter className="mr-2 h-4 w-4" />
          )}
          Twitter
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLinkedInLoading}
          onClick={() => handleSocialSignIn("linkedin")}
        >
          {isLinkedInLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.linkedin className="mr-2 h-4 w-4" />
          )}
          LinkedIn
        </Button>
      </div>
    </div>
  )
}
