import { ai } from './client'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const getMimeTypeFromBase64 = (dataUrl: string): string => {
  const match = dataUrl.match(/^data:(image\/[a-z]+);base64,/)
  return match ? match[1] : 'image/png'
}

export async function renderVideoVariation(
  base64Image: string,
  prompt: string,
  aspectRatio: '9:16' | '16:9' = '9:16'
): Promise<Buffer> {
  const mimeType = getMimeTypeFromBase64(base64Image)
  const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image

  const cinematicPrompt = `Cinematic professional E-commerce spot. ${prompt}. High-end commercial photography featuring an unknown professional agency model. Soft studio lighting, slow cinematic motion, focusing on the quality and detail of the product. No identities or celebrities involved. 4k resolution aesthetic.`

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-generate-preview',
    prompt: cinematicPrompt,
    image: { imageBytes: base64Data, mimeType },
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio },
  } as any)

  while (!operation.done) {
    await delay(10000)
    operation = await ai.operations.getVideosOperation({ operation } as any)
  }

  const raiFiltered = (operation as any).response?.generateVideoResponse?.raiMediaFilteredCount
  if (raiFiltered > 0) {
    throw new Error('Video blocked by safety filter. Try a different image or prompt.')
  }

  const downloadLink = (operation as any).response?.generatedVideos?.[0]?.video?.uri
  if (!downloadLink) throw new Error('No video generated')

  const API_KEY = process.env.GEMINI_API_KEY || ''
  const response = await fetch(`${downloadLink}&key=${API_KEY}`)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
