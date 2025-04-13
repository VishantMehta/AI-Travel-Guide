import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the Google API key is set
  const googleApiKey = process.env.GOOGLE_API_KEY

  // If accessing API routes and the key is missing, return an error
  if (request.nextUrl.pathname.startsWith("/api/") && !googleApiKey) {
    return new NextResponse(
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

  return NextResponse.next()
}

// Only run middleware on API routes
export const config = {
  matcher: "/api/:path*",
}
