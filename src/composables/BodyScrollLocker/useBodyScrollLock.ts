import { onUnmounted, ref, useId, watch } from 'vue'
import { bodyScrollLocker } from '@/composables/BodyScrollLocker/bodyScrollLocker'

const _subscribers = ref<string[]>([])

export const useBodyScrollLock = (key?: string) => {
  const id = key ?? useId()

  onUnmounted(() => {
    unlock()
  })

  function lock() {
    if (!_subscribers.value.includes(id)) _subscribers.value.push(id)
  }

  function unlock() {
    _subscribers.value = _subscribers.value.filter((k) => k !== id)
  }

  return { lock, unlock }
}

export const useBodyScrollLocker = () => {
  watch(
    () => _subscribers.value.length,
    (length) => {
      if (length > 0) bodyScrollLocker.lock()
      else bodyScrollLocker.unlock()
    },
  )
}
