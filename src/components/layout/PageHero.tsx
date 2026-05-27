import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface PageHeroProps {
  title: string
  description?: string
  children?: ReactNode
  className?: string
  compact?: boolean
}

export default function PageHero({
  title,
  description,
  children,
  className,
  compact,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-mesh-hero border-b border-border',
        compact ? 'py-10 sm:py-12' : 'py-12 sm:py-16 md:py-20',
        className
      )}
    >
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" aria-hidden />
      <div
        className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-primary/8 blur-[100px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text tracking-tight">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
