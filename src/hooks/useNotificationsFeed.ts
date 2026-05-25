import { useEffect } from 'react'
import { useNotifications } from '../context/NotificationContext'
import { useArticles } from './useArticles'

/** Seeds trending alerts when articles load; runs once per session. */
export function useNotificationsFeed() {
  const { addNotification, notifications } = useNotifications()
  const { data: articles = [] } = useArticles()

  useEffect(() => {
    if (articles.length === 0) return
    const seeded = sessionStorage.getItem('gridaan.notifications.seeded')
    if (seeded) return

    const trending = articles.filter((a) => a.trending).slice(0, 2)
    for (const article of trending) {
      addNotification({
        type: 'trending_alert',
        title: 'Trending now',
        message: article.title,
        href: `/article/${article.slug}`,
      })
    }

    const latest = articles[0]
    if (latest) {
      addNotification({
        type: 'article_published',
        title: 'New on Gridaan',
        message: latest.title,
        href: `/article/${latest.slug}`,
      })
    }

    sessionStorage.setItem('gridaan.notifications.seeded', '1')
  }, [articles, addNotification, notifications.length])
}
