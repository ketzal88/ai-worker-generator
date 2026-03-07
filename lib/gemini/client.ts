import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'

const API_KEY = process.env.GEMINI_API_KEY || ''

export const ai = new GoogleGenAI({ apiKey: API_KEY })

export const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
]

export const mapToSupportedRatio = (ratio: string): '1:1' | '3:4' | '4:3' | '9:16' | '16:9' => {
  const supported = ['1:1', '3:4', '4:3', '9:16', '16:9']
  if (supported.includes(ratio)) return ratio as any
  if (ratio === '4:5') return '3:4'
  return '1:1'
}
