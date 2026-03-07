import { ai, SAFETY_SETTINGS } from './client'
import type { ProductAnalysis } from '@/types'

export async function analyzeProductUrl(url: string): Promise<ProductAnalysis> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `You are a high-performance e-commerce advertising specialist.
Analyze the provided product URL and extract all relevant data for creating a professional marketing campaign.

STRICT RULE: All text content (name, description, features, keywords, environment, tone) MUST be in SPANISH (Español), even if the source URL is in English or another language.

URL: ${url}

EXTRACT THE FOLLOWING DATA:
1. name: Complete product name (Translate to Spanish).
2. brand: The brand name or store name.
3. logo: URL of the brand logo image.
4. description: A clear, compelling product description in Spanish.
5. features: Array of the top 3-6 product benefits in Spanish.
6. pricing: Object { original, promo, currency }.
7. mainImage: Primary product image URL.
8. gallery: Array of up to 4 additional image URLs.
9. keywords: 5-8 marketing keywords in Spanish.
10. environment: Visual setting for ad shoot in Spanish.
11. tone: Emotional brand tone in Spanish.

Return ONLY valid JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      safetySettings: SAFETY_SETTINGS,
    },
  } as any)

  const sources = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter((chunk: any) => chunk.web)
    ?.map((chunk: any) => ({ uri: chunk.web!.uri, title: chunk.web!.title || chunk.web!.uri })) || []

  let text = (response as any).text || '{}'
  if (text.includes('```json')) {
    text = text.split('```json')[1].split('```')[0]
  } else if (text.includes('```')) {
    text = text.split('```')[1].split('```')[0]
  }

  const data = JSON.parse(text)

  return {
    name: data.name || 'Producto sin nombre',
    brand: data.brand,
    logo: data.logo,
    description: data.description || '',
    features: data.features || [],
    pricing: data.pricing,
    mainImage: data.mainImage,
    gallery: data.gallery,
    keywords: data.keywords || [],
    environment: data.environment || 'E-commerce Studio',
    tone: data.tone || 'Professional',
    sources,
  }
}
