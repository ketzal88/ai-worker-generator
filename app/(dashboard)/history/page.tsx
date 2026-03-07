'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Image, Video, Clock, CheckCircle, XCircle, Loader2, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Generation } from '@/types'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendiente', color: 'text-text-muted', icon: Clock },
  analyzing: { label: 'Analizando', color: 'text-warning', icon: Loader2 },
  generating: { label: 'Generando', color: 'text-accent', icon: Loader2 },
  rendering: { label: 'Renderizando', color: 'text-accent', icon: Loader2 },
  completed: { label: 'Completado', color: 'text-success', icon: CheckCircle },
  failed: { label: 'Error', color: 'text-error', icon: XCircle },
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history')
        if (res.ok) {
          const data = await res.json()
          setGenerations(data.generations || [])
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className="space-y-6">
      <Header title="Historial" subtitle="Registro de todas tus generaciones" />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-bg-surface border border-border rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : generations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-text-primary font-medium mb-1">Sin historial</h3>
          <p className="text-text-muted text-sm">Tus generaciones apareceran aqui</p>
        </div>
      ) : (
        <div className="space-y-2">
          {generations.map((gen) => {
            const status = statusConfig[gen.status] || statusConfig.pending
            const StatusIcon = status.icon
            const isActive = gen.status === 'analyzing' || gen.status === 'generating' || gen.status === 'rendering'
            const successCount = gen.results?.filter((r) => r.status === 'success').length || 0
            const totalCount = gen.results?.length || 0

            return (
              <div
                key={gen.id}
                className="bg-bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-accent/30 transition-colors"
              >
                {/* Type icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  gen.type === 'video' ? 'bg-purple-500/10' : 'bg-accent/10'
                }`}>
                  {gen.type === 'video' ? (
                    <Video className="w-5 h-5 text-purple-400" />
                  ) : (
                    <Image className="w-5 h-5 text-accent" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-text-primary text-sm font-medium truncate">
                      {gen.productAnalysis?.name || (gen.type === 'video' ? 'Video' : 'Imagenes')}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.color} bg-current/10`}>
                      <StatusIcon className={`w-3 h-3 ${isActive ? 'animate-spin' : ''}`} />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-text-muted text-xs">
                    <span>{formatDate(gen.createdAt)}</span>
                    {gen.status === 'completed' && (
                      <span>{successCount}/{totalCount} exitosas</span>
                    )}
                    <span>{gen.creditsCost} creditos</span>
                  </div>
                </div>

                {/* Preview thumbnails */}
                {gen.results && gen.results.some((r) => r.url) && (
                  <div className="flex -space-x-2 shrink-0">
                    {gen.results
                      .filter((r) => r.url)
                      .slice(0, 3)
                      .map((r) => (
                        <div key={r.id} className="w-10 h-10 rounded-lg border-2 border-bg-surface overflow-hidden">
                          {gen.type === 'video' ? (
                            <video src={r.url} className="w-full h-full object-cover" preload="metadata" />
                          ) : (
                            <img src={r.url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                  </div>
                )}

                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
