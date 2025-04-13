export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: "Missing API key. Please set the GOOGLE_API_KEY environment variable.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "API key is configured",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
}
