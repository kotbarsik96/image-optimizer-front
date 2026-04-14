import {
  EProgressStatus,
  type EProgressEntityName,
  type IProgressData,
  type IProgressEntity,
} from '@/interfaces/Progress/IProgress'
import { SSE_STREAM_CLOSED } from '@/interfaces/SSE/ISSE'
import { useProgressStore } from '@/stores/progressStore'
import { storeToRefs } from 'pinia'
import { computed, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

export function useProgress(
  entityName: EProgressEntityName,
  entity: MaybeRefOrGetter<IProgressEntity | undefined>,
  onDone?: () => void,
) {
  const store = useProgressStore()
  const { newEventSourceListener } = store
  const { progressSources } = storeToRefs(store)

  const entityVal = computed(() => toValue(entity))

  const source = computed(() => {
    let s: Ref<IProgressData> | undefined

    if (entityVal.value) {
      s = progressSources.value.find(
        (ps) => ps.value.entity_id === entityVal.value!.id && ps.value.entity_name === entityName,
      )
    }

    return s?.value
  })

  watch(() => toValue(entity), onEntityChange)

  onEntityChange(toValue(entity))

  function onEntityChange(entity: IProgressEntity | undefined) {
    if (entity && entity.progress_status === EProgressStatus.ProgressPending) {
      newEventSourceListener(entityName, onMessage)
    }
  }

  function onMessage(event: MessageEvent) {
    if (event.data === SSE_STREAM_CLOSED) return

    const data = JSON.parse(event.data) as IProgressData
    if (data.progress_value >= 100 && data.entity_id === entityVal.value?.id) {
      onDone?.()
    }
  }

  return {
    source,
  }
}
