'use client'

import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Image, Video, Star, Download, Heart, Filter, Search, X, ZoomIn } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { Asset } from '@/types'

type FilterType = 'all' | 'image' | 'video' | 'favorites'

export default function LibraryPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [lightbox, setLightbox] = useState<Asset | null>(null)

  const fetchAssets = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter === 'image' || filter === 'video') params.set('type', filter)
      if (filter === 'favorites') params.set('favorites', 'true')
      const res = await fetch(`/api/assets?${params}`)
      if (res.ok) {
        const data = await res.json()
        setAssets(data.assets || [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchAssets()
  }, [fetchAssets])

  const toggleFavorite = async (assetId: string) => {
    try {
      await fetch('/api/assets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId }),
      })
      setAssets((prev) =>
        prev.map((a) => (a.id === assetId ? { ...a, isFavorite: !a.isFavorite } : a))
      )
    } catch {
      // silent
    }
  }

  const handleDownload = async (asset: Asset) => {
    try {
      const res = await fetch(asset.url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${asset.metadata.productName || 'asset'}-${asset.id}.${asset.type === 'video' ? 'mp4' : 'png'}`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      window.open(asset.url, '_blank')
    }
  }

  const filtered = assets.filter((a) => {
    if (search) {
      const s = search.toLowerCase()
      return (
        a.metadata.productName?.toLowerCase().includes(s) ||
        a.metadata.prompt?.toLowerCase().includes(s) ||
        a.tags.some((t) => t.toLowerCase().includes(s))
      )
    }
    return true
  })

  const filters: { key: FilterType; label: string; icon: any }[] = [
    { key: 'all', label: 'Todo', icon: Filter },
    { key: 'image', label: 'Imagenes', icon: Image },
    { key: 'video', label: 'Videos', icon: Video },
    { key: 'favorites', label: 'Favoritos', icon: Star },
  ]

  return (
    <div className="space-y-6">
      <Header title="Biblioteca" subtitle="Todos tus assets generados en un solo lugar" />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 bg-bg-surface border border-border rounded-lg p-1">
          {filters.map((f) => {
            const Icon = f.icon
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === f.key
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
              </button>
            )
          })}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-bg-surface border border-border rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-text-primary font-medium mb-1">No hay assets</h3>
          <p className="text-text-muted text-sm">
            {search ? 'No se encontraron resultados' : 'Genera imagenes o videos para verlos aqui'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              className="bg-bg-surface border border-border rounded-xl overflow-hidden group relative"
            >
              {asset.type === 'image' ? (
                <img
                  src={asset.url}
                  alt={asset.metadata.productName || 'Asset'}
                  className="aspect-[3/4] w-full object-cover"
                />
              ) : (
                <div className="aspect-[3/4] bg-black flex items-center justify-center relative">
                  <video src={asset.url} className="w-full h-full object-cover" preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end opacity-0 group-hover:opacity-100">
                <div className="p-3 w-full flex justify-between items-end">
                  <div>
                    {asset.metadata.productName && (
                      <p className="text-white text-xs font-medium truncate max-w-[120px]">
                        {asset.metadata.productName}
                      </p>
                    )}
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {asset.metadata.aspectRatio}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => toggleFavorite(asset.id)}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${asset.isFavorite ? 'text-error fill-error' : 'text-white'}`}
                      />
                    </button>
                    <button
                      onClick={() => asset.type === 'image' ? setLightbox(asset) : window.open(asset.url, '_blank')}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <ZoomIn className="w-3.5 h-3.5 text-white" />
                    </button>
                    <button
                      onClick={() => handleDownload(asset)}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.metadata.productName || 'Asset'}
            className="max-h-full max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
