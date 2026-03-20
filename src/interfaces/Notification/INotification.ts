import type { NotificationSeverity } from '@/interfaces/Notification/NotificationSeverity'

export interface INotification {
  id: string
  severity: NotificationSeverity
  content: string
  createdAt: Date
  holdTime: number
}
