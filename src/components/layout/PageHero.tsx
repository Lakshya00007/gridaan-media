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
        'relative overflow-hidden bg-mesh-hero border-b border-[#1E293B]/40',
        compact ? 'py-10 sm:py-12' : 'py-12 sm:py-16 md:py-20',
        className
      )}
    >
      <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" aria-hidden />
      <div
        className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[#14B8A6]/10 blur-[120px] pointer-events-none"
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-section font-bold text-[#F8FAFC] tracking-tight">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#64748B] leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}
