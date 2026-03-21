import type { TRequestMethod } from '@/api/interfaces/TRequestMethod'

export interface IQueryOptions extends Omit<RequestInit, 'body'> {
  baseUrl?: string

  method: TRequestMethod

  body?: Record<string, any> | string

  // для запросов, не принимающих body (get/delete)
  query?: Record<string, any>
}
