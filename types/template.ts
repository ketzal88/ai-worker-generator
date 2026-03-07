export interface AdTemplateField {
  id: string
  label: string
  placeholder?: string
  type: 'text' | 'textarea' | 'select'
  options?: string[]
}

export interface AdTemplate {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  basePrompt: string
  fields: AdTemplateField[]
  requiredImages: number
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '4:5'
  category?: string
}
