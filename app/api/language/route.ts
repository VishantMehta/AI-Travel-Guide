import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Create a Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "key")

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

    // Create the system prompt - Language learning focused
    const systemPrompt = `You are an expert language teacher specializing in Indian languages for travelers.
    Your goal is to teach practical, essential phrases in Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, and other Indian languages.
    Always provide:
    - The phrase in the local script (e.g., Devanagari for Hindi)
    - A phonetic pronunciation guide (English letters)
    - The English translation
    - Cultural notes when relevant
    
    Format your responses clearly with markdown:
    - Use headings (##) for language names
    - Put phrases in bullet points with the format:
      * **Phrase in local script** (Pronunciation) - "English translation"
    - Add cultural notes in italics when helpful
    
    For pronunciation guides:
    - Use simple English approximations
    - Capitalize stressed syllables (e.g., "NA-mas-tay" for नमस्ते)
    - Explain tricky sounds if needed
    
    Focus on practical travel situations:
    - Greetings and polite expressions
    - Directions and transportation
    - Shopping and bargaining
    - Food and dining
    - Emergencies and help
    
    Keep responses concise but informative. If asked for many phrases, organize them by category.
    
    Example format for Hindi:
    ## Hindi
    * **नमस्ते** (NA-mas-tay) - "Hello/Greetings"
      *Cultural note: This is a universal greeting used at any time of day*
    * **धन्यवाद** (DHUN-yuh-vaad) - "Thank you"`

    // Combine previous messages for context
    const conversationHistory = messages
      .filter((m) => m.role !== "system")
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n")

    // Create the prompt for Gemini
    const prompt = `${systemPrompt}\n\nConversation history:\n${conversationHistory}\n\nUser: ${lastUserMessage.content}\n\nAssistant:`

    // Initialize the Gemini model (using Gemini 1.5 Flash)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
    console.error("Error in language guide API:", error)
    return new Response(JSON.stringify({ error: "There was an error processing your request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}