import { useTimer } from '@/composables/useTimer'
import type { INotification } from '@/interfaces/Notification/INotification'
import type { NotificationSeverity } from '@/interfaces/Notification/NotificationSeverity'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const _default_notification_hold_time = 7500
const _notifications_garbage_collector_interval = 10000
const _max_notifications = 10

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<INotification[]>([])

  setInterval(() => {
    const now = Date.now()
    notifications.value = notifications.value.filter(
      (n) => now < n.createdAt.getTime() + n.holdTime,
    )
  }, _notifications_garbage_collector_interval)

  function addNotification(severity: NotificationSeverity, content: string, holdTime?: number) {
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
})
