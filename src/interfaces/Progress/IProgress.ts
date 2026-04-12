export enum EProgressEntityName {
  Optimizations = 'optimizations',
  Uploads = 'uploads',
}

export enum EProgressStatus {
  ProgressCreated = 1,
  ProgressPending,
  ProgressDone,
}

export interface IProgressEntity {
  id: number
  progress_status: EProgressStatus
}

export type TProgressDetails = Record<string, TProgressDetailItem>

export type TProgressDetailItem = {
  error?: string
  done: boolean
  meta: Record<string, any>
}

export type TProgressSource = {
  entityName: EProgressEntityName
  entity: IProgressEntity
  eventSource: EventSource
  progressValue: number | undefined
  details: TProgressDetails
}
