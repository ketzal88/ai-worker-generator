import { ai, SAFETY_SETTINGS, mapToSupportedRatio } from './client'
import { WORKER_SYSTEM_INSTRUCTION } from './prompts'
import { Type } from '@google/genai'
import type { ProductAnalysis } from '@/types'

export async function createImageBriefs(
  analysis: ProductAnalysis,
  userInstructions?: string,
  count: number = 5
): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Product: ${analysis.name}
Brand: ${analysis.brand || 'Unknown'}
Description: ${analysis.description}
Keywords: ${analysis.keywords.join(', ')}
Environment: ${analysis.environment}
Tone: ${analysis.tone}
${userInstructions ? `Client Instructions: ${userInstructions}` : ''}

Generate ${count} DIFFERENT visual advertising prompts for professional product photography.
Each prompt should describe a unique scene, angle, or composition.
Focus on commercial-grade e-commerce imagery.

Return ONLY a JSON array of strings.`,
    config: {
      responseMimeType: 'application/json',
      safetySettings: SAFETY_SETTINGS,
      responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } } as any,
    },
  } as any)

  try {
    return JSON.parse(response.text || '[]')
  } catch {
    return []
  }
}

export async function renderImageVariation(
  productImageBase64: string,
  prompt: string,
  aspectRatio: string = '3:4'
): Promise<string> {
  const base64Data = productImageBase64.includes(',')
    ? productImageBase64.split(',')[1]
    : productImageBase64

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Data } },
        { text: `Professional commercial product photography: ${prompt}` },
      ],
    },
    config: {
      systemInstruction: WORKER_SYSTEM_INSTRUCTION,
      safetySettings: SAFETY_SETTINGS,
      imageConfig: {
        aspectRatio: mapToSupportedRatio(aspectRatio),
        imageSize: '1K',
      },
    },
  } as any)

  const part = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)
  if (!part?.inlineData?.data) throw new Error('Image generation blocked by safety filter')
  return `data:image/png;base64,${part.inlineData.data}`
}
