import type { NotificationSeverity } from '@/interfaces/Notification/NotificationSeverity'
import { useNotificationsStore } from '@/stores/notificationsStore'

export type TNotificationID = string | ReturnType<typeof self.crypto.randomUUID>

export interface INotificationsComposable {
  addNotification(severity: NotificationSeverity, content: string, holdTime?: number): () => void
}

export function useNotifications(): INotificationsComposable {
  const { addNotification: storeAdd, removeNotification: storeRemove } = useNotificationsStore()

  /** добавляет нотификацию и возвращает функцию, её удаляющую преждевременно */
  function addNotification(severity: NotificationSeverity, content: string, holdTime?: number) {
    const id = storeAdd(severity, content, holdTime)
    return () => storeRemove(id)
  }

  return { addNotification }
}
