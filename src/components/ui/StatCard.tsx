import type { LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  className?: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-white p-4 shadow-sm transition hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-text tabular-nums">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-primary">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  )
}
