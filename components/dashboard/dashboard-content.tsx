'use client'

import { Image, Video, FolderOpen, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const stats = [
  { label: 'Images Generated', value: '0', icon: Image, color: 'text-accent' },
  { label: 'Videos Generated', value: '0', icon: Video, color: 'text-accent' },
  { label: 'Assets Saved', value: '0', icon: FolderOpen, color: 'text-success' },
  { label: 'Credits Used', value: '0', icon: TrendingUp, color: 'text-warning' },
]

const quickActions = [
  { href: '/images', label: 'Generate Images', description: 'Create product photo variations', icon: Image },
  { href: '/videos', label: 'Generate Video', description: 'Create AI product videos', icon: Video },
]

export function DashboardContent() {
  return (
    <div className="flex flex-col gap-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-surface border border-border-subtle rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-bg-elevated rounded-lg flex items-center justify-center shrink-0">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-heading font-semibold text-text-primary">{stat.value}</p>
              <p className="text-text-muted text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-bg-surface border border-border-subtle rounded-xl p-6 flex items-center gap-4 hover:border-accent/30 hover:bg-accent/5 transition group"
            >
              <div className="w-12 h-12 bg-accent-muted rounded-xl flex items-center justify-center shrink-0">
                <action.icon className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-text-primary font-medium">{action.label}</p>
                <p className="text-text-muted text-sm">{action.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent transition" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Generations - Empty State */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">Recent Generations</h2>
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <Sparkles className="w-10 h-10 text-text-muted mb-3" />
          <p className="text-text-secondary font-medium">No generations yet</p>
          <p className="text-text-muted text-sm mt-1">Start by generating your first product image or video</p>
          <Link href="/images" className="mt-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}
