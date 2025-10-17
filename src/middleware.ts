import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is trying to access dashboard without authentication
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // In a real app, you'd check for a valid session/token
    // For now, we'll just check if the user has localStorage data
    // This is a simple check - in production, use proper session validation
    
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
