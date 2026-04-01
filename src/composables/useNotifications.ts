import { computed, ref, type ComputedRef } from 'vue'
import type { INotification } from '@/interfaces/Notification/INotification'
import type { NotificationSeverity } from '@/interfaces/Notification/NotificationSeverity'
import { useTimer } from '@/composables/useTimer'

export type TNotificationID = string | ReturnType<typeof self.crypto.randomUUID>

export interface INotificationsComposable {
  addNotification(
    severity: NotificationSeverity,
    content: string,
    holdTime?: number,
  ): TNotificationID
  getNotificationsList(): ComputedRef<INotification[]>
  removeNotification(id: TNotificationID): void
}

const notifications = ref<INotification[]>([])
const _default_notification_hold_time = 7500
const _max_notifications = 10

export function useNotifications(): INotificationsComposable {
  function addNotification(severity: NotificationSeverity, content: string, holdTime?: number) {
    notifications.value = notifications.value.filter(
      (item) => Date.now() < item.createdAt.getTime() + item.holdTime,
    )

    const id = self.crypto.randomUUID()
    notifications.value.push({
      id,
      severity,
      content,
      createdAt: new Date(),
      holdTime: holdTime || _default_notification_hold_time,
    })

    return id
  }

  function getNotificationsList() {
    const { timeSource } = useTimer()

    return computed(() => {
      return notifications.value
        .filter((item) => timeSource.value < item.createdAt.getTime() + item.holdTime)
        .slice(0, _max_notifications)
    })
  }

  function removeNotification(id: string) {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  return {
    addNotification,
    getNotificationsList,
    removeNotification,
  }
}
