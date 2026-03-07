'use client'

import { useState } from 'react'
import { Download, Loader2, AlertCircle, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GenerationResult } from '@/types'

interface VariationGridProps {
  results: GenerationResult[]
}

export function VariationGrid({ results }: VariationGridProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  const handleDownload = async (url: string, index: number) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `variation-${index + 1}.png`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, i) => (
          <div
            key={result.id}
            className="bg-bg-surface border border-border rounded-xl overflow-hidden group"
          >
            {result.status === 'pending' && (
              <div className="aspect-[3/4] flex items-center justify-center bg-bg-elevated">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-bg-surface mx-auto mb-2 flex items-center justify-center">
                    <span className="text-text-muted text-xs font-medium">{i + 1}</span>
                  </div>
                  <p className="text-text-muted text-xs">En cola</p>
                </div>
              </div>
            )}

            {result.status === 'processing' && (
              <div className="aspect-[3/4] flex items-center justify-center bg-bg-elevated">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto mb-2" />
                  <p className="text-text-secondary text-xs">Renderizando...</p>
                </div>
              </div>
            )}

            {result.status === 'error' && (
              <div className="aspect-[3/4] flex items-center justify-center bg-error/5">
                <div className="text-center px-4">
                  <AlertCircle className="w-6 h-6 text-error mx-auto mb-2" />
                  <p className="text-error text-xs">{result.error || 'Error al generar'}</p>
                </div>
              </div>
            )}

            {result.status === 'success' && result.url && (
              <div className="relative">
                <img
                  src={result.url}
                  alt={`Variacion ${i + 1}`}
                  className="aspect-[3/4] w-full object-cover cursor-pointer"
                  onClick={() => setLightboxUrl(result.url!)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLightboxUrl(result.url!)}
                      className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDownload(result.url!, i)}
                      className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={lightboxUrl}
            alt="Preview"
            className="max-h-full max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
