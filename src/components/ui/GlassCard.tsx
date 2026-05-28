import { type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface GlassCardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}

export default function GlassCard({
  children,
  className,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-border bg-white shadow-sm',
        className
      )}
    >
      {children}
    </Tag>
  )
}
