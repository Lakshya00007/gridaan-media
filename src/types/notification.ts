export type NotificationType =
  | 'article_published'
  | 'article_bookmarked'
  | 'admin_update'
  | 'trending_alert'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  href?: string
  read: boolean
  createdAt: string
}
