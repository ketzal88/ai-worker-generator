'use client'

import { Check, Loader2, AlertCircle, Search, Sparkles, Image } from 'lucide-react'
import type { GenerationStatus } from '@/types'

interface GenerationProgressProps {
  status: GenerationStatus
  type?: 'image' | 'video'
}

const steps = [
  { key: 'analyzing', label: 'Analizando producto', icon: Search },
  { key: 'generating', label: 'Generando prompts', icon: Sparkles },
  { key: 'rendering', label: 'Renderizando variaciones', icon: Image },
]

export function GenerationProgress({ status, type = 'image' }: GenerationProgressProps) {
  const currentIndex = steps.findIndex((s) => s.key === status)
  const isCompleted = status === 'completed'
  const isFailed = status === 'failed'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {isFailed ? (
          <AlertCircle className="w-5 h-5 text-error" />
        ) : isCompleted ? (
          <Check className="w-5 h-5 text-success" />
        ) : (
          <Loader2 className="w-5 h-5 text-accent animate-spin" />
        )}
        <h3 className="text-text-primary font-medium text-sm">
          {isFailed
            ? 'Error en la generacion'
            : isCompleted
            ? 'Generacion completada'
            : 'Generando...'}
        </h3>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = step.key === status
          const isDone = isCompleted || currentIndex > i

          return (
            <div key={step.key} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isDone
                    ? 'bg-success/20 text-success'
                    : isActive
                    ? 'bg-accent/20 text-accent'
                    : 'bg-bg-elevated text-text-muted'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-sm ${
                  isDone
                    ? 'text-success'
                    : isActive
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
