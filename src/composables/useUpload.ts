import type { IFolderEntity } from '@/api/entities/Folder/IFolderEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { useApi } from '@/composables/useApi'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

export function useUploadMutation(folderId: number) {
  const api = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (images: File[]) => {
      const body = new FormData()
      images.forEach((img) => body.append('images', img))

      const response = await api.request(`/folders/upload/${folderId}`, {
        method: 'POST',
        body,
      })

      const data = (await response?.json()) as IResponseWrapper<{ folder: IFolderEntity }>

      if (response?.ok) {
        queryClient.invalidateQueries({
          queryKey: [EQueryKeys.Folder, data.data?.folder.id],
        })
      }

      return data
    },
  })
}
