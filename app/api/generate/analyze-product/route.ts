import { NextRequest, NextResponse } from 'next/server'
import { analyzeProductUrl } from '@/lib/gemini/analyze'
import { adminAuth } from '@/lib/firebase/admin'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await adminAuth.verifyIdToken(token)

    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })

    const analysis = await analyzeProductUrl(url)
    return NextResponse.json(analysis)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
