import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { createGeneration, deductCredits } from '@/lib/firebase/firestore'
import { runImagePipeline } from '@/lib/generation/pipeline'
import type { Generation } from '@/types'

const CREDIT_COST_PER_IMAGE = 0.5

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const decoded = await adminAuth.verifyIdToken(token)
    const userId = decoded.uid
    const orgId = userId // For now, org = user

    const body = await request.json()
    const { imageBase64, url, instructions, count = 5, aspectRatio = '3:4' } = body

    if (!imageBase64) {
      return NextResponse.json({ error: 'Product image is required' }, { status: 400 })
    }

    const creditsCost = count * CREDIT_COST_PER_IMAGE
    const deducted = await deductCredits(orgId, creditsCost, `Image generation: ${count} variations`)
    if (!deducted) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    const generation: Omit<Generation, 'id'> = {
      userId,
      orgId,
      type: 'image',
      status: 'pending',
      productUrl: url,
      input: { imageBase64, url, instructions, count, aspectRatio },
      creditsCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      results: [],
    }

    const generationId = await createGeneration(generation)

    // Fire and forget - don't await
    runImagePipeline({ ...generation, id: generationId } as Generation).catch(console.error)

    return NextResponse.json({ generationId, creditsCost })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
