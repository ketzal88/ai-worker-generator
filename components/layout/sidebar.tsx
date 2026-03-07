'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Image, Video, FolderOpen, Clock, Settings, Zap, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/images', label: 'Image Generator', icon: Image },
  { href: '/videos', label: 'Video Generator', icon: Video },
  { href: '/library', label: 'Asset Library', icon: FolderOpen },
  { href: '/history', label: 'History', icon: Clock },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 h-screen bg-bg-surface border-r border-border-subtle flex flex-col shrink-0">
      <div className="px-4 py-6">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-text-primary">Worker AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive(item.href)
                ? 'bg-accent-muted text-accent font-medium'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            )}
          >
            <item.icon className={cn('w-5 h-5', isActive(item.href) ? 'text-accent' : 'text-text-muted')} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border-subtle">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <Settings className="w-5 h-5 text-text-muted" />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-error hover:bg-error/5 transition-colors"
        >
          <LogOut className="w-5 h-5 text-text-muted" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
