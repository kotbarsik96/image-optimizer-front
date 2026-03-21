import type { TMiddleware } from '@/api/interfaces/TMiddleware'

export const initHeadersMiddleware: TMiddleware = async (ctx, next) => {
  // if (!ctx.options.headers || ctx.options.headers instanceof Headers == false) {
  //   ctx.options.headers = new Headers(ctx.options.headers)
  // }
  // const { headers } = ctx.options

  // if (!headers.get('Content-Type')) headers.set('Content-Type', EContentType.ApplicationJson)

  await next(ctx)
}
