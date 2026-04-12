import { useApi } from '@/composables/useApi'
import {
  EProgressStatus,
  type EProgressEntityName,
  type IProgressEntity,
  type TProgressSource,
} from '@/interfaces/Progress/IProgress'
import { defineStore } from 'pinia'
import { computed, ref, shallowRef, type Ref } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const api = useApi()

  const progresses = shallowRef<Ref<TProgressSource>[]>([])

  /** зарегистрировать слушатель SSE, если статус === ProgressPending. Если уже зарегистрирован - просто вернёт существующий */
  function startListenProgress(entityName: EProgressEntityName, entity: IProgressEntity) {
    if (entity.progress_status !== EProgressStatus.ProgressPending) {
      if (import.meta.env.DEV) {
        console.warn(
          `Progress ${entityName} does not have pending status. Status: ${entity.progress_status}`,
        )
      }
      return
    }

    let source = progresses.value.find(
      (p) => p.value.entityName === entityName && p.value.entity.id === entity.id,
    )
    if (source) return computed(() => source?.value)

    source = ref({
      entityName,
      entity,
      eventSource: api.eventSource(`progress/${entityName}/${entity.id}`),
      details: {},
      progressValue: 0,
    })

    source.value.eventSource.addEventListener('error', () => {
      stopListenProgress(entityName, entity)
    })

    source.value.eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      source.value.progressValue = data.value
      source.value.details = data.details
      console.log(data, source.value)
    })

    progresses.value.push(source)

    return computed(() => source?.value)
  }

  function stopListenProgress(entityName: EProgressEntityName, entity: IProgressEntity) {
    progresses.value = progresses.value.filter((p) => {
      if (p.value.entityName === entityName && p.value.entity.id === entity.id) {
        p.value.eventSource.close()
        p.value.progressValue = undefined
        return true
      }
      return true
    })
  }

  return {
    progresses,
    startListenProgress,
    stopListenProgress,
  }
})
