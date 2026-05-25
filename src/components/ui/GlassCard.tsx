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
        'rounded-2xl border border-white/10 bg-[#0B1224]/80 shadow-xl shadow-black/20 backdrop-blur-xl',
        className
      )}
    >
      {children}
    </Tag>
  )
}
