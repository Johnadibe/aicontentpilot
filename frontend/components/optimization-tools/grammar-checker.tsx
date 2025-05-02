"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Check, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { checkGrammar } from "@/lib/optimization-service"

interface GrammarIssue {
  text: string;
  type: string;
  explanation?: string;
  suggestions: string[];
}

const grammarCheckerSchema = z.object({
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  check_style: z.boolean().default(true),
  check_punctuation: z.boolean().default(true),
  check_spelling: z.boolean().default(true),
  check_grammar: z.boolean().default(true),
})

type GrammarCheckerFormValues = z.infer<typeof grammarCheckerSchema>

export function GrammarChecker() {
  const { toast } = useToast()
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<any>(null)

  const form = useForm<GrammarCheckerFormValues>({
    resolver: zodResolver(grammarCheckerSchema),
    defaultValues: {
      content: "",
      check_style: true,
      check_punctuation: true,
      check_spelling: true,
    },
  })

  async function onSubmit(data: GrammarCheckerFormValues) {
    try {
      setIsChecking(true)
      setCheckResult(null)

      // Check grammar using API
      const result = await checkGrammar({
        content: data.content,
        check_style: data.check_style,
        check_punctuation: data.check_punctuation,
        check_spelling: data.check_spelling,
      })

      // Set the check result
      setCheckResult(result)

      toast({
        title: "Grammar check complete",
        description: "Your content has been checked successfully.",
      })
    } catch (error) {
      console.error("Error checking grammar:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check grammar",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  // Helper function to get issue type badge
  const getIssueTypeBadge = (type: string) => {
    switch (type) {
      case "grammar":
        return <Badge variant="destructive">Grammar</Badge>
      case "spelling":
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Spelling</Badge>
      case "style":
        return <Badge variant="outline">Style</Badge>
      case "punctuation":
        return <Badge variant="secondary">Punctuation</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  return (
    <div className="grid gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content to Check</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the content you want to check for grammar and spelling..."
                    className="min-h-32 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Paste your content here for grammar and spelling check.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="check_spelling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Spelling</FormLabel>
                    <FormDescription>Check for spelling errors</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="check_grammar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Grammar</FormLabel>
                    <FormDescription>Check for grammar errors</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="check_style"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Style</FormLabel>
                    <FormDescription>Check for style issues</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="gradient-primary" disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Grammar & Spelling"
            )}
          </Button>
        </form>
      </Form>

      {checkResult && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Grammar Check Results</span>
                <Badge variant={checkResult.total_issues === 0 ? "secondary" : "outline"}
                  className={checkResult.total_issues === 0 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}>
                  {checkResult.total_issues} {checkResult.total_issues === 1 ? "Issue" : "Issues"} Found
                </Badge>
              </CardTitle>
              <CardDescription>
                {checkResult.total_issues === 0 ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="h-4 w-4" />
                    <span>No issues found in your content</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>We found some issues that could be improved</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Statistics */}
              {checkResult.total_issues > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(checkResult.statistics).map(
                    ([type, count]) =>
                      typeof count === 'number' && count > 0 && (
                        <div key={type} className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </p>
                          <p className="text-2xl font-bold">{count}</p>
                        </div>
                      ),
                  )}
                </div>
              )}

              {/* Corrected Text */}
              {checkResult.total_issues > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Corrected Text</h3>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <p className="whitespace-pre-wrap">{checkResult.corrected_text}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Issues */}
              {checkResult.issues.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Detailed Issues</h3>
                  {checkResult.issues.map((issue: GrammarIssue, index: number) => (
                    <Card key={index} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{issue.text}</span>
                            </div>
                            {getIssueTypeBadge(issue.type)}
                          </div>
                          {issue.explanation && <p className="text-sm text-muted-foreground">{issue.explanation}</p>}
                          {issue.suggestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Suggestions:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {issue.suggestions.map((suggestion, i) => (
                                  <Badge key={i} variant="outline">
                                    {suggestion}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
