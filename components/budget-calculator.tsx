"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Calculator, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ReactMarkdown from "react-markdown"

const formSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  duration: z.number().min(1).max(30),
  travelers: z.number().min(1).max(10),
  travelStyle: z.string(),
})

// Indian destinations for suggestions
const indianDestinations = [
  "Delhi",
  "Mumbai",
  "Jaipur",
  "Agra",
  "Goa",
  "Kerala",
  "Varanasi",
  "Udaipur",
  "Darjeeling",
  "Rishikesh",
  "Amritsar",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Bangalore",
]

export default function BudgetCalculator() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      duration: 7,
      travelers: 2,
      travelStyle: "moderate",
    },
  })

  // Handle destination input for suggestions
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    form.setValue("destination", value)

    if (value.length > 1) {
      const filtered = indianDestinations.filter((dest) => dest.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = (suggestion: string) => {
    form.setValue("destination", suggestion)
    setSuggestions([])
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data.result)
    } catch (err) {
      console.error("Error calculating budget:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && result) {
      // Scroll to result when it's available
      const resultElement = document.getElementById("budget-result")
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [loading, result])

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
        <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
          <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          India Travel Budget Calculator
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Get an AI-generated budget estimate for your trip to India
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4 text-xs sm:text-sm">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <AlertTitle className="text-xs sm:text-sm">Error</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-xs sm:text-sm">Destination in India</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Delhi, Goa, Kerala"
                      {...field}
                      onChange={handleDestinationChange}
                      className="text-xs sm:text-sm h-8 sm:h-10"
                    />
                  </FormControl>
                  <FormDescription className="text-[10px] sm:text-xs">
                    Enter a city, state, or region in India
                  </FormDescription>
                  <FormMessage className="text-[10px] sm:text-xs" />

                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white shadow-md rounded-md mt-1 border border-slate-200">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 hover:bg-slate-100 cursor-pointer text-xs"
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Duration (days): {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={30}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-3"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Number of Travelers: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-3"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm">Travel Style</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-xs sm:text-sm h-8 sm:h-10">
                        <SelectValue placeholder="Select your travel style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="budget" className="text-xs sm:text-sm">
                        Budget
                      </SelectItem>
                      <SelectItem value="moderate" className="text-xs sm:text-sm">
                        Moderate
                      </SelectItem>
                      <SelectItem value="luxury" className="text-xs sm:text-sm">
                        Luxury
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[10px] sm:text-xs">
                    This affects accommodation, dining, and activity estimates
                  </FormDescription>
                  <FormMessage className="text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-xs sm:text-sm h-8 sm:h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>Calculate Budget</>
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <div
            id="budget-result"
            className="mt-6 p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 animate-in fade-in duration-300"
          >
            <h3 className="font-medium text-sm sm:text-lg mb-2 text-slate-800">Your Budget Estimate</h3>
            <div className="prose prose-sm max-w-none text-xs sm:text-sm">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-base sm:text-lg font-bold my-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-sm sm:text-base font-bold my-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xs sm:text-sm font-bold my-1" {...props} />,
                  p: ({ node, ...props }) => <p className="my-1 text-xs sm:text-sm" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-1" {...props} />,
                  li: ({ node, ...props }) => <li className="my-0.5 text-xs sm:text-sm" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-orange-600 hover:underline" target="_blank" rel="noopener" {...props} />
                  ),
                  strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                  code: ({ node, ...props }) => (
                    <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px] sm:text-xs" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-2 border-slate-300 pl-2 italic text-slate-700" {...props} />
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null)
                  form.reset()
                }}
                className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50 h-7 sm:h-8"
              >
                Start New Calculation
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
