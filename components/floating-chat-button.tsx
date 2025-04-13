"use client"

import { useState, useEffect } from "react"
import { Bot, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TravelChatbot from "@/components/travel-chatbot"
import { cn } from "@/lib/utils"

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Only show on client-side to prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg"
          aria-label="Open chat assistant"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      <div
        className={cn(
          "fixed bottom-0 right-0 z-50 w-full sm:w-[350px] md:w-[400px] transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <Card className="rounded-b-none sm:rounded-b-lg shadow-xl border-t-0 sm:border-t h-[70vh] sm:h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-2 sm:p-3 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              <span className="font-medium text-xs sm:text-sm">India Travel Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <TravelChatbot />
          </div>
        </Card>
      </div>
    </>
  )
}
