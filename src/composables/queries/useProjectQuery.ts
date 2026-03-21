import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import { useApi } from '@/composables/useApi'
import { useQuery } from '@tanstack/vue-query'

export function useProjectsListQuery() {
  const api = useApi()

  const queryKey = ['projects']

  const queryWrapper = () =>
    useQuery<IResponseWrapper<IProjectEntity[]>>({
      queryKey,
      queryFn: async () => {
        const response = await api.request('/projects/', {
          method: 'GET',
        })

        return await response?.json()
      },
    })

  return {
    queryKey,
    queryWrapper,
  }
}
