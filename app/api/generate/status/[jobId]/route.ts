import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { getGeneration } from '@/lib/firebase/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const token = request.cookies.get('__session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await adminAuth.verifyIdToken(token)

    const { jobId } = await params
    const generation = await getGeneration(jobId)
    if (!generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Don't send back the full base64 image
    const { input, ...rest } = generation
    const safeInput = { ...input, imageBase64: undefined }

    return NextResponse.json({ ...rest, input: safeInput })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
