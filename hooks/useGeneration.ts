'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Generation } from '@/types'

export function useGeneration(generationId: string | null) {
  const [generation, setGeneration] = useState<Generation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const poll = useCallback(async () => {
    if (!generationId) return
    try {
      const res = await fetch(`/api/generate/status/${generationId}`)
      if (!res.ok) throw new Error('Failed to fetch status')
      const data = await res.json()
      setGeneration(data)

      if (data.status === 'completed' || data.status === 'failed') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    } catch (err: any) {
      setError(err.message)
    }
  }, [generationId])

  useEffect(() => {
    if (!generationId) {
      setGeneration(null)
      return
    }

    setLoading(true)
    setError(null)
    poll().then(() => setLoading(false))

    intervalRef.current = setInterval(poll, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [generationId, poll])

  return { generation, loading, error }
}

export function useAnalyzeProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Analysis failed')
      }
      return await res.json()
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { analyze, loading, error }
}
