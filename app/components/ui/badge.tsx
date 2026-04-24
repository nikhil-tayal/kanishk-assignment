import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-zinc-900 text-zinc-50',
        secondary: 'border-transparent bg-zinc-100 text-zinc-900',
        destructive: 'border-transparent bg-red-500 text-white',
        outline: 'text-zinc-950',
        blue: 'border-transparent bg-blue-100 text-blue-700',
        green: 'border-transparent bg-green-100 text-green-700',
        purple: 'border-transparent bg-purple-100 text-purple-700',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
