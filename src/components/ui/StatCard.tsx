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
        'rounded-2xl border border-white/10 bg-[#0B1224]/90 p-4 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-[#2563EB]/30',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-white tabular-nums">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-[#14B8A6]">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB]/15 text-[#2563EB]">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  )
}
