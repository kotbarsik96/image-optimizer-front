<template>
  <div class="notification" :style="styles">
    <component class="icon" :is="icon" />
    <button class="close" type="button" @click="close">
      <CloseIcon />
    </button>
    <div class="body">
      <span>
        {{ data.content }}
      </span>
    </div>
    <div class="timer">
      <span :style="timerStyles"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import SuccessIcon from '@/assets/icons/success.svg'
import ErrorIcon from '@/assets/icons/alert.svg'
import InfoIcon from '@/assets/icons/info.svg'
import CloseIcon from '@/assets/icons/close.svg'
import { useNotifications } from '@/composables/useNotifications'
import type { INotification } from '@/interfaces/Notification/INotification'
import { computed } from 'vue'
import { useTimer } from '@/composables/useTimer'
import type { NotificationSeverity } from '@/interfaces/Notification/NotificationSeverity'

const { removeNotification } = useNotifications()
const { timeSource } = useTimer(250)

const props = defineProps<{
  data: INotification
}>()

const dataMap: Record<NotificationSeverity, { icon: any; color: string }> = {
  error: {
    icon: ErrorIcon,
    color: 'var(--error)',
  },
  info: {
    icon: InfoIcon,
    color: 'var(--primary-2)',
  },
  success: {
    icon: SuccessIcon,
    color: 'var(--success)',
  },
}

const icon = computed(() => dataMap[props.data.severity].icon)

const timerPercent = computed(() => {
  const passedTime = timeSource.value - props.data.createdAt.getTime()
  return passedTime / (props.data.holdTime / 100)
})

const styles = computed(() => {
  return {
    '--timer-duration': `${props.data.holdTime / 1000}s`,
    '--n-severity-color': dataMap[props.data.severity].color,
  }
})
const timerStyles = computed(() => {
  return {
    width: `${timerPercent.value}%`,
  }
})

function close() {
  removeNotification(props.data.id)
}
</script>

<style lang="scss" scoped>
.notification {
  --timer-height: 6px;

  background-color: var(--white);
  position: relative;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: var(--b-radius-sm) var(--b-radius-big) var(--b-radius-sm) var(--b-radius-big);
  padding: 0.625rem;
  overflow: hidden;

  .icon {
    position: absolute;
    top: 0.625rem;
    left: 0.625rem;
    width: 1.5rem;
    height: auto;
    aspect-ratio: 1;
    color: var(--n-severity-color);
  }

  .close {
    position: absolute;
    top: 0.625rem;
    right: 0.625rem;

    svg {
      width: 1.5rem;
      height: auto;
      aspect-ratio: 1;
      color: var(--secondary);
    }
  }

  .body {
    color: var(--secondary);
    font: var(--text-medium-18);
    padding-block-start: 2rem;
    padding-block-end: 1rem;
  }

  .timer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--timer-height);
    background-color: var(--gray-200);
    overflow: hidden;
    border-radius: 8px;

    span {
      position: absolute;
      display: inline-block;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--timer-percent);
      background-color: var(--n-severity-color);
      transition: all 250ms linear;
    }
  }
}
</style>
