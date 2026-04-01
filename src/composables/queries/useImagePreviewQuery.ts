import type { Api } from '@/api/Api'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import type { TUseQueryOptionsOmitted } from '@/composables/queries/TUseQueryOptionsOmitted'
import { useApi } from '@/composables/useApi'
import { useQuery, type UseQueryOptions } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'

export async function getImagePreviewUrl(api: Api, imageId: number) {
  const response = await api.request(`/images/${imageId}`, {
    method: 'GET',
  })

  let url = ''

  if (response?.ok) {
    const data = await response.blob()
    url = URL.createObjectURL(data)
  } else {
    const data = (await response?.json()) as IResponseWrapper<void>
    throw new Error(data.error)
  }

  return url
}

export function useImagePreviewQuery(
  imageId: MaybeRefOrGetter<number>,
  options?: TUseQueryOptionsOmitted,
) {
  const api = useApi()

  const defaultOptions: UseQueryOptions = {
    queryKey: [EQueryKeys.ImagePreview, imageId],
    queryFn: async () => await getImagePreviewUrl(api, toValue(imageId)),
  }

  const _options: UseQueryOptions<string> = Object.assign(
    { ...defaultOptions } as UseQueryOptions<string>,
    options,
  )

  return useQuery(_options)
}
