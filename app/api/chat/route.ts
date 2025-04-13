import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Create a Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "AIzaSyBbKlHYGZFhRwtiixJ3MdcTlMDjw3Z4VSA")
console.log("ENV:", process.env.GOOGLE_API_KEY);

// IMPORTANT: Set the runtime to edge for streaming responses
export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()

    if (!lastUserMessage) {
      return new Response(JSON.stringify({ error: "No user message found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create the system prompt - India focused
    const systemPrompt = `You are an expert travel assistant specializing in travel to India.
    Provide helpful, accurate information about Indian destinations, budgeting, planning, local customs, and travel tips.
    Be friendly, concise, and informative. If you don't know something, be honest about it.
    Focus on providing practical advice that travelers to India can use.
    
    When asked about destinations in India:
    - Mention key attractions
    - Suggest best times to visit
    - Provide estimated costs
    - Mention any cultural considerations or travel advisories
    
    When asked about budgeting for India:
    - Give specific price ranges in Indian Rupees (INR) when possible
    - Suggest money-saving tips
    - Consider different travel styles (budget, moderate, luxury)
    
    Format your responses with clear sections and bullet points using Markdown formatting.
    Use headings (##), subheadings (###), bullet points (*), bold (**text**), and other markdown features to make your responses easy to read.
    
    Always provide information specific to India and its diverse regions, cultures, and attractions.`

    // Combine previous messages for context
    const conversationHistory = messages
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n")

    // Create the prompt for Gemini
    const prompt = `${systemPrompt}\n\nConversation history:\n${conversationHistory}\n\nUser: ${lastUserMessage.content}\n\nAssistant:`

    // Initialize the Gemini model (using Gemini 1.5 Flash)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    })

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        topP: 0.95,
      },
    })

    const response = result.response
    const text = response.text()

    // Create a TextEncoder to convert the string to bytes
    const encoder = new TextEncoder()
    const bytes = encoder.encode(text)

    // Return the response as a stream
    return new Response(bytes)
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "There was an error processing your request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
