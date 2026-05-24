import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface UIContextValue {
  darkMode: boolean
  toggleDarkMode: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (value: boolean) => void
  newsletterEmail: string
  setNewsletterEmail: (email: string) => void
  subscribed: boolean
  subscribe: (email: string) => void
  subscriberCount: number
}

const UIContext = createContext<UIContextValue | undefined>(undefined)

const readStoredJson = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => readStoredJson('gridaan_darkMode', false))
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    localStorage.setItem('gridaan_darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const value = useMemo<UIContextValue>(() => ({
    darkMode,
    toggleDarkMode: () => setDarkMode((current) => !current),
    searchQuery,
    setSearchQuery,
    mobileMenuOpen,
    setMobileMenuOpen,
    newsletterEmail,
    setNewsletterEmail,
    subscribed,
    subscribe: () => {
      setSubscribed(true)
      setNewsletterEmail('')
    },
    subscriberCount: 24680,
  }), [darkMode, mobileMenuOpen, newsletterEmail, searchQuery, subscribed])

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const context = useContext(UIContext)
  if (!context) throw new Error('useUI must be used within UIProvider')
  return context
}
