'use client'

import { Download, Play, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GenerationResult } from '@/types'

interface VideoResultProps {
  result: GenerationResult
  metadata?: {
    cameraMovement?: string
    duration?: string
    aspectRatio?: string
  }
}

export function VideoResult({ result, metadata }: VideoResultProps) {
  const handleDownload = async () => {
    if (!result.url) return
    try {
      const res = await fetch(result.url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `video-${result.id}.mp4`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      window.open(result.url, '_blank')
    }
  }

  if (result.status === 'pending') {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-8 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center">
          <Play className="w-5 h-5 text-text-muted" />
        </div>
        <p className="text-text-muted text-sm">En cola...</p>
      </div>
    )
  }

  if (result.status === 'processing') {
    return (
      <div className="bg-bg-surface border border-border rounded-xl p-8 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-text-secondary text-sm">Renderizando video...</p>
        <p className="text-text-muted text-xs">Esto puede tomar 1-3 minutos</p>
      </div>
    )
  }

  if (result.status === 'error') {
    return (
      <div className="bg-error/5 border border-error/20 rounded-xl p-8 flex flex-col items-center gap-3">
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-error text-sm">{result.error || 'Error al generar el video'}</p>
      </div>
    )
  }

  return (
    <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
      <div className="relative">
        <video
          src={result.url}
          controls
          className="w-full aspect-video bg-black"
          preload="metadata"
        />
      </div>
      <div className="p-4 space-y-3">
        {metadata && (
          <div className="flex gap-2 flex-wrap">
            {metadata.cameraMovement && (
              <span className="px-2 py-0.5 bg-accent/10 text-accent text-[11px] rounded-md font-medium">
                {metadata.cameraMovement}
              </span>
            )}
            {metadata.duration && (
              <span className="px-2 py-0.5 bg-bg-elevated text-text-secondary text-[11px] rounded-md font-medium">
                {metadata.duration}
              </span>
            )}
            {metadata.aspectRatio && (
              <span className="px-2 py-0.5 bg-bg-elevated text-text-secondary text-[11px] rounded-md font-medium">
                {metadata.aspectRatio}
              </span>
            )}
          </div>
        )}
        <Button variant="secondary" onClick={handleDownload} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Descargar video
        </Button>
      </div>
    </div>
  )
}
