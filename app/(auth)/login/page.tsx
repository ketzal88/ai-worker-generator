'use client'

import { useState } from 'react'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ hd: 'worker.ar' })

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Verify domain
      if (!user.email?.endsWith('@worker.ar')) {
        await auth.signOut()
        throw new Error('Only @worker.ar accounts are allowed')
      }

      // Get token and create session
      const idToken = await user.getIdToken()
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, uid: user.uid }),
      })

      if (!res.ok) throw new Error('Failed to create session')

      router.push('/')
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User cancelled, don't show error
      } else {
        setError(err.message || 'Error signing in')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#18181B] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-6">
        <Image
          src="/img/logo-h-worker-brain.png"
          alt="Worker Brain"
          width={180}
          height={40}
          className="h-8 w-auto"
          priority
        />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0F0F10] border border-[#27272A] p-6">
          <div className="flex flex-col items-center gap-4 mb-8">
            <Image
              src="/img/logo-h-worker-brain.png"
              alt="Worker Brain"
              width={200}
              height={96}
              className="h-24 w-auto"
            />
            <div className="text-center">
              <h1 className="font-heading text-2xl font-bold text-[#FAFAFA] uppercase tracking-[1px]">
                AI Worker Generator
              </h1>
              <p className="text-[#71717A] text-sm uppercase tracking-[1px] mt-1">
                Sign in to your account
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#27272A]/20 border border-[#27272A] hover:border-[#FACC15] px-4 py-3 text-sm font-bold text-[#FAFAFA] uppercase tracking-[1px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-[#52525B] text-[10px] uppercase tracking-[1px] text-center mt-6">
            Only @worker.ar accounts are allowed
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center gap-6 py-4 text-[#52525B] text-[10px] uppercase tracking-[1px]">
        <span>v2.0.0</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
          Operational
        </span>
        <span>Internal Use Only</span>
      </footer>
    </div>
  )
}
