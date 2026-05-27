import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass'
}

export default function Card({ variant = 'default', className, children, ...rest }: CardProps) {
  const base = 'rounded-3xl border border-border bg-card overflow-hidden'
  const variants: Record<string, string> = {
    default: 'shadow-xs',
    elevated: 'shadow-md',
    glass: 'bg-card/70 backdrop-blur-md border-border/60 shadow-sm',
  }

  return (
    <div className={`${base} ${variants[variant] || ''} ${className || ''}`} {...rest}>
      {children}
    </div>
  )
}
