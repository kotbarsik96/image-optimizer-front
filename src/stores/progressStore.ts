import { useApi } from '@/composables/useApi'
import type {
  EProgressEntityName,
  IProgressData,
  IProgressDataSource,
} from '@/interfaces/Progress/IProgress'
import { SSE_STREAM_CLOSED } from '@/interfaces/SSE/ISSE'
import { defineStore } from 'pinia'
import { ref, shallowRef, type Ref } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const eventSources = new Map<EProgressEntityName, EventSource>()
  const progressSources = shallowRef<Ref<IProgressDataSource>[]>([])
  const api = useApi()

  function newEventSource(name: EProgressEntityName) {
    const es = api.eventSource(`progress/${name}`)
    eventSources.set(name, es)

    es.addEventListener('error', () => {
      es.close()
      eventSources.delete(name)
      console.warn(`Ошибка при отслеживании прогресса ${name}`)
    })
    es.addEventListener('message', (event: MessageEvent) => {
      if (event.data === SSE_STREAM_CLOSED) {
        es.close()
        eventSources.delete(name)
        return
      }

      const data = JSON.parse(event.data) as IProgressData

      let ps = progressSources.value.find(
        (s) => s.value.entity_name === name && s.value.entity_id === data.entity_id,
      )
      if (!ps) {
        ps = ref({
          entity_id: data.entity_id,
          entity_name: name,
          progress_value: data.progress_value,
          details: data.details,
          done: data.done,
        })
        progressSources.value = [...progressSources.value, ps]
      }

      ps.value.progress_value = data.progress_value
      ps.value.details = data.details
      ps.value.done = true

      if (data.done) {
        progressSources.value = progressSources.value.filter((v) => {
          if (v.value.entity_name === name && v.value.entity_id === data.entity_id) return false
          return true
        })
      }
    })

    return es
  }

  function newEventSourceListener(
    name: EProgressEntityName,
    onMessage?: (event: MessageEvent) => void,
  ) {
    let es = eventSources.get(name)
    if (!es) es = newEventSource(name)
    if (onMessage) es.addEventListener('message', onMessage)
  }

  function removeEventSourceListener(
    name: EProgressEntityName,
    onMessage: (event: MessageEvent) => void,
  ) {
    const es = eventSources.get(name)
    es?.removeEventListener('message', onMessage)
  }

  return {
    progressSources,
    newEventSourceListener,
    removeEventSourceListener,
  }
})
