"use client"

import * as z from "zod"
import { DashboardHeader } from "@/components/dashboard/header"
import { ContentGeneratorForm } from "@/components/content/content-generator-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

// Define extra fields for email copy generation
const emailExtraFields = z.object({
  emailType: z.string(),
  subjectLine: z.string().optional(),
  includePersonalization: z.boolean().default(true),
  includePreheader: z.boolean().default(true),
  callToAction: z.string().optional(),
  includePS: z.boolean().default(false),
})

export function EmailCopyGenerator() {
  // Email type options
  const emailTypeOptions = [
    { value: "newsletter", label: "Newsletter" },
    { value: "promotional", label: "Promotional" },
    { value: "welcome", label: "Welcome Email" },
    { value: "follow-up", label: "Follow-up" },
    { value: "announcement", label: "Announcement" },
    { value: "invitation", label: "Invitation" },
    { value: "confirmation", label: "Confirmation" },
    { value: "abandoned-cart", label: "Abandoned Cart" },
    { value: "re-engagement", label: "Re-engagement" },
    { value: "thank-you", label: "Thank You" },
  ]

  // Custom form fields for email copy generator
  const EmailExtraFormFields = () => (
    <>
      <FormField
        name="emailType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an email type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {emailTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Select the type of email to generate</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="subjectLine"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject Line Guidance</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Include urgency, mention discount, keep under 50 characters" {...field} />
            </FormControl>
            <FormDescription>Provide guidance for the subject line (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name="includePersonalization"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Personalization</FormLabel>
                <FormDescription>Include personalization tokens</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="includePreheader"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Preheader Text</FormLabel>
                <FormDescription>Include preview text</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="callToAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Call to Action</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Shop Now, Learn More, Sign Up Today" {...field} />
            </FormControl>
            <FormDescription>Specify the primary call to action (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="includePS"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Include P.S.</FormLabel>
              <FormDescription>Add a P.S. section at the end</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  )

  return (
    <>
      <DashboardHeader heading="Email Copy Generator" text="Create compelling email copy that converts" />
      <ContentGeneratorForm
        contentType="email"
        title="Email Copy"
        description="Generate professional email content"
        extraFields={emailExtraFields}
        extraFormFields={<EmailExtraFormFields />}
        placeholders={{
          topic: "e.g. Monthly Newsletter, Product Launch, Special Offer",
          keywords: "e.g. email marketing, newsletter, promotion",
          additionalContext: "Add any specific brand voice guidelines, campaign details, or key messages to include...",
        }}
        lengthRange={{ min: 100, max: 1000, default: 400 }}
        toneOptions={[
          { value: "professional", label: "Professional" },
          { value: "conversational", label: "Conversational" },
          { value: "friendly", label: "Friendly" },
          { value: "urgent", label: "Urgent" },
          { value: "promotional", label: "Promotional" },
          { value: "informative", label: "Informative" },
          { value: "persuasive", label: "Persuasive" },
          { value: "appreciative", label: "Appreciative" },
        ]}
      />
    </>
  )
}
