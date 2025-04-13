"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Bot, Send, User, Loader2, Languages, Mic, Volume2, BookOpen } from "lucide-react"
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

export default function LanguageGuide() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "Namaste! 🙏 I'm your AI language guide for traveling in India. I can teach you essential phrases in Hindi, Tamil, Bengali, and other Indian languages. Ask me for phrases or help with pronunciation!",
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
      const response = await fetch("/api/language", {
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

  // Example questions for the user - Language focused
  const exampleQuestions = [
    "How do I say thank you in Hindi?",
    "Teach me basic greetings in Tamil",
    "What are some polite phrases in Bengali?",
    "How to ask for directions in Telugu?",
  ]

  const handleExampleClick = (question: string) => {
    setInput(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Predefined common phrases request - Hindi
  const requestHindiPhrases = () => {
    const prompt = "Teach me 10 essential Hindi phrases for travelers with pronunciation and English translation."
    setInput(prompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Predefined restaurant phrases request
  const requestRestaurantPhrases = () => {
    const prompt = "Give me common restaurant phrases in Hindi, Tamil, and Bengali with pronunciation guides."
    setInput(prompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Predefined emergency phrases request
  const requestEmergencyPhrases = () => {
    const prompt = "What are important emergency phrases I should know in multiple Indian languages?"
    setInput(prompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
          <Languages className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          India Travel Language Guide (Gemini 1.5 Flash)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Learn essential phrases in Hindi, Tamil, Bengali and other Indian languages for your travels
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mx-2 sm:mx-4 w-auto">
          <TabsTrigger value="chat" className="text-xs px-2 py-1 h-8">
            Chat
          </TabsTrigger>
          <TabsTrigger value="phrases" className="text-xs px-2 py-1 h-8">
            Quick Phrases
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
                      className="text-[10px] sm:text-xs text-blue-700 border-blue-200 hover:bg-blue-50 h-auto py-1 px-1.5 sm:px-2"
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
                          ? "ml-auto bg-blue-600 text-white max-w-[80%]"
                          : "bg-slate-100 text-slate-900 max-w-[80%]",
                      )}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        {isUser ? <User className="h-3 w-3 text-white" /> : <Bot className="h-3 w-3" />}
                        <span className="font-medium text-[11px] sm:text-xs">
                          {isUser ? "You" : "Language Guide"}
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
                                  className="text-blue-600 hover:underline"
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
                      <span className="font-medium text-[11px] sm:text-xs">Language Guide</span>
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
                placeholder="Ask for phrases or pronunciation help..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 text-xs h-8 sm:h-9"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 h-8 w-8 sm:h-9 sm:w-9"
                title="Send message"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </form>
          </CardFooter>
        </TabsContent>
        <TabsContent value="phrases" className="mt-0">
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={requestHindiPhrases}>
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <Languages className="h-3 w-3 text-blue-500" />
                    Essential Hindi Phrases
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Get common Hindi phrases with pronunciation and translations
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={requestRestaurantPhrases}>
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <Mic className="h-3 w-3 text-amber-500" />
                    Restaurant Phrases
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Learn how to order food and ask about ingredients
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={requestEmergencyPhrases}>
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <Volume2 className="h-3 w-3 text-red-500" />
                    Emergency Phrases
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Important phrases for emergencies in multiple languages
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="p-2 sm:p-3">
                  <CardTitle className="text-xs flex items-center gap-1 sm:gap-2">
                    <BookOpen className="h-3 w-3 text-green-500" />
                    Shopping Phrases
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 pt-0">
                  <p className="text-[10px] sm:text-xs text-slate-600">
                    Useful phrases for bargaining and shopping in markets
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          <CardContent className="flex flex-col items-center justify-center h-[250px] sm:h-[300px] md:h-[400px] text-center p-4">
            <div className="mb-3 p-4 sm:p-6 rounded-full bg-slate-100">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium mb-2">No saved phrases yet</h3>
            <p className="text-[10px] sm:text-xs text-slate-500 mb-3 max-w-md">
              Your saved phrases will appear here. You can bookmark helpful translations for future reference.
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveTab("chat")}
              className="text-[10px] sm:text-xs h-7 sm:h-8"
            >
              Start learning phrases
            </Button>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  )
}