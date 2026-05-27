import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
 
import { Bell, Bookmark, Flame, Megaphone, Newspaper, Settings, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useNotifications } from '../../context/NotificationContext'
import type { NotificationType } from '../../types/notification'

const typeIcons: Record<NotificationType, typeof Bell> = {
  article_published: Newspaper,
  article_bookmarked: Bookmark,
  admin_update: Settings,
  trending_alert: Flame,
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const Icon = typeIcons[type] ?? Megaphone
  return <Icon className="h-4 w-4 shrink-0 text-[#14B8A6]" aria-hidden />
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    removeNotification,
    clearAll,
  } = useNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative rounded-lg p-2 text-[#94A3B8] transition-all hover:bg-[#0B1224]/80 hover:text-[#2563EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
          unreadCount > 0 ? 'shadow-[0_0_20px_rgba(37,99,235,0.35)]' : ''
        }`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

        {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 z-[60] mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1224]/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-96 transition transform duration-200 ease-out"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h2 className="text-sm font-semibold text-white">Notifications</h2>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="text-xs font-medium text-[#14B8A6] hover:text-[#5eead4]"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close notifications"
                  className="rounded-lg p-1 text-[#94A3B8] hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <ul className="max-h-[min(60vh,24rem)] overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-[#64748B]">
                  You&apos;re all caught up.
                </li>
              ) : (
                notifications.map((item) => (
                  <li
                    key={item.id}
                    className={`border-b border-white/5 last:border-0 ${
                      !item.read ? 'bg-[#2563EB]/5' : ''
                    }`}
                  >
                    <div className="flex gap-3 px-4 py-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-[#080d1a]/80 ring-1 ring-white/10">
                        <NotificationIcon type={item.type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        {item.href ? (
                          <Link
                            to={item.href}
                            onClick={() => {
                              markAsRead(item.id)
                              setOpen(false)
                            }}
                            className="block"
                          >
                            <p className="text-sm font-medium text-white line-clamp-1">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-xs text-[#94A3B8] line-clamp-2">
                              {item.message}
                            </p>
                          </Link>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-white line-clamp-1">
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-xs text-[#94A3B8] line-clamp-2">
                              {item.message}
                            </p>
                          </>
                        )}
                        <p className="mt-1 text-[10px] text-[#64748B]">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNotification(item.id)}
                        aria-label="Dismiss notification"
                        className="shrink-0 self-start rounded p-1 text-[#64748B] hover:bg-white/5 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>

            {notifications.length > 0 && (
              <div className="border-t border-white/10 px-4 py-2">
                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full rounded-lg py-2 text-xs font-medium text-[#64748B] hover:bg-white/5 hover:text-[#94A3B8]"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  )
}
