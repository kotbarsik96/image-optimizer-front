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

export interface IProgressData {
  entity_id: number
  progress_value: number
  details: TProgressDetails
  done: boolean
}

export interface IProgressDataSource extends IProgressData {
  entity_name: EProgressEntityName
}

export interface IProgressCloseEvent {
  close_event: boolean
}
