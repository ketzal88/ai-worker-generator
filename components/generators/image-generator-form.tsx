'use client'

import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, Link, Sparkles, ImagePlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { AspectRatio, ProductAnalysis } from '@/types'

interface ImageGeneratorFormProps {
  onSubmit: (data: {
    imageBase64: string
    url?: string
    instructions?: string
    count: number
    aspectRatio: AspectRatio
    productAnalysis?: ProductAnalysis
  }) => void
  onAnalyze?: (url: string) => Promise<ProductAnalysis | null>
  loading?: boolean
  analyzingUrl?: boolean
}

const ratios: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1' },
  { value: '3:4', label: '3:4' },
  { value: '4:3', label: '4:3' },
  { value: '9:16', label: '9:16' },
  { value: '16:9', label: '16:9' },
]

const counts = [1, 2, 3, 4, 5, 6]

export function ImageGeneratorForm({ onSubmit, onAnalyze, loading, analyzingUrl }: ImageGeneratorFormProps) {
  const [imageBase64, setImageBase64] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [url, setUrl] = useState('')
  const [instructions, setInstructions] = useState('')
  const [count, setCount] = useState(4)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4')
  const [productAnalysis, setProductAnalysis] = useState<ProductAnalysis | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImageBase64(result)
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!url || !onAnalyze) return
    const analysis = await onAnalyze(url)
    if (analysis) setProductAnalysis(analysis)
  }

  const handleSubmit = () => {
    if (!imageBase64) return
    onSubmit({
      imageBase64,
      url: url || undefined,
      instructions: instructions || undefined,
      count,
      aspectRatio,
      productAnalysis: productAnalysis || undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-text-secondary text-[13px] font-medium">Foto del producto *</label>
        {imagePreview ? (
          <div className="relative w-full max-w-xs">
            <img src={imagePreview} alt="Preview" className="rounded-lg border border-border max-h-48 object-contain" />
            <button
              onClick={() => { setImageBase64(''); setImagePreview('') }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-bg-elevated border border-border rounded-full flex items-center justify-center hover:bg-error/20 transition-colors"
            >
              <X className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-accent/50 hover:bg-accent/5 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-accent" />
            </div>
            <div className="text-center">
              <p className="text-text-primary text-sm font-medium">Sube una foto del producto</p>
              <p className="text-text-muted text-xs mt-1">PNG, JPG o WebP hasta 10MB</p>
            </div>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {/* Product URL */}
      <div className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="URL del producto (opcional)"
              placeholder="https://tienda.com/producto..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          {url && onAnalyze && (
            <Button variant="secondary" onClick={handleAnalyze} disabled={analyzingUrl} className="shrink-0">
              <Link className="w-4 h-4 mr-1.5" />
              {analyzingUrl ? 'Analizando...' : 'Analizar'}
            </Button>
          )}
        </div>
        {productAnalysis && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-3">
            <p className="text-success text-xs font-medium">Producto analizado: {productAnalysis.name}</p>
            {productAnalysis.brand && <p className="text-text-muted text-xs mt-0.5">Marca: {productAnalysis.brand}</p>}
          </div>
        )}
      </div>

      {/* Instructions */}
      <Textarea
        label="Instrucciones creativas (opcional)"
        placeholder="Ej: Estilo minimalista, fondo blanco, iluminacion suave..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={3}
      />

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-text-secondary text-[13px] font-medium">Formato</label>
        <div className="flex gap-2">
          {ratios.map((r) => (
            <button
              key={r.value}
              onClick={() => setAspectRatio(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                aspectRatio === r.value
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-elevated border-border text-text-secondary hover:border-accent/50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="space-y-2">
        <label className="text-text-secondary text-[13px] font-medium">Variaciones</label>
        <div className="flex gap-2">
          {counts.map((c) => (
            <button
              key={c}
              onClick={() => setCount(c)}
              className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${
                count === c
                  ? 'bg-accent text-white border-accent'
                  : 'bg-bg-elevated border-border text-text-secondary hover:border-accent/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-text-muted text-xs">Costo: {(count * 0.5).toFixed(1)} creditos</p>
      </div>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={!imageBase64 || loading} className="w-full">
        <Sparkles className="w-4 h-4 mr-2" />
        {loading ? 'Generando...' : `Generar ${count} variacion${count > 1 ? 'es' : ''}`}
      </Button>
    </div>
  )
}
