"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TravelHero() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-emerald-50"></div>

      {/* Decorative elements - colors adjusted for India theme */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-green-600 bg-clip-text text-transparent">
            Discover Incredible India
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-8">
            Plan your perfect Indian adventure with our AI budget calculator and travel assistant
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white"
              onClick={() => {
                const budgetSection = document.getElementById("budget-section")
                if (budgetSection) {
                  budgetSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Try Budget Calculator
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-amber-500 text-amber-700 hover:bg-amber-50"
              onClick={() => {
                const chatSection = document.getElementById("chat-section")
                if (chatSection) {
                  chatSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Chat with AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
