import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { createGeneration, deductCredits } from '@/lib/firebase/firestore'
import { runVideoPipeline } from '@/lib/generation/pipeline'
import type { Generation } from '@/types'

const CREDIT_COST_VIDEO = 5

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = await adminAuth.verifyIdToken(token)
    const userId = decoded.uid
    const orgId = userId

    const body = await request.json()
    const { imageBase64, url, instructions, aspectRatio = '16:9', cameraMovement = 'Orbit left', duration = '8s' } = body

    if (!imageBase64) {
      return NextResponse.json({ error: 'Product image is required' }, { status: 400 })
    }

    const deducted = await deductCredits(orgId, CREDIT_COST_VIDEO, 'Video generation')
    if (!deducted) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    const generation: Omit<Generation, 'id'> = {
      userId,
      orgId,
      type: 'video',
      status: 'pending',
      productUrl: url,
      input: { imageBase64, url, instructions, aspectRatio, cameraMovement, duration },
      creditsCost: CREDIT_COST_VIDEO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: [],
    }

    const generationId = await createGeneration(generation)
    runVideoPipeline({ ...generation, id: generationId } as Generation).catch(console.error)

    return NextResponse.json({ generationId, creditsCost: CREDIT_COST_VIDEO })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
