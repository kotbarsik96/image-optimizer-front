import type { EProgressStatus } from '@/interfaces/Progress/IProgress'

export interface IOptimizationEntity {
  id: number
  project_id: number
  title: string
  extensions: string
  sizes: string
  progress_status: EProgressStatus
  created_at: string
  updated_at: string
}
