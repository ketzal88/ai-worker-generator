'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { useAuth } from '@/hooks/useAuth'
import { useCredits } from '@/hooks/useCredits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, CreditCard, Key, LogOut, Coins } from 'lucide-react'
import { formatCredits } from '@/lib/utils'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { balance } = useCredits()

  return (
    <div className="space-y-8">
      <Header title="Configuracion" subtitle="Administra tu cuenta y preferencias" />

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-accent" />
            <h2 className="text-text-primary font-semibold text-base">Perfil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-text-secondary text-[13px] font-medium">Email</label>
              <p className="text-text-primary text-sm mt-1">{user?.email || '-'}</p>
            </div>
            <div>
              <label className="text-text-secondary text-[13px] font-medium">UID</label>
              <p className="text-text-muted text-xs mt-1 font-mono">{user?.uid || '-'}</p>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Coins className="w-5 h-5 text-warning" />
            <h2 className="text-text-primary font-semibold text-base">Creditos</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-elevated rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-text-primary">{formatCredits(balance)}</p>
              <p className="text-text-muted text-xs mt-1">Disponibles</p>
            </div>
            <div className="bg-bg-elevated rounded-xl p-4 text-center">
              <p className="text-text-secondary text-sm">0.5</p>
              <p className="text-text-muted text-xs mt-1">Por imagen</p>
            </div>
            <div className="bg-bg-elevated rounded-xl p-4 text-center">
              <p className="text-text-secondary text-sm">5.0</p>
              <p className="text-text-muted text-xs mt-1">Por video</p>
            </div>
          </div>
        </div>

        {/* API Config */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Key className="w-5 h-5 text-success" />
            <h2 className="text-text-primary font-semibold text-base">Configuracion API</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-text-primary text-sm">Gemini API</p>
                <p className="text-text-muted text-xs">Imagenes y analisis</p>
              </div>
              <span className="px-2.5 py-0.5 bg-success/10 text-success text-[11px] rounded-full font-medium">
                Server-side
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-text-primary text-sm">Veo 3.1</p>
                <p className="text-text-muted text-xs">Generacion de video</p>
              </div>
              <span className="px-2.5 py-0.5 bg-success/10 text-success text-[11px] rounded-full font-medium">
                Server-side
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-text-primary text-sm">Firebase Storage</p>
                <p className="text-text-muted text-xs">Almacenamiento de assets</p>
              </div>
              <span className="px-2.5 py-0.5 bg-success/10 text-success text-[11px] rounded-full font-medium">
                Configurado
              </span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="danger" onClick={logout} className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesion
        </Button>
      </div>
    </div>
  )
}
