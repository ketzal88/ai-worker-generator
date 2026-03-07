export interface ProductAnalysis {
  name: string
  brand?: string
  logo?: string
  description: string
  features: string[]
  pricing?: { original?: string; promo?: string; currency?: string }
  mainImage?: string
  gallery?: string[]
  keywords: string[]
  environment: string
  tone: string
  sources?: { uri: string; title: string }[]
}

export type GenerationType = 'image' | 'video'
export type GenerationStatus = 'pending' | 'analyzing' | 'generating' | 'rendering' | 'completed' | 'failed'
export type VariationStatus = 'pending' | 'processing' | 'success' | 'error'
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
export type VideoAspectRatio = '16:9' | '9:16'
export type VideoDuration = '8s' | '15s'

export interface Generation {
  id: string
  userId: string
  orgId: string
  type: GenerationType
  status: GenerationStatus
  productUrl?: string
  productAnalysis?: ProductAnalysis
  input: {
    imageBase64?: string
    url?: string
    instructions?: string
    count?: number
    aspectRatio?: AspectRatio | VideoAspectRatio
    cameraMovement?: string
    duration?: VideoDuration
  }
  creditsCost: number
  createdAt: string
  updatedAt: string
  results: GenerationResult[]
}

export interface GenerationResult {
  id: string
  prompt: string
  status: VariationStatus
  url?: string
  storagePath?: string
  error?: string
  createdAt: string
}

export interface Asset {
  id: string
  userId: string
  orgId: string
  type: 'image' | 'video'
  generationId: string
  url: string
  storagePath: string
  thumbnailUrl?: string
  metadata: {
    prompt: string
    productName?: string
    aspectRatio?: string
    duration?: string
  }
  tags: string[]
  isFavorite: boolean
  createdAt: string
}

export interface CreditTransaction {
  id: string
  orgId: string
  amount: number
  type: 'deduct' | 'refund' | 'purchase'
  reason: string
  generationId?: string
  createdAt: string
}

export interface CreditBalance {
  balance: number
  totalPurchased: number
  totalConsumed: number
}
