'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-text-secondary text-[13px] font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
            'transition-colors',
            error && 'border-error focus:ring-error/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-error text-xs">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
