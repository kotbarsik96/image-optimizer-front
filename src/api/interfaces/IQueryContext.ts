import type { Api } from '@/api/Api'
import type { IQueryOptions } from '@/api/interfaces/IQueryOptions'
import type { IRequestProcessOptions } from '@/api/interfaces/IRequestProcessOptions'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'

export interface IQueryContext {
  path: string
  options: IQueryOptions
  requestProcessOptions?: IRequestProcessOptions
  meta: Record<string, any>
  response: null | Response
  api: Api
}
