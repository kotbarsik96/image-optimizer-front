import type { IQueryContext } from '@/api/interfaces/IQueryContext'

export type TMiddleware = (ctx: IQueryContext, next: TQueryDelegate) => Promise<void>

export type TQueryDelegate = (ctx: IQueryContext) => Promise<void>
