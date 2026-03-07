'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { ImageGeneratorForm } from '@/components/generators/image-generator-form'
import { GenerationProgress } from '@/components/generators/generation-progress'
import { VariationGrid } from '@/components/generators/variation-grid'
import { useGeneration, useAnalyzeProduct } from '@/hooks/useGeneration'
import { useAuth } from '@/hooks/useAuth'
import type { AspectRatio, ProductAnalysis } from '@/types'

export default function ImagesPage() {
  const { user } = useAuth()
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { generation } = useGeneration(generationId)
  const { analyze, loading: analyzingUrl } = useAnalyzeProduct()

  const handleSubmit = async (data: {
    imageBase64: string
    url?: string
    instructions?: string
    count: number
    aspectRatio: AspectRatio
    productAnalysis?: ProductAnalysis
  }) => {
    if (!user) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/generate/image', {
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
  }

  return (
    <div className="space-y-8">
      <Header title="Generador de Imagenes" subtitle="Crea variaciones profesionales de tu producto con IA" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-text-primary font-semibold text-base mb-5">Configuracion</h2>
          <ImageGeneratorForm
            onSubmit={handleSubmit}
            onAnalyze={analyze}
            loading={submitting || (!!generation && generation.status !== 'completed' && generation.status !== 'failed')}
            analyzingUrl={analyzingUrl}
          />
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
          {generation && (
            <>
              <div className="bg-bg-surface border border-border rounded-2xl p-6">
                <GenerationProgress status={generation.status} type="image" />
              </div>

              {generation.results && generation.results.length > 0 && (
                <VariationGrid results={generation.results} />
              )}

              {(generation.status === 'completed' || generation.status === 'failed') && (
                <button
                  onClick={handleReset}
                  className="text-accent text-sm hover:underline"
                >
                  Generar nuevas variaciones
                </button>
              )}
            </>
          )}

          {!generation && (
            <div className="bg-bg-surface border border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <h3 className="text-text-primary font-medium mb-1">Listo para generar</h3>
              <p className="text-text-muted text-sm max-w-xs">
                Sube una foto de tu producto y configura las opciones para generar variaciones profesionales
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
