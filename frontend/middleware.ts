import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname starts with these prefixes
  const isAuthRoute = pathname.startsWith("/auth")
  // const isDashboardRoute = pathname.startsWith("/dashboard")

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect logic for auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect logic for protected routes
  // if (isDashboardRoute && !token) {
  //   const url = new URL("/auth/login", request.url)
  //   url.searchParams.set("callbackUrl", encodeURI(request.url))
  //   return NextResponse.redirect(url)
  // }

  // return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/health|_next/static|_next/image|favicon.ico).*)"],
}
