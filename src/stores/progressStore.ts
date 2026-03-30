import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { ServerStatuses } from '@/api/ServerStatuses'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import {
  EProgressActionName,
  type TProgressActions,
  type TProgressActionsRaw,
} from '@/interfaces/Progress/IProgress'
import { useQuery } from '@tanstack/vue-query'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useProgressStore = defineStore('progress', () => {
  const api = useApi()
  const { t } = useI18n()
  const { addNotification } = useNotifications()

  const progresses = ref<TProgressActions>({
    [EProgressActionName.Optimizations]: {},
  })

  const {} = useQuery({
    queryKey: [EQueryKeys.Progresses],
    queryFn: async () => {
      const response = await api.request('/progress/sync', {
        method: 'GET',
      })

      const data = (await response?.json()) as IResponseWrapper<TProgressActionsRaw>

      if (response?.ok && data.data) {
        const actionNames = Object.keys(progresses.value) as EProgressActionName[]
        actionNames.forEach((actionName) => {
          const valuesRaw = data.data![actionName]
          for (let actionId in valuesRaw) {
            const value = Number(valuesRaw[actionId]?.toFixed(2) ?? 0)
            newProgress(actionName, Number(actionId), value)
          }
        })
      } else {
        if (response?.status == ServerStatuses.UNAUTHORIZED) {
          addNotification('error', t('general.unauthorizedProgresses'))
        }
      }

      return data
    },
    refetchOnWindowFocus: false,
  })

  /** вызывается при регистрации нового действия: регистрирует eventSource для получения server-sent event'ов обновления прогресса
   *
   * в случае, если действие зарегистрировано - ничего не сделает
   */
  function newProgress(actionName: EProgressActionName, actionId: number, initialValue = 0) {
    let data = progresses.value[actionName][actionId]

    if (!data) {
      progresses.value[actionName][actionId] = {
        value: initialValue,
      }
      data = progresses.value[actionName][actionId]
    }

    if (data.eventSource) return

    data.eventSource = api.eventSource(`progress/${actionName}/${actionId}`)
    data.eventSource.addEventListener('message', (event) => {
      data.value = Number(Number(event.data).toFixed(2))
      if (data.value >= 100) finishProgress(actionName, actionId)
    })
  }

  /** вызывается, когда значение прогресса достигло 100: закрывает eventSource */
  function finishProgress(actionName: EProgressActionName, actionId: number) {
    const data = progresses.value[actionName][actionId]
    if (data) {
      const { eventSource } = data
      eventSource?.close()
      data.value = 100
    }
  }

  return {
    progresses,
    newProgress,
    finishProgress,
  }
})
