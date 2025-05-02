"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { generateEmailCopy } from "@/lib/api-service"

const emailCopySchema = z.object({
  email_type: z.string(),
  subject_line: z.string().optional(),
  product_name: z.string().optional(),
  company_name: z.string().optional(),
  target_audience: z.string(),
  include_personalization: z.boolean(),
  cta: z.string().optional(),
  tone: z.string(),
  word_count: z.coerce.number().min(100).max(1000),
  tags: z.string().optional(),
})

type EmailCopyFormValues = z.infer<typeof emailCopySchema>

export function EmailCopyForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)

  const form = useForm<EmailCopyFormValues>({
    resolver: zodResolver(emailCopySchema),
    defaultValues: {
      email_type: "newsletter",
      subject_line: "",
      product_name: "",
      company_name: "",
      target_audience: "general",
      include_personalization: true,
      cta: "",
      tone: "professional",
      word_count: 300,
      tags: "",
    },
  })

  async function onSubmit(data: EmailCopyFormValues) {
    try {
      setIsSubmitting(true)
      setGeneratedContent(null)

      // Convert comma-separated tags to array
      const tagsArray = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      // Generate email copy using AI
      const result = await generateEmailCopy({
        email_type: data.email_type,
        subject_line: data.subject_line || undefined,
        product_name: data.product_name || undefined,
        company_name: data.company_name || undefined,
        target_audience: data.target_audience,
        include_personalization: data.include_personalization,
        cta: data.cta || undefined,
        tone: data.tone,
        word_count: data.word_count,
      })

      // Set the generated content
      setGeneratedContent(result.content)

      // Save to database
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: result.title || `${data.email_type} Email`,
          content: result.content,
          type: "EMAIL",
          tags: tagsArray,
          metadata: {
            email_type: data.email_type,
            subject_line: data.subject_line,
            product_name: data.product_name,
            company_name: data.company_name,
            target_audience: data.target_audience,
            include_personalization: data.include_personalization,
            cta: data.cta,
            tone: data.tone,
            word_count: data.word_count,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save content")
      }

      const savedContent = await response.json()

      toast({
        title: "Email copy created",
        description: "Your email copy has been generated and saved successfully.",
      })

      router.push(`/dashboard/content/${savedContent.id}`)
    } catch (error) {
      console.error("Error creating email copy:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create email copy",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="invitation">Invitation</SelectItem>
                      <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                      <SelectItem value="thank_you">Thank You</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What type of email do you want to create?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject_line"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Line (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a subject line or leave blank to generate one" {...field} />
                  </FormControl>
                  <FormDescription>The subject line for your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your product name if applicable" {...field} />
                  </FormControl>
                  <FormDescription>The product this email is about.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company name" {...field} />
                  </FormControl>
                  <FormDescription>Your company or brand name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="customers">Existing Customers</SelectItem>
                      <SelectItem value="prospects">Prospects</SelectItem>
                      <SelectItem value="subscribers">Subscribers</SelectItem>
                      <SelectItem value="leads">Leads</SelectItem>
                      <SelectItem value="abandoned_carts">Abandoned Carts</SelectItem>
                      <SelectItem value="new_users">New Users</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Who is this email intended for?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>What tone should the email have?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call to Action (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., 'Sign up now', 'Learn more', 'Buy today'" {...field} />
                </FormControl>
                <FormDescription>The primary action you want recipients to take.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="include_personalization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Personalization</FormLabel>
                    <FormDescription>
                      Add personalization tokens like &#123;&#123;first_name&#125;&#125; to the email.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="word_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word Count: {field.value}</FormLabel>
                  <FormControl>
                    <Input type="range" min="100" max="1000" step="50" {...field} />
                  </FormControl>
                  <FormDescription>Select the approximate word count for your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="email, newsletter (comma separated)" {...field} />
                </FormControl>
                <FormDescription>Add tags to help organize your content (comma separated).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Email Copy"
            )}
          </Button>
        </form>
      </Form>

      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Email Copy</h2>
          <Card>
            <CardContent className="p-6">
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
