<template>
  <div class="notifications-container">
    <TransitionGroup name="notification-anim">
      <NotificationItem v-for="item in notifications" :key="item.id" :data="item" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import NotificationItem from '@/components/_UI/notifications/NotificationItem.vue'
import { useNotificationsStore } from '@/stores/notificationsStore'

const store = useNotificationsStore()
const { getNotificationsList } = store

const notifications = getNotificationsList()
</script>

<style lang="scss" scoped>
.notifications-container {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 400px;
  max-width: 90%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
