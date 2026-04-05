import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import {
  EProgressStatus,
  type EProgressEntityName,
  type IProgressEntity,
  type TProgressSource,
} from '@/interfaces/Progress/IProgress'
import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const api = useApi()

  const progresses = shallowRef<TProgressSource[]>([])

  function startListenProgress(entityName: EProgressEntityName, entity: IProgressEntity) {
    if (entity.progress_status !== EProgressStatus.ProgressPending) {
      console.warn(
        `Progress ${entityName} does not have pending status. Status: ${entity.progress_status}`,
      )
      return
    }

    if (progresses.value.find((p) => p.entityName === entityName && p.entity.id === entity.id)) {
      console.warn(`Progress for ${entityName}.${entity.id} already registered`)
      return
    }

    const source: TProgressSource = {
      entityName,
      entity,
      eventSource: api.eventSource(`${entityName}/${entity.id}`),
      details: {},
      value: 0,
    }

    source.eventSource.addEventListener('error', () => {
      stopListenProgress(entityName, entity)
    })

    source.eventSource.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      source.value = data.value
      source.details = data.details
    })

    progresses.value.push(source)

    return source
  }

  function stopListenProgress(entityName: EProgressEntityName, entity: IProgressEntity) {
    progresses.value = progresses.value.filter((p) => {
      if (p.entityName === entityName && p.entity.id === entity.id) {
        p.eventSource.close()
        return false
      }
      return true
    })
  }

  function getProgress() {}

  return {
    progresses,
    startListenProgress,
    stopListenProgress,
  }
})
