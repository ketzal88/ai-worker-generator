'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { VideoGeneratorForm } from '@/components/generators/video-generator-form'
import { GenerationProgress } from '@/components/generators/generation-progress'
import { VideoResult } from '@/components/generators/video-result'
import { useGeneration } from '@/hooks/useGeneration'
import { useAuth } from '@/hooks/useAuth'
import type { VideoAspectRatio, VideoDuration } from '@/types'

export default function VideosPage() {
  const { user } = useAuth()
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { generation } = useGeneration(generationId)
  const [formData, setFormData] = useState<{
    cameraMovement: string
    duration: VideoDuration
    aspectRatio: VideoAspectRatio
  } | null>(null)

  const handleSubmit = async (data: {
    imageBase64: string
    url?: string
    instructions?: string
    cameraMovement: string
    aspectRatio: VideoAspectRatio
    duration: VideoDuration
  }) => {
    if (!user) return
    setSubmitting(true)
    setFormData({
      cameraMovement: data.cameraMovement,
      duration: data.duration,
      aspectRatio: data.aspectRatio,
    })
    try {
      const res = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error al crear generacion')
      }
      const { generationId: id } = await res.json()
      setGenerationId(id)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setGenerationId(null)
    setFormData(null)
  }

  return (
    <div className="space-y-8">
      <Header title="Generador de Video" subtitle="Crea videos profesionales de producto con movimientos de camara" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-text-primary font-semibold text-base mb-5">Configuracion</h2>
          <VideoGeneratorForm
            onSubmit={handleSubmit}
            loading={submitting || (!!generation && generation.status !== 'completed' && generation.status !== 'failed')}
          />
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {generation && (
            <>
              <div className="bg-bg-surface border border-border rounded-2xl p-6">
                <GenerationProgress status={generation.status} type="video" />
              </div>

              {generation.results?.[0] && (
                <VideoResult
                  result={generation.results[0]}
                  metadata={formData ? {
                    cameraMovement: formData.cameraMovement,
                    duration: formData.duration,
                    aspectRatio: formData.aspectRatio,
                  } : undefined}
                />
              )}

              {(generation.status === 'completed' || generation.status === 'failed') && (
                <button onClick={handleReset} className="text-accent text-sm hover:underline">
                  Generar nuevo video
                </button>
              )}
            </>
          )}

          {!generation && (
            <div className="bg-bg-surface border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="text-text-primary font-medium mb-1">Crea un video profesional</h3>
              <p className="text-text-muted text-sm max-w-xs">
                Sube una foto y elige el movimiento de camara para generar un video de producto con IA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
