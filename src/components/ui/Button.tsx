import React from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  as?: React.ElementType
}

export default function Button({ variant = 'primary', size = 'md', className, children, as: Component = 'button', ...rest }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2'
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:bg-hover-blue shadow-sm',
    secondary: 'bg-card text-text border border-border hover:border-primary',
    ghost: 'bg-transparent text-text hover:bg-bg',
    link: 'bg-transparent text-primary underline-offset-4 hover:underline',
  }

  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  }

  return (
    <Component className={clsx(base, variants[variant], sizes[size], className)} {...(rest as any)}>
      {children}
    </Component>
  )
}
