'use client'

import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from './useAuth'

export function useCredits() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setBalance(0)
      setLoading(false)
      return
    }

    // For now, use a default org ID. Later this comes from user doc
    const orgId = user.uid
    const unsubscribe = onSnapshot(
      doc(db, 'credits', orgId),
      (snap) => {
        if (snap.exists()) {
          setBalance(snap.data().balance || 0)
        } else {
          setBalance(2500) // Default credits for new users
        }
        setLoading(false)
      },
      () => {
        setBalance(2500)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [user])

  return { balance, loading }
}
