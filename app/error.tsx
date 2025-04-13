"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-4">
      <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-600 mb-6 max-w-md">
        We apologize for the inconvenience. An error occurred while loading this page.
      </p>
      <Button onClick={reset} className="bg-teal-600 hover:bg-teal-700">
        Try again
      </Button>
    </div>
  )
}
