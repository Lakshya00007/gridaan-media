import React, { useEffect, useState } from 'react'

// Lightweight motion presets that dynamically load `framer-motion` only when needed.
// If `framer-motion` is not yet loaded, we render non-animated fallbacks to keep
// the initial bundle small and avoid preloading heavy motion assets.

export const containerStagger = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
}

export const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: 'easeOut' } },
}

function useFramer() {
  const [framer, setFramer] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    import('framer-motion')
      .then((m) => {
        if (mounted) setFramer(m)
      })
      .catch(() => {
        // ignore — fallback will be used
      })
    return () => {
      mounted = false
    }
  }, [])

  return framer
}

export function MotionContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  const framer = useFramer()
  if (!framer) {
    return <div className={className}>{children}</div>
  }
  const { motion } = framer
  return (
    <motion.div variants={containerStagger} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export function MotionItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const framer = useFramer()
  if (!framer) {
    return <div className={className}>{children}</div>
  }
  const { motion } = framer
  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
