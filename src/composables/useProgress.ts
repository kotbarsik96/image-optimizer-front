import {
  EProgressStatus,
  type EProgressEntityName,
  type IProgressEntity,
  type TProgressSource,
} from '@/interfaces/Progress/IProgress'
import { useProgressStore } from '@/stores/progressStore'
import { type ComputedRef } from 'vue'

export function useProgress(entityName: EProgressEntityName, entity: IProgressEntity) {
  const store = useProgressStore()
  const { startListenProgress } = store

  let source: ComputedRef<TProgressSource | undefined> | undefined

  if (entity.progress_status == EProgressStatus.ProgressPending) {
    source = startListenProgress(entityName, entity)
  }

  return {
    source,
  }
}
