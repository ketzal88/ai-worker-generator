import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-accent hover:bg-accent-hover text-white': variant === 'primary',
            'bg-bg-elevated hover:bg-border border border-border text-text-secondary hover:text-text-primary': variant === 'secondary',
            'bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary': variant === 'ghost',
            'bg-error/10 hover:bg-error/20 text-error border border-error/20': variant === 'danger',
          },
          {
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-4 py-2.5': size === 'md',
            'text-[15px] px-5 py-3.5': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
