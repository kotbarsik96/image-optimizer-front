import type { EProgressActionName } from '@/interfaces/Progress/IProgress'
import { useProgressStore } from '@/stores/progressStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export function useProgress(actionName: EProgressActionName, actionId: number) {
  const progressStore = useProgressStore()
  const { progresses } = storeToRefs(progressStore)

  const currentProgress = computed(() => {
    return progresses.value[actionName][actionId]?.value
  })

  return {
    currentProgress,
  }
}
