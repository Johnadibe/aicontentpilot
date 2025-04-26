"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const error = searchParams?.get("error")

  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [isGithubLoading, setIsGithubLoading] = React.useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = React.useState(false)
  const [isTwitterLoading, setIsTwitterLoading] = React.useState(false)
  const [isLinkedInLoading, setIsLinkedInLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(error)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    setLoginError(null)

    try {
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        remember: values.rememberMe,
        redirect: false,
      })

      if (response?.error) {
        setLoginError(response.error)
        throw new Error(response.error)
      }

      if (response?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      // Error is displayed via loginError state
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
      await signIn(provider, { callbackUrl })
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
      {loginError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {loginError === "CredentialsSignin" && "Invalid email or password."}
            {loginError.includes("locked") && "Account locked. Try again later or reset your password."}
            {loginError.includes("verify") && "Please verify your email before logging in."}
            {!loginError.includes("locked") &&
              !loginError.includes("verify") &&
              loginError !== "CredentialsSignin" &&
              loginError}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
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
