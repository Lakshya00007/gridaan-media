import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

export default function Skeleton({ className, width = '100%', height = '1rem' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-700/80',
        'animate-pulse',
        className
      )}
      style={{ width, height }}
    />
  )
}
