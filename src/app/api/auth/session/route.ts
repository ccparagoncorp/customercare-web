import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { action, maxAge } = await request.json().catch(() => ({ action: 'set' }))

    const res = NextResponse.json({ ok: true })

    const isProd = process.env.NODE_ENV === 'production'

    if (action === 'clear') {
      res.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      })
      return res
    }

    // Minimal presence cookie. Replace value with a real session id or signed JWT in production.
    res.cookies.set('auth-token', '1', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: typeof maxAge === 'number' ? maxAge : 60 * 60 * 24, // 1 day
    })
    return res
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}


