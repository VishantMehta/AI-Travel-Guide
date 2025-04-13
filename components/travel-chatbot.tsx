"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Bot, Send, User, Loader2, Globe, Calendar, DollarSign, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export default function TravelChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Hi! I'm your AI travel assistant powered by Gemini 1.5 Flash. Ask me anything about destinations in India, travel tips, or planning advice!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("chat")

  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      // Read the response as a stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error("Response body is null")

      let responseText = ""

      // Create a new message for the assistant's response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk
        const chunk = new TextDecoder().decode(value)
        responseText += chunk

        // Update the assistant's message with the new chunk
        setMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: responseText } : msg)),
        )
      }
    } catch (err) {
      console.error("Error in chat:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem with the chat. Please try again.",
      })
    } finally {
      setIsLoading(false)
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  // Example questions for the user - India focused
  const exampleQuestions = [
    "What are the best places to visit in Rajasthan?",
    "How much should I budget for a week in Goa?",
    "What's the best time to visit Kerala?",
    "What should I pack for a trip to the Himalayas?",
  ]

  const handleExampleClick = (question: string) => {
    setInput(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Predefined itinerary request - India focused
  const requestItinerary = () => {
    const itineraryPrompt =
      "Create a 7-day itinerary for the Golden Triangle (Delhi, Agra, Jaipur) for a first-time visitor to India."
    setInput(itineraryPrompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Predefined packing list request - India focused
  const requestPackingList = () => {
    const packingPrompt = "Create a packing list for a 2-week trip to India covering both North and South regions."
    setInput(packingPrompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Predefined safety tips request - India focused
  const requestSafetyTips = () => {
    const safetyPrompt = "What are important safety tips for solo travelers in India?"
    setInput(safetyPrompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          India Travel Assistant (Gemini 1.5 Flash)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Ask questions about destinations in India, travel tips, or planning advice
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mx-2 sm:mx-4 w-auto">
          <TabsTrigger value="chat" className="text-xs px-2 py-1 h-8">
            Chat
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs px-2 py-1 h-8">
            Templates
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-xs px-2 py-1 h-8">
            Saved
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="mt-0">
          <CardContent className="p-2 sm:p-4">
            {error && (
              <Alert variant="destructive" className="mb-3 text-xs sm:text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {messages.length === 1 && (
              <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">Try asking about:</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {exampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-[10px] sm:text-xs text-orange-700 border-orange-200 hover:bg-orange-50 h-auto py-1 px-1.5 sm:px-2"
                      onClick={() => handleExampleClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-[300px] sm:h-[350px] md:h-[400px] overflow-y-auto pr-2 sm:pr-4">
              <div className="space-y-3">
                {messages.map((message) => {
                  const isUser = message.role === "user"
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex flex-col gap-1 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs",
                        isUser
                          ? "ml-auto bg-orange-600 text-white max-w-[80%]"
                          : "bg-slate-100 text-slate-900 max-w-[80%]",
                      )}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        {isUser ? <User className="h-3 w-3 text-white" /> : <Bot className="h-3 w-3" />}
                        <span className="font-medium text-[11px] sm:text-xs">
                          {isUser ? "You" : "Travel Assistant"}
                        </span>
                      </div>
                      <div className={isUser ? "text-white" : ""}>
                        {isUser ? (
                          <div className="whitespace-pre-line">{message.content}</div>
                        ) : (
                          <ReactMarkdown
                            components={{
                              h1: ({ node, ...props }) => <h1 className="text-sm font-bold my-1.5" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-xs font-bold my-1.5" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-xs font-bold my-1" {...props} />,
                              p: ({ node, ...props }) => <p className="my-1" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-3 my-1" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-3 my-1" {...props} />,
                              li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                              a: ({ node, ...props }) => (
                                <a
                                  className="text-orange-600 hover:underline"
                                  target="_blank"
                                  rel="noopener"
                                  {...props}
                                />
                              ),
                              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                              em: ({ node, ...props }) => <em className="italic" {...props} />,
                              code: ({ node, ...props }) => (
                                <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]" {...props} />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-2 border-slate-300 pl-2 italic text-slate-700"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )
                })}
                {isLoading && (
                  <div className="flex flex-col gap-1 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs bg-slate-100 text-slate-900 max-w-[80%]">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Bot className="h-3 w-3" />
                      <span className="font-medium text-[11px] sm:text-xs">Travel Assistant</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 sm:p-4">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-1 sm:space-x-2">
              <Input
                ref={inputRef}
                placeholder="Ask about India travel..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-xs h-8 sm:h-9"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700 h-8 w-8 sm:h-9 sm:w-9"
                title="Send message"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </form>
          </CardFooter>
        </TabsContent>
        <TabsContent value="templates" className="mt-0">
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={requestItinerary}>
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <Calendar className="h-3 w-3 text-orange-500" />
                    Golden Triangle Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Generate a detailed 7-day itinerary for Delhi, Agra, and Jaipur
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={requestPackingList}>
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <DollarSign className="h-3 w-3 text-amber-500" />
                    India Packing List
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Get a comprehensive packing list for traveling across India
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={requestSafetyTips}>
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <Globe className="h-3 w-3 text-green-500" />
                    Safety Tips for India
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Learn essential safety tips for travelers in India
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <MapPin className="h-3 w-3 text-rose-500" />
                    Indian Festivals Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Discover the best festivals to experience in India
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          <CardContent className="flex flex-col items-center justify-center h-[250px] sm:h-[300px] md:h-[400px] text-center p-4">
            <div className="mb-3 p-4 sm:p-6 rounded-full bg-slate-100">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium mb-2">No saved responses yet</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 mb-3 max-w-md">
              Your saved responses will appear here. You can save helpful travel advice for future reference.
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveTab("chat")}
              className="text-[10px] sm:text-xs h-7 sm:h-8"
            >
              Start a conversation
            </Button>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
