import { Suspense } from "react"
import Image from "next/image"
import { ArrowRight, Compass, MessageSquare, Calculator } from "lucide-react"
import LanguageChatbot from "@/components/langauge-chatbot" // Add this import

import { Button } from "@/components/ui/button"
import TravelHero from "@/components/travel-hero"
import BudgetCalculator from "@/components/budget-calculator"
import TravelChatbot from "@/components/travel-chatbot"
import FeatureCard from "@/components/feature-card"
import ApiKeyWarning from "@/components/api-key-warning"
import DestinationExplorer from "@/components/destination-explorer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <TravelHero />

      <section className="container mx-auto px-4 py-12 sm:py-20">
        <ApiKeyWarning />

        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            Plan Your Indian Journey with AI
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Our AI-powered tools help you plan the perfect trip to India within your budget. Get personalized
            recommendations and instant assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <FeatureCard
            icon={<Compass className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />}
            title="Discover India"
            description="Find hidden gems and popular attractions across India tailored to your preferences."
          />
          <FeatureCard
            icon={<Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />}
            title="Budget Planning"
            description="Get accurate cost estimates for your entire trip to India with our AI calculator."
          />
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />}
            title="24/7 AI Assistant"
            description="Ask questions and get travel advice about India anytime with our AI chatbot."
          />
        </div>
      </section>

      <section className="bg-gradient-to-b from-slate-50 to-slate-100 py-12 sm:py-20" id="budget-section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6 text-slate-800">
                India Travel Budget Calculator
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
                Plan your trip to India with confidence. Our AI analyzes thousands of data points to give you accurate
                budget estimates for any destination in India.
              </p>
              <Suspense
                fallback={<div className="h-[300px] sm:h-[400px] w-full bg-slate-100 animate-pulse rounded-xl"></div>}
              >
                <BudgetCalculator />
              </Suspense>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-orange-200 rounded-full blur-3xl opacity-20"></div>
              <Image
                src="/pigi.jpg?height=100&width=500"
                alt="Travel budget planning"
                width={500}
                height={300}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
{/* 
      <section className="py-12 sm:py-20 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6 text-slate-800">India Destination Explorer</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
              Discover new destinations and get essential information about popular travel spots across India.
            </p>
            <Suspense
              fallback={<div className="h-[300px] sm:h-[400px] w-full bg-slate-100 animate-pulse rounded-xl"></div>}
            >
              <DestinationExplorer />
            </Suspense>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-amber-200 rounded-full blur-3xl opacity-20"></div>
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Destination Explorer"
              width={500}
              height={500}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section> */}

      <section className="py-12 sm:py-20 container mx-auto px-4" id="chat-section">
        <div className="flex flex-col lg:flex-row-reverse gap-8 sm:gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6 text-slate-800">India Travel Assistant</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
              Get instant answers to all your India travel questions. Our AI chatbot provides personalized
              recommendations and travel tips.
            </p>
            <Suspense
              fallback={<div className="h-[300px] sm:h-[400px] w-full bg-slate-100 animate-pulse rounded-xl"></div>}
            >
              <TravelChatbot />
            </Suspense>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-green-200 rounded-full blur-3xl opacity-20"></div>
            <Image
              src="/placeholder2.jpg?height=500&width=500"
              alt="AI Travel Assistant"
              width={500}
              height={500}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

            {/* New Language Guide Section */}
            <section className="py-12 sm:py-20 container mx-auto px-4 bg-slate-50 rounded-lg my-8" id="language-section">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6 text-slate-800">India Language Guide</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
              Learn essential phrases in Hindi, Tamil, Bengali and other Indian languages to enhance your travel experience.
            </p>
            <Suspense
              fallback={<div className="h-[300px] sm:h-[400px] w-full bg-slate-100 animate-pulse rounded-xl"></div>}
            >
              <LanguageChatbot />
            </Suspense>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-blue-200 rounded-full blur-3xl opacity-20"></div>
            <Image
                src="/photoss.jpeg?height=100&width=500"
                alt="Language Guide"
              width={500}
              height={500}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>







  <div className="max-w-5xl mx-auto my-10 p-6 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text rounded-2xl shadow-md">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Project Group Members-: </h2>
  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Member 1 */}
      <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Vishant</h3>
        <p className="text-sm text-gray-600">Reg No: 12318370</p>
        <p className="text-sm text-gray-600">Roll No: 64</p>
      </div>

      {/* Member 2 */}
      <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Naman Katare</h3>
        <p className="text-sm text-gray-600">Reg No:12307760</p>
        <p className="text-sm text-gray-600">Roll No: 63</p>
      </div>
  </div>
</div>











<section className="bg-gradient-to-b from-orange-900 to-amber-900 text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-6">Ready to Explore India?</h2>
          <p className="text-orange-100 max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
            Start using our AI tools today and experience the future of India travel planning.
          </p>
          <Button size="lg" className="bg-white text-orange-900 hover:bg-orange-50 text-xs sm:text-sm h-9 sm:h-10">
            Get Started <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </section>



















    </main>
  )
}
