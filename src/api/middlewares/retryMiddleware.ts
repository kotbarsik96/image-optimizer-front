import type { IQueryContext } from '@/api/interfaces/IQueryContext'
import type { TMiddleware } from '@/api/interfaces/TMiddleware'
import { ServerStatuses } from '@/api/ServerStatuses'

/** Коды ответа от сервера, при которых вызывать повторный запрос */
const repeatFetchCodes = [
  ServerStatuses.TOO_MANY_REQUESTS,
  ServerStatuses.SERVER_ERROR,
  ServerStatuses.BAD_GATEWAY,
  ServerStatuses.SERVICE_UNAVAILABLE,
  ServerStatuses.GATEWAY_TIMEOUT,
]

type TRetryStrategyBuilder = (
  /** максимальное количество повторов запроса */
  maxRetries?: number,
  /** начальный перерыв до следующего запроса в мс */
  timeout?: number,
  /** множитель начального перерыва (перерыв до каждого последующий запроса больше предыдущего в timeoutMultipler раз) */
  timeoutMultiplier?: number,
) => TRetryStrategy

export type TRetryStrategy = (ctx: IQueryContext) => Promise<boolean>

export const retryMiddlewareBuilder: (retryStrategy: TRetryStrategy) => TMiddleware = (
  retryStrategy,
) => {
  return async (ctx, next) => {
    if (!ctx.meta.retries) ctx.meta.retries = 0

    while (true) {
      await next(ctx)
      if (ctx.response && repeatFetchCodes.includes(ctx.response.status)) {
        const keepTrying = await retryStrategy(ctx)
        if (keepTrying) {
          ctx.meta.retries++
        } else break
      } else break
    }
  }
}

export const simpleRetryStrategy: TRetryStrategyBuilder = (
  maxRetries = 3,
  timeout = 1000,
  timeoutMultipler = 3,
) => {
  return (ctx: IQueryContext) => {
    return new Promise((resolve) => {
      if (ctx.meta.retries < maxRetries) {
        setTimeout(() => resolve(true), timeout * (ctx.meta.retries || 1) * timeoutMultipler)
      } else resolve(false)
    })
  }
}
