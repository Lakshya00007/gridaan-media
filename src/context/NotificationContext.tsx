import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AppNotification, NotificationType } from '../types/notification'

const STORAGE_KEY = 'gridaan.notifications.v1'
const MAX_NOTIFICATIONS = 50

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (input: {
    type: NotificationType
    title: string
    message: string
    href?: string
  }) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

function loadStored(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AppNotification[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(items: AppNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_NOTIFICATIONS)))
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadStored())

  useEffect(() => {
    persist(notifications)
  }, [notifications])

  const addNotification = useCallback(
    (input: { type: NotificationType; title: string; message: string; href?: string }) => {
      const item: AppNotification = {
        id: crypto.randomUUID(),
        type: input.type,
        title: input.title,
        message: input.message,
        href: input.href,
        read: false,
        createdAt: new Date().toISOString(),
      }
      setNotifications((prev) => [item, ...prev].slice(0, MAX_NOTIFICATIONS))
    },
    []
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllRead,
      removeNotification,
      clearAll,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllRead,
      removeNotification,
      clearAll,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return ctx
}
