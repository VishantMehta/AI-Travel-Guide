"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Calendar, Plane, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

const popularDestinations = [
  {
    name: "Taj Mahal, Agra",
    description: "Iconic white marble mausoleum and UNESCO World Heritage site",
    bestTime: "October-March",
    travelTime: "3-4 hours from Delhi",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Jaipur, Rajasthan",
    description: "The 'Pink City' with stunning palaces and forts",
    bestTime: "October-March",
    travelTime: "5-6 hours from Delhi",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Goa Beaches",
    description: "Beautiful beaches, nightlife, and Portuguese influence",
    bestTime: "November-February",
    travelTime: "1-2 hour flight from Mumbai",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Varanasi, Uttar Pradesh",
    description: "Ancient spiritual city on the banks of the Ganges River",
    bestTime: "October-March",
    travelTime: "1.5 hour flight from Delhi",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function DestinationExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof popularDestinations>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      // Filter destinations that match the search query
      const results = popularDestinations.filter((dest) => dest.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setSearchResults(results)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
        <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          India Destination Explorer
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Discover travel destinations across India and get essential information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4 sm:mb-6">
          <Input
            placeholder="Search destinations (e.g., Taj Mahal, Goa)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
          />
          <Button type="submit" disabled={isLoading} className="text-xs sm:text-sm h-8 sm:h-10 whitespace-nowrap">
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>

        <Tabs defaultValue="popular">
          <TabsList className="mb-4 h-8">
            <TabsTrigger value="popular" className="text-xs h-6 px-2">
              Popular
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-xs h-6 px-2">
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="search"
              disabled={searchResults.length === 0 && !isLoading}
              className="text-xs h-6 px-2"
            >
              Search Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {popularDestinations.map((destination, index) => (
                <DestinationCard key={index} destination={destination} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="flex flex-col items-center justify-center py-6 sm:py-8">
              <Info className="h-8 w-8 sm:h-12 sm:w-12 text-slate-300 mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-slate-500">Trending destinations in India will be updated soon!</p>
            </div>
          </TabsContent>

          <TabsContent value="search">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <Skeleton className="h-[150px] sm:h-[200px] w-full rounded-t-lg" />
                      <div className="p-3 sm:p-4">
                        <Skeleton className="h-4 sm:h-6 w-3/4 mb-2" />
                        <Skeleton className="h-3 sm:h-4 w-full mb-2" />
                        <Skeleton className="h-3 sm:h-4 w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {searchResults.map((destination, index) => (
                  <DestinationCard key={index} destination={destination} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                <Info className="h-8 w-8 sm:h-12 sm:w-12 text-slate-300 mb-3 sm:mb-4" />
                <p className="text-xs sm:text-sm text-slate-500">No destinations found matching your search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DestinationCard({ destination }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-[150px] sm:h-[200px] relative">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
          <h3 className="text-xs sm:text-sm font-bold text-white">{destination.name}</h3>
        </div>
      </div>
      <CardContent className="p-2 sm:p-4 pt-2 sm:pt-4">
        <p className="text-[10px] sm:text-sm text-slate-600 mb-2 sm:mb-4">{destination.description}</p>
        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-500" />
            <span className="text-slate-700">Best time: {destination.bestTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Plane className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-500" />
            <span className="text-slate-700">Travel: {destination.travelTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 sm:p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-[10px] sm:text-xs text-orange-600 border-orange-200 hover:bg-orange-50 h-6 sm:h-8"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
