'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ hd: 'worker.ar' })
    const result = await signInWithPopup(auth, provider)

    if (!result.user.email?.endsWith('@worker.ar')) {
      await signOut(auth)
      throw new Error('Only @worker.ar accounts are allowed')
    }

    const idToken = await result.user.getIdToken()
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken, uid: result.user.uid }),
    })

    return result.user
  }

  const logout = async () => {
    await signOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.push('/login')
  }

  return { user, loading, signInWithGoogle, logout }
}
