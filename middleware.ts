import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req

  // Protect all /agent/* routes
  if (nextUrl.pathname.startsWith('/agent')) {
    const token = cookies.get('auth-token')?.value
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('next', nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/agent/:path*'],
}


