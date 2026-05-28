import { cn } from '../../utils/cn'

export default function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-[#f5f5f2] border border-border',
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-black/5 to-transparent" />
    </div>
  )
}
