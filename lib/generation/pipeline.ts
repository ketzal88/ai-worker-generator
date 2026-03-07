import { analyzeProductUrl } from '@/lib/gemini/analyze'
import { createImageBriefs, renderImageVariation } from '@/lib/gemini/image-generation'
import { renderVideoVariation } from '@/lib/gemini/video-generation'
import { uploadBase64ToStorage, uploadVideoToStorage } from '@/lib/firebase/storage-upload'
import { updateGeneration, updateGenerationResult, createAsset, refundCredits } from '@/lib/firebase/firestore'
import type { Generation, GenerationResult } from '@/types'

export async function runImagePipeline(generation: Generation): Promise<void> {
  const { id, input, userId, orgId } = generation

  try {
    // Step 1: Analyze product URL
    await updateGeneration(id, { status: 'analyzing' })
    let productAnalysis = generation.productAnalysis
    if (input.url && !productAnalysis) {
      productAnalysis = await analyzeProductUrl(input.url)
      await updateGeneration(id, { productAnalysis, status: 'generating' })
    } else {
      await updateGeneration(id, { status: 'generating' })
    }

    // Step 2: Generate prompts
    const count = input.count || 5
    const briefs = await createImageBriefs(
      productAnalysis || { name: 'Product', description: '', features: [], keywords: [], environment: 'Studio', tone: 'Professional' },
      input.instructions,
      count
    )

    // Create result placeholders
    const results: GenerationResult[] = briefs.map((prompt, i) => ({
      id: `result-${i}`,
      prompt,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }))
    await updateGeneration(id, { results, status: 'rendering' })

    // Step 3: Render each variation
    const imageBase64 = input.imageBase64!
    let completedCount = 0

    for (const result of results) {
      try {
        await updateGenerationResult(id, result.id, { status: 'processing' })

        const imageDataUrl = await renderImageVariation(
          imageBase64,
          result.prompt,
          input.aspectRatio || '3:4'
        )

        // Upload to storage
        const storagePath = `generations/${orgId}/${id}/${result.id}.png`
        const { downloadUrl } = await uploadBase64ToStorage(imageDataUrl, storagePath)

        await updateGenerationResult(id, result.id, {
          status: 'success',
          url: downloadUrl,
          storagePath,
        })

        // Create asset
        await createAsset({
          userId,
          orgId,
          type: 'image',
          generationId: id,
          url: downloadUrl,
          storagePath,
          metadata: {
            prompt: result.prompt,
            productName: productAnalysis?.name,
            aspectRatio: input.aspectRatio || '3:4',
          },
          tags: productAnalysis?.keywords?.slice(0, 5) || [],
          isFavorite: false,
          createdAt: new Date().toISOString(),
        })

        completedCount++
      } catch (err: any) {
        await updateGenerationResult(id, result.id, {
          status: 'error',
          error: err.message,
        })
      }
    }

    // Finalize
    if (completedCount === 0) {
      await updateGeneration(id, { status: 'failed' })
      await refundCredits(orgId, generation.creditsCost, 'All variations failed', id)
    } else {
      await updateGeneration(id, { status: 'completed' })
      if (completedCount < results.length) {
        const refundAmount = ((results.length - completedCount) / results.length) * generation.creditsCost
        await refundCredits(orgId, refundAmount, `${results.length - completedCount} variations failed`, id)
      }
    }
  } catch (err: any) {
    await updateGeneration(id, { status: 'failed' })
    await refundCredits(orgId, generation.creditsCost, err.message, id)
  }
}

export async function runVideoPipeline(generation: Generation): Promise<void> {
  const { id, input, userId, orgId } = generation

  try {
    await updateGeneration(id, { status: 'analyzing' })
    let productAnalysis = generation.productAnalysis
    if (input.url && !productAnalysis) {
      productAnalysis = await analyzeProductUrl(input.url)
      await updateGeneration(id, { productAnalysis })
    }

    await updateGeneration(id, { status: 'rendering' })

    const prompt = input.instructions
      ? `${input.cameraMovement || 'Orbit left'} shot. ${input.instructions}. Product: ${productAnalysis?.name || 'Product'}`
      : `${input.cameraMovement || 'Orbit left'} shot showcasing ${productAnalysis?.name || 'the product'} in a professional studio environment`

    const result: GenerationResult = {
      id: 'result-0',
      prompt,
      status: 'processing',
      createdAt: new Date().toISOString(),
    }
    await updateGeneration(id, { results: [result] })

    const videoBuffer = await renderVideoVariation(
      input.imageBase64!,
      prompt,
      (input.aspectRatio as '9:16' | '16:9') || '16:9'
    )

    const storagePath = `generations/${orgId}/${id}/video.mp4`
    const { downloadUrl } = await uploadVideoToStorage(videoBuffer, storagePath)

    await updateGenerationResult(id, result.id, {
      status: 'success',
      url: downloadUrl,
      storagePath,
    })

    await createAsset({
      userId,
      orgId,
      type: 'video',
      generationId: id,
      url: downloadUrl,
      storagePath,
      metadata: {
        prompt,
        productName: productAnalysis?.name,
        aspectRatio: input.aspectRatio || '16:9',
        duration: input.duration || '8s',
      },
      tags: productAnalysis?.keywords?.slice(0, 5) || [],
      isFavorite: false,
      createdAt: new Date().toISOString(),
    })

    await updateGeneration(id, { status: 'completed' })
  } catch (err: any) {
    await updateGeneration(id, { status: 'failed' })
    await refundCredits(orgId, generation.creditsCost, err.message, id)
  }
}
