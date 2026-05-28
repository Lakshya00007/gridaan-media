import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface AuthModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: React.ReactNode
}

export default function AuthModal({
  open,
  title,
  subtitle,
  onClose,
  children,
}: AuthModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onMouseDown={(e) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
              onClose()
            }
          }}
        >
          {/* Light, calm overlay (no dark/neon) */}
          <div className="absolute inset-0 bg-[#ffffff]/70 backdrop-blur-[2px]" />

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-3xl border border-[#e6e6e6] bg-white p-6 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="mb-5">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1c1c1c]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-[#6b6b6b]">
                  {subtitle}
                </p>
              )}
            </header>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

