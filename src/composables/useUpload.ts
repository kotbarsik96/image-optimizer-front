import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

export function useUploadMutation(folderId: MaybeRefOrGetter<number>) {
  const api = useApi()
  const queryClient = useQueryClient()
  const { addNotification } = useNotifications()

  return useMutation({
    mutationFn: async (images: File[]) => {
      const body = new FormData()
      images.forEach((img) => body.append('images', img))

      const response = await api.request(`/folders/upload/${toValue(folderId)}`, {
        method: 'POST',
        body,
      })

      const data = (await response?.json()) as IResponseWrapper<{ folder: IFolderEntity }>

      if (response?.ok) {
        queryClient.invalidateQueries({
          queryKey: [EQueryKeys.Folder, data.data?.folder.id],
        })
      } else throw new Error(data.error)

      return data
    },
    onSuccess(data) {
      if (data.message) addNotification('info', data.message)
    },
    onError(error) {
      if (error.message) addNotification('error', error.message)
    },
  })
}
