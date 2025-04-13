import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Create a Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "AIzaSyBbKlHYGZFhRwtiixJ3MdcTlMDjw3Z4VSA")

export async function POST(req: Request) {
  try {
    const { destination, duration, travelers, travelStyle } = await req.json()

    if (!destination || !duration || !travelers || !travelStyle) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const prompt = `
      Act as a travel budget expert specializing in India travel. Create a detailed budget estimate for a trip to India with the following details:
      - Destination in India: ${destination}
      - Duration: ${duration} days
      - Number of travelers: ${travelers}
      - Travel style: ${travelStyle} (budget, moderate, luxury)
      
      Provide a detailed breakdown of estimated costs in Indian Rupees (INR) for:
      1. Transportation (flights within India, local transportation, train travel, etc.)
      2. Accommodation (total cost, cost per night)
      3. Food and dining (cost per day per person)
      4. Activities and sightseeing (must include at least 3 specific activities with prices)
      5. Miscellaneous expenses (souvenirs, tips, etc.)
      
      Give a total estimated budget range in INR and at least 3 money-saving tips specific to this destination in India.
      
      Format the response using Markdown with headings (##), subheadings (###), bullet points (*), and other formatting to make it easy to read.
      Include a brief introduction about the destination and why it's worth visiting.
    `

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

    return new Response(JSON.stringify({ result: text }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error in budget API:", error)
    return new Response(JSON.stringify({ error: "Failed to process budget request" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
