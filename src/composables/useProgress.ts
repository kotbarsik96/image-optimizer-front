import {
  EProgressStatus,
  type EProgressEntityName,
  type IProgressEntity,
  type TProgressSource,
} from '@/interfaces/Progress/IProgress'
import { useProgressStore } from '@/stores/progressStore'
import { computed, toValue, type ComputedRef, type MaybeRefOrGetter, type Ref } from 'vue'

export function useProgress(
  entityName: EProgressEntityName,
  entity: MaybeRefOrGetter<IProgressEntity>,
) {
  const store = useProgressStore()
  const { getOrStartListeningProgress } = store

  const source = computed(() => {
    let s: Ref<TProgressSource> | undefined
    const e = toValue(entity)
    if (e.progress_status === EProgressStatus.ProgressPending) {
      s = getOrStartListeningProgress(entityName, e)
    }
    return s?.value
  })

  return {
    source,
  }
}
