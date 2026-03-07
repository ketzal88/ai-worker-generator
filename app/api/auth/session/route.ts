import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

export async function POST(req: NextRequest) {
  try {
    const { idToken, uid } = await req.json()
    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 })
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)

    // Verify domain
    if (!decodedToken.email?.endsWith('@worker.ar')) {
      return NextResponse.json({ error: 'Unauthorized domain' }, { status: 403 })
    }

    // Create session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

    const isProduction = process.env.NODE_ENV === 'production'

    const response = NextResponse.json({ status: 'success' })

    // Set session cookie
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: isProduction,
      path: '/',
      sameSite: 'lax',
    })

    // Set uid cookie (non-httpOnly for client access)
    response.cookies.set('uid', uid || decodedToken.uid, {
      maxAge: expiresIn / 1000,
      httpOnly: false,
      secure: isProduction,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error: any) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' })
  response.cookies.set('__session', '', { maxAge: 0, path: '/' })
  response.cookies.set('uid', '', { maxAge: 0, path: '/' })
  return response
}
