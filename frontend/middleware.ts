import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/create",
    "/content",
    "/templates",
    "/images",
    "/analytics",
    "/team",
    "/settings",
    "/billing",
  ]

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL(`/auth/login`, request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (token && request.nextUrl.pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should be active on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create/:path*",
    "/content/:path*",
    "/templates/:path*",
    "/images/:path*",
    "/analytics/:path*",
    "/team/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/auth/:path*",
  ],
}
