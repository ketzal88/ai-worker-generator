'use client'

import { Coins } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCredits } from '@/hooks/useCredits'
import { formatCredits } from '@/lib/utils'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth()
  const { balance } = useCredits()

  const initials = user?.email?.slice(0, 2).toUpperCase() || 'AI'

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="font-heading text-[28px] font-semibold text-text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-bg-elevated border border-border rounded-lg px-4 py-2">
          <Coins className="w-4 h-4 text-warning" />
          <span className="text-text-primary text-[13px] font-medium">{formatCredits(balance)} credits</span>
        </div>
        <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
          <span className="text-white text-[13px] font-semibold">{initials}</span>
        </div>
      </div>
    </header>
  )
}
