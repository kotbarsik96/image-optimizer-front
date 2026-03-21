export interface IResponseWrapper<T> {
  ok: boolean
  message?: string
  data?: T
  error: string
}
