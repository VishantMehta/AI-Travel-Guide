"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ApiKeyWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Check if API is working by making a test request
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/check-api-key")
        const data = await response.json()

        if (data.error) {
          setShowWarning(true)
        } else {
          setShowWarning(false)
        }
      } catch (error) {
        setShowWarning(true)
      }
    }

    checkApiKey()
  }, [])

  if (!showWarning) return null

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Missing API Key</AlertTitle>
      <AlertDescription>
        The Google API key is not configured. Please add your GOOGLE_API_KEY to the environment variables.
      </AlertDescription>
    </Alert>
  )
}
