import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { getAssets, toggleFavorite } from '@/lib/firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = await adminAuth.verifyIdToken(token)
    const orgId = decoded.uid

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'image' | 'video' | null
    const favoriteOnly = searchParams.get('favorites') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const assets = await getAssets(orgId, { type: type || undefined, favoriteOnly, limit })
    return NextResponse.json({ assets })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await adminAuth.verifyIdToken(token)

    const { assetId, action } = await request.json()
    if (action === 'toggleFavorite') {
      const newState = await toggleFavorite(assetId)
      return NextResponse.json({ isFavorite: newState })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
