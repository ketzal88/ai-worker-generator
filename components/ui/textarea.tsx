'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-text-secondary text-[13px] font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary',
            'placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
            'transition-colors resize-none min-h-[80px]',
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
Textarea.displayName = 'Textarea'
