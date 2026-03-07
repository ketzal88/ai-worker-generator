import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { getGenerations } from '@/lib/firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = await adminAuth.verifyIdToken(token)
    const orgId = decoded.uid

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'image' | 'video' | null
    const limit = parseInt(searchParams.get('limit') || '50')

    const generations = await getGenerations(orgId, { type: type || undefined, limit })

    // Strip base64 data
    const safe = generations.map(g => ({
      ...g,
      input: { ...g.input, imageBase64: undefined },
    }))

    return NextResponse.json({ generations: safe })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
