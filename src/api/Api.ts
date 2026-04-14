import type { IQueryContext } from '@/api/interfaces/IQueryContext'
import type { IQueryOptions } from '@/api/interfaces/IQueryOptions'
import type { IRequestProcessOptions } from '@/api/interfaces/IRequestProcessOptions'
import type { TMiddleware, TQueryDelegate } from '@/api/interfaces/TMiddleware'
import { fetchMiddleware } from '@/api/middlewares/fetchMiddleware'
import { initHeadersMiddleware } from '@/api/middlewares/initHeadersMiddleware'
import { retryMiddlewareBuilder, simpleRetryStrategy } from '@/api/middlewares/retryMiddleware'
import { type INotificationsComposable } from '@/composables/useNotifications'

export class Api {
  private middlewares: TMiddleware[]

  constructor(
    private baseUrl: string,
    private notifications: INotificationsComposable,
  ) {
    if (this.baseUrl.endsWith('/')) this.baseUrl = this.baseUrl.slice(0, -1)
    this.middlewares = [
      retryMiddlewareBuilder(simpleRetryStrategy()),
      initHeadersMiddleware,
      fetchMiddleware,
    ]
  }

  async request(
    path: string,
    options: IQueryOptions,
    requestProcessOptions?: IRequestProcessOptions,
  ) {
    let delegate: TQueryDelegate = (_: IQueryContext) => Promise.resolve()
    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!
      const previousDelegate = delegate
      delegate = (ctx: IQueryContext) => middleware(ctx, previousDelegate)
    }

    const _options = Object.assign({ baseUrl: this.baseUrl, credentials: 'include' }, options)

    const ctx: IQueryContext = {
      path,
      options: _options,
      requestProcessOptions,
      meta: {},
      api: this,
      response: null,
    }

    await delegate(ctx)

    if (!ctx.response?.ok) this.handleError(ctx)

    return ctx.response
  }

  private async handleError(ctx: IQueryContext) {
    // const statusCode = ctx.response?.status as ServerStatuses
    if (!ctx.requestProcessOptions?.noErrorNotifications) this.handleErrorWithMessage(ctx)
  }

  private async handleErrorWithMessage(ctx: IQueryContext) {}

  eventSource(path: string): EventSource {
    let _path = path
    if (_path.startsWith('/')) _path = _path.slice(1)
    const eventSource = new EventSource(`${this.baseUrl}/${_path}`, {
      withCredentials: true,
    })

    return eventSource
  }
}
