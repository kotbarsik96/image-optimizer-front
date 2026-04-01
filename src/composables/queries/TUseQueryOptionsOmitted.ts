import type { UseQueryOptions } from '@tanstack/vue-query'

export type TUseQueryOptionsOmitted = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
