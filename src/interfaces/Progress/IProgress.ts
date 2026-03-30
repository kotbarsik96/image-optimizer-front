export enum EProgressActionName {
  Optimizations = 'optimizations',
}

export type TProgressActions = Record<EProgressActionName, TActionProgresses>

export type TActionProgresses = Record<
  number,
  {
    eventSource?: EventSource
    value: number
  }
>

export type TProgressActionsRaw = Record<EProgressActionName, TActionProgressesRaw>

export type TActionProgressesRaw = Record<number, number>
