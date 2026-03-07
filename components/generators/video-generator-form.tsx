'use client'

import { useState, useRef, type ChangeEvent } from 'react'
import { Upload, Video, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cameraMovements } from '@/data/camera-movements'
import type { VideoAspectRatio, VideoDuration } from '@/types'

interface VideoGeneratorFormProps {
  onSubmit: (data: {
    imageBase64: string
    url?: string
    instructions?: string
    cameraMovement: string
    aspectRatio: VideoAspectRatio
    duration: VideoDuration
  }) => void
  loading?: boolean
}

export function VideoGeneratorForm({ onSubmit, loading }: VideoGeneratorFormProps) {
  const [imageBase64, setImageBase64] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [url, setUrl] = useState('')
  const [instructions, setInstructions] = useState('')
  const [cameraMovement, setCameraMovement] = useState('orbit-left')
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9')
  const [duration, setDuration] = useState<VideoDuration>('8s')
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

  const selectedMovement = cameraMovements.find((m) => m.id === cameraMovement)

  const handleSubmit = () => {
    if (!imageBase64) return
    onSubmit({
      imageBase64,
      url: url || undefined,
      instructions: instructions || undefined,
      cameraMovement: selectedMovement?.prompt || 'Orbit left',
      aspectRatio,
      duration,
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
      <Input
        label="URL del producto (opcional)"
        placeholder="https://tienda.com/producto..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {/* Instructions */}
      <Textarea
        label="Instrucciones (opcional)"
        placeholder="Ej: Mostrar el producto en una mesa de madera con luz natural..."
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={3}
      />

      {/* Camera Movement */}
      <div className="space-y-2">
        <label className="text-text-secondary text-[13px] font-medium">Movimiento de camara</label>
        <div className="grid grid-cols-2 gap-2">
          {cameraMovements.map((m) => (
            <button
              key={m.id}
              onClick={() => setCameraMovement(m.id)}
              className={`px-3 py-2 rounded-lg text-left border transition-colors ${
                cameraMovement === m.id
                  ? 'bg-accent/10 border-accent text-text-primary'
                  : 'bg-bg-elevated border-border text-text-secondary hover:border-accent/50'
              }`}
            >
              <p className="text-xs font-medium">{m.label}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{m.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-text-secondary text-[13px] font-medium">Formato</label>
          <div className="flex gap-2">
            {(['16:9', '9:16'] as VideoAspectRatio[]).map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  aspectRatio === r
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-elevated border-border text-text-secondary hover:border-accent/50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-text-secondary text-[13px] font-medium">Duracion</label>
          <div className="flex gap-2">
            {(['8s', '15s'] as VideoDuration[]).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  duration === d
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-elevated border-border text-text-secondary hover:border-accent/50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-text-muted text-xs">Costo: 5 creditos por video</p>

      {/* Submit */}
      <Button onClick={handleSubmit} disabled={!imageBase64 || loading} className="w-full">
        <Video className="w-4 h-4 mr-2" />
        {loading ? 'Generando video...' : 'Generar video'}
      </Button>
    </div>
  )
}
