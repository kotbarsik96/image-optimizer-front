import { EContentType } from '@/api/interfaces/EContentType'
import type { TMiddleware } from '@/api/interfaces/TMiddleware'
import { removeEmptyProperties } from '@/utils/common'

export const fetchMiddleware: TMiddleware = async (ctx, next) => {
  let path = ctx.path

  // GET/DELETE
  if (ctx.options.query) {
    const filteredQuery = removeEmptyProperties(ctx.options.query)
    const params =
      filteredQuery && Object.values(filteredQuery).length
        ? `?${new URLSearchParams(filteredQuery)}`
        : ''
    path += params
  }

  // POST/PUT
  if (ctx.options.body && ctx.options.body instanceof FormData == false) {
    const body = new FormData()
    Object.entries(ctx.options.body).forEach(([key, value]) => {
      body.append(key, value)
    })
    ctx.options.body = body
  }

  const url = `${ctx.options.baseUrl || ''}${path}`
  ctx.response = await fetch(url, ctx.options as any)

  await next(ctx)
}
